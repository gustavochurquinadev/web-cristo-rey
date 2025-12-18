import { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Upload, FolderPlus, Folder, Save, Loader2, Scissors, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const ReceiptProcessor = () => {
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState([]);

  // Estados para gestión de carpetas
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(''); // ID de la carpeta
  const [selectedFolderName, setSelectedFolderName] = useState(''); // Nombre (Para el archivo)
  const [newFolderName, setNewFolderName] = useState('');
  const [loadingFolders, setLoadingFolders] = useState(false);

  // 🔴 URL DE TU SCRIPT
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyXbGHgsOlRZmIBxncD-rYWNZcib79fvO0t5HcesoF4C3tLfYh0U89ne3MdniGlT-KJVg/exec";
  const DNI_COLEGIO = "68738952";

  // Cargar carpetas al iniciar
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setLoadingFolders(true);
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'getFolders' })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setFolders(data.folders);
      }
    } catch (error) {
      console.error("Error cargando carpetas", error);
    } finally {
      setLoadingFolders(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const toastId = toast.loading("Creando carpeta...");
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'createFolder', folderName: newFolderName.toUpperCase() }) // Forzamos mayúsculas
      });
      const data = await res.json();
      if (data.status === 'success') {
        toast.success("Carpeta creada", { id: toastId });
        await fetchFolders(); // Recargar lista
        setSelectedFolder(data.id); // Seleccionar la nueva
        setSelectedFolderName(data.name);
        setNewFolderName('');
      }
    } catch (error) {
      toast.error("Error al crear carpeta", { id: toastId });
    }
  };

  const processPDF = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!selectedFolder) {
      toast.error("¡ALTO! Primero debes seleccionar o crear una carpeta de destino.");
      e.target.value = null; // Limpiar input
      return;
    }

    setProcessing(true);
    setLogs([`Iniciando proceso en carpeta: ${selectedFolderName}...`]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument(arrayBuffer.slice(0));
      const pdfTextDoc = await loadingTask.promise;
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();

      let processedCount = 0;

      for (let i = 0; i < totalPages; i++) {
        const pageText = await pdfTextDoc.getPage(i + 1);
        const textContent = await pageText.getTextContent();

        // 1. Encontrar DNI Docente por posición X/Y (Lógica robusta V4)
        let targetCuil = null;
        for (const item of textContent.items) {
          const text = item.str.trim();
          const cuilMatch = text.match(/^(\d{2})[-]?(\d{7,8})[-]?(\d{1})$/);
          if (cuilMatch && cuilMatch[2] !== DNI_COLEGIO) {
            targetCuil = { dni: cuilMatch[2], x: item.transform[4], y: item.transform[5] };
            break;
          }
        }

        if (targetCuil) {
          const dni = targetCuil.dni;

          // 2. Encontrar Legajo (Misma línea, a la derecha)
          let legajo = "0000";
          for (const item of textContent.items) {
            const text = item.str.trim();
            const sameLine = Math.abs(item.transform[5] - targetCuil.y) < 5;
            const toRight = item.transform[4] > targetCuil.x;
            if (sameLine && toRight && /^\d{1,5}$/.test(text)) {
              legajo = text.padStart(4, '0'); // Aseguramos 4 dígitos (0008)
              break;
            }
          }

          // 3. Recortar
          const singleDoc = await PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(pdfDoc, [i]);
          const { width, height } = copiedPage.getSize();
          const cutX = (width / 2) - 25;
          copiedPage.setCropBox(cutX, 0, width - cutX, height);
          singleDoc.addPage(copiedPage);

          const pdfBytes = await singleDoc.save();
          const base64 = await blobToBase64(new Blob([pdfBytes]));

          // 4. NOMBRE DEL ARCHIVO (El formato que pediste)
          // Formato: CARPETA_DNI_LEG_LEGAJO.pdf
          // Ej: NOVIEMBRE_2025_33627935_LEG_0008.pdf
          const fileName = `${selectedFolderName}_${dni}_LEG_${legajo}.pdf`;

          setLogs(prev => [`📤 Subiendo a ${selectedFolderName}: ${fileName}...`, ...prev]);

          // Enviamos folderId para que se guarde en la subcarpeta correcta
          await uploadToDrive(fileName, base64, selectedFolder);

          setLogs(prev => [`✅ OK: ${fileName}`, ...prev]);
          processedCount++;
        } else {
          setLogs(prev => [`⚠️ Pág ${i + 1}: Sin datos.`, ...prev]);
        }
      }
      toast.success(`Proceso terminado. ${processedCount} recibos en "${selectedFolderName}".`);
    } catch (error) {
      console.error(error);
      toast.error("Error crítico: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const blobToBase64 = (blob) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });

  const uploadToDrive = async (name, data, folderId) => {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'uploadReceipt',
        fileName: name,
        fileData: data,
        folderId: folderId // ¡Importante!
      })
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-200 my-10">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-cristo-primary text-white rounded-lg">
          <Scissors className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-serif text-cristo-primary font-bold">Procesador de Nómina</h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Sistema de Recorte y Distribución</p>
        </div>
      </div>

      {/* ZONA DE SELECCIÓN DE CARPETA (NUEVO) */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
        <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Folder className="w-4 h-4 text-cristo-accent" /> 1. ¿Dónde guardamos estos recibos?
        </h4>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Selector */}
          <div className="w-full md:w-1/2">
            <label className="text-xs text-gray-500 mb-1 block">Carpetas Existentes</label>
            <select
              value={selectedFolder}
              onChange={(e) => {
                setSelectedFolder(e.target.value);
                const name = e.target.options[e.target.selectedIndex].text;
                setSelectedFolderName(name);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cristo-primary bg-white"
            >
              <option value="">-- Seleccionar Carpeta --</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          <div className="text-gray-400 font-bold pb-3">O</div>

          {/* Creador */}
          <div className="w-full md:w-1/2 flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Crear Nueva (Ej: NOVIEMBRE_2025)</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value.toUpperCase())} // Auto mayúsculas
                placeholder="NOMBRE_AÑO"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cristo-primary"
              />
            </div>
            <button
              onClick={createFolder}
              disabled={!newFolderName}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <FolderPlus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ZONA DE CARGA (Bloqueada si no hay carpeta) */}
      <div className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${!selectedFolder ? 'opacity-50 pointer-events-none border-gray-200' : processing ? 'border-cristo-accent bg-blue-50' : 'border-gray-300 hover:border-cristo-primary hover:bg-gray-50 cursor-pointer'}`}>
        {!selectedFolder && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold">⚠️ Selecciona una carpeta primero</span>
          </div>
        )}

        <input type="file" onChange={processPDF} disabled={processing || !selectedFolder} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".pdf" />

        {processing ? (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-12 h-12 text-cristo-accent animate-spin mb-4" />
            <p className="text-xl font-bold text-gray-700">Procesando y Guardando...</p>
            <p className="text-sm text-gray-500">Destino: <strong>{selectedFolderName}</strong></p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-xl font-bold text-gray-700">2. Subir PDF Maestro</p>
            <p className="text-sm text-gray-400 mt-2">Se guardará como: <code className="bg-gray-100 px-1 rounded">{selectedFolderName || 'CARPETA'}_DNI_LEG_0000.pdf</code></p>
          </div>
        )}
      </div>

      {/* CONSOLA */}
      <div className="mt-8 bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs text-green-400 shadow-inner">
        {logs.map((log, i) => <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0">{log}</div>)}
      </div>
    </div>
  );
};

export default ReceiptProcessor;