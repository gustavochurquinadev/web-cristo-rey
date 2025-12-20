import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, ArrowUpCircle, X, DollarSign, Check, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  // CONFIGURACIÓN
  const GOOGLE_SCRIPT_URL_ADMIN = "https://script.google.com/macros/s/AKfycby6a9pr6g54of3nZ343bqxc6Xx3IdbWP21NUop4q6tmJJfWYmEOppw1uhfD-wVOVoLt2g/exec";

  // ESTADOS
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // FILTROS
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNivel, setFilterNivel] = useState("Todos");
  const [filterCurso, setFilterCurso] = useState("Todos");

  // MODALES
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // ESTADO FORMULARIO ALUMNO
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    dni: '', apellido: '', nombre: '', nivel: 'Inicial', grado: '5', division: 'A', turno: 'Mañana', isBecado: false, becaPorcentaje: 0
  });

  // ESTADO PAGOS
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payments, setPayments] = useState(null);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // --- 1. CARGAR DATOS ---
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL_ADMIN, {
        method: "POST",
        body: JSON.stringify({ action: "getAll" }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setStudents(data.students);
      } else {
        toast.error("Error al cargar alumnos: " + data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión con la base de datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- 2. FILTRADO ---
  const filteredStudents = students.filter(student => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      String(student.nombre || "").toLowerCase().includes(term) ||
      String(student.apellido || "").toLowerCase().includes(term) ||
      String(student.dni || "").includes(term);

    const matchesNivel = filterNivel === "Todos" || String(student.nivel || "").toLowerCase() === filterNivel.toLowerCase();

    // --- LÓGICA DE FILTRO DE CURSO ROBUSTA ---
    const matchesCurso = filterCurso === "Todos" || (() => {
      // 1. Normalizar Grado a Número Puro
      // El backend manda "1ro", "2do", "5". Con replace(/\D/g, "") obtenemos "1", "2", "5".
      const gRaw = String(student.grado || "");
      const gNum = gRaw.replace(/\D/g, "");

      // 2. Normalizar División (Sinónimos y formatos numéricos "1°", "2")
      let dRaw = String(student.division || "").trim().toLowerCase();
      const dClean = dRaw.replace(/[^a-z0-9]/g, ""); // "1°" -> "1", "A" -> "a"

      if (dRaw === "1era" || dRaw === "1ra" || dRaw === "1ea" || dClean === "1") dRaw = "1ra";
      if (dRaw === "2da" || dRaw === "2do" || dRaw === "segunda" || dClean === "2") dRaw = "2da";
      if (dRaw === "3ra" || dRaw === "3er" || dRaw === "tercera" || dClean === "3") dRaw = "3ra";
      // a, b, c quedan igual

      // 3. Construir ID Normalizado (match con los valores del option)
      // IDs definidos en el render: "sala_3_a", "1_1ra"
      let studentId = "";
      if (String(student.nivel || "").toLowerCase() === "inicial") {
        studentId = `sala_${gNum}_${dRaw}`;
      } else {
        studentId = `${gNum}_${dRaw}`;
      }

      return studentId === filterCurso;
    })();

    const isNotDeleted = student.estado !== "Baja";

    return matchesSearch && matchesNivel && matchesCurso && isNotDeleted;
  });

  // --- 3. BORRAR ---
  const handleDelete = async (id) => {
    if (confirm("⚠️ ¿Seguro que desea ELIMINAR a este alumno? (Se borrará de datos y pagos)")) {
      // Optimistic UI: Borrar inmediatamente de la vista
      const previousStudents = [...students];
      setStudents(prev => prev.filter(s => s.id !== id));

      const toastId = toast.loading("Eliminando en segundo plano...");

      try {
        await fetch(GOOGLE_SCRIPT_URL_ADMIN, {
          method: "POST",
          body: JSON.stringify({ action: "delete", id: id }),
        });
        toast.dismiss(toastId);
        toast.success("Alumno eliminado");
        // No refetch needed, already removed.
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Error al eliminar (Recargue la página)");
        setStudents(previousStudents); // Rollback on error
      }
    }
  };

  // --- 4. PROMOCIÓN AUTOMÁTICA ---
  const handlePromoteAll = async () => {
    if (confirm("⚠️ IMPORTANTE: CIERRE DE CICLO LECTIVO\n\nEsta acción ejecutará la 'Magia de Promoción':\n- Inicial 5 -> Pasa a 1° Grado\n- 7° Grado -> Pasa a 1° Año\n- 5° Año -> EGRESA\n- Todos los demás suben un grado.\n\n¿CONFIRMA EL CAMBIO DE AÑO?")) {
      const toastId = toast.loading("⏳ Procesando cierre de ciclo...");
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL_ADMIN, {
          method: "POST",
          body: JSON.stringify({ action: "promoteAll" }),
        });
        const data = await response.json();
        toast.dismiss(toastId);
        if (data.status === "success") {
          toast.success("¡Ciclo Lectivo Cerrado! Alumnos promovidos. 🎉");
          fetchStudents();
        } else {
          toast.error("Error: " + data.message);
        }
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Error de conexión al promover");
      }
    }
  };

  // --- 5. ABRIR MODAL ---
  const openNewStudentModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ dni: '', apellido: '', nombre: '', nivel: 'Inicial', grado: '5', division: 'A', turno: 'Mañana', isBecado: false, becaPorcentaje: 0 });
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setIsEditing(true);
    setEditId(student.id);
    setFormData({
      dni: student.dni,
      apellido: student.apellido,
      nombre: student.nombre,
      nivel: student.nivel,
      grado: String(student.grado),
      division: student.division,
      turno: student.turno,
      isBecado: student.isBecado || false,
      becaPorcentaje: student.becaPorcentaje || 0
    });
    setShowModal(true);
  };

  // --- 6. GUARDAR ---
  const handleSave = async (e) => {
    e.preventDefault();
    const actionType = isEditing ? "edit" : "create";

    // OPTIMISTIC UPDATE: ACTUAR YA, PENSAR DESPUÉS
    setShowModal(false);
    const previousStudents = [...students];

    if (isEditing) {
      // EDICIÓN
      setStudents(prev => prev.map(s => s.id === editId ? {
        ...s,
        ...formData,
        dni: String(formData.dni),
        becaPorcentaje: formData.isBecado ? formData.becaPorcentaje : 0
      } : s));
    } else {
      // CREACIÓN (Optimista)
      // Generamos un ID temporal para que aparezca ya en la lista
      const tempId = Date.now();
      const newStudent = {
        id: tempId,
        ...formData,
        dni: String(formData.dni),
        becaPorcentaje: formData.isBecado ? formData.becaPorcentaje : 0,
        saldo: "ADEUDA" // Default al crear
      };
      setStudents(prev => [newStudent, ...prev]);
      toast.info("Inscribiendo... (Ya visible)", { duration: 2000 });
    }

    const toastId = toast.loading("Sincronizando con Google...");

    try {
      await fetch(GOOGLE_SCRIPT_URL_ADMIN, {
        method: "POST",
        body: JSON.stringify({
          action: actionType,
          student: formData,
          id: isEditing ? editId : null
        }),
      });
      toast.dismiss(toastId);
      toast.success(isEditing ? "Cambios guardados" : "Alumno inscripto correctamente");

      // Background sync to get real IDs (indexes)
      fetchStudents();

    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error al guardar (Deshaciendo cambios)");
      setStudents(previousStudents); // Rollback si falla
    }
  };

  // --- 7. GESTIÓN DE PAGOS ---
  const openPaymentModal = (student) => {
    setSelectedStudent(student);
    setShowPaymentModal(true);
    // Carga Instantánea desde datos locales (gracias a getAll optimizado)
    if (student.payments) {
      setPayments(student.payments);
      setLoadingPayments(false);
    } else {
      // Fallback por si acaso (aunque no debería pasar si se recargó la pág)
      setPayments(null);
      setLoadingPayments(false); // O true si quisieras fetchear, pero asumimos data fresca.
    }
  };

  const togglePayment = async (monthKey) => {
    if (!payments) return;

    // Optimistic UI Update
    const currentStatus = payments[monthKey];
    const newStatus = !currentStatus;

    setPayments(prev => ({ ...prev, [monthKey]: newStatus }));

    try {
      await fetch(GOOGLE_SCRIPT_URL_ADMIN, {
        method: "POST",
        body: JSON.stringify({
          action: "updatePayment",
          dni: selectedStudent.dni,
          month: monthKey,
          paid: newStatus
        }),
      });
      toast.success("Pago de " + monthLabels[monthKey] + " actualizado");
    } catch (error) {
      toast.error("Error al guardar el pago");
      setPayments(prev => ({ ...prev, [monthKey]: currentStatus }));
    }
  };

  const handleDownloadLibreDeuda = async () => {
    if (!selectedStudent) return;
    const toastId = toast.loading("Generando certificado...");
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL_ADMIN, {
        method: "POST",
        body: JSON.stringify({ action: "generateLibreDeuda", dni: selectedStudent.dni }),
      });
      const data = await response.json();
      if (data.status === "success" && data.url) {
        window.open(data.url, "_blank");
        toast.dismiss(toastId);
        toast.success("Certificado generado");
      } else {
        toast.dismiss(toastId);
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error de conexión");
    }
  };

  const monthLabels = {
    matricula: "Matrícula",
    feb: "Febrero", mar: "Marzo", abr: "Abril", may: "Mayo", jun: "Junio",
    jul: "Julio", ago: "Agosto", sep: "Septiembre", oct: "Octubre", nov: "Noviembre", dic: "Diciembre"
  };

  const monthOrder = ['matricula', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  // Mapeo para Labels bonitos en el Dropdown
  const getLabelGrado = (num) => {
    const map = { 1: "1ro", 2: "2do", 3: "3ro", 4: "4to", 5: "5to", 6: "6to", 7: "7mo" };
    return map[num] || `${num}°`;
  };

  return (
    <div className="min-h-screen bg-cristo-bg p-4 md:p-8 font-sans text-gray-800">

      {/* HEADER DE ACCIONES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Legajos de Alumnos</h2>
          <p className="text-sm text-gray-500">
            {loading ? "Cargando datos..." : (
              <>
                <span className="font-bold text-gray-800">{filteredStudents.length}</span> alumno{filteredStudents.length !== 1 ? 's' : ''}
                {filteredStudents.length !== students.length && (
                  <span className="text-gray-400 font-normal ml-1">
                    (de {students.length} totales)
                  </span>
                )}
                {filteredStudents.length === students.length && " matriculados"}
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={fetchStudents}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            title="Recargar Tabla"
          >
            🔄
          </button>
          <button
            onClick={handlePromoteAll}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg border border-red-100 hover:bg-red-100 transition-colors text-xs uppercase tracking-wide"
          >
            <ArrowUpCircle className="w-4 h-4" />
            Cerrar Ciclo Lectivo
          </button>
          <button
            onClick={openNewStudentModal}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-cristo-primary text-white font-bold rounded-lg hover:bg-cristo-dark transition-colors text-sm shadow-lg shadow-cristo-primary/20"
          >
            <Plus className="w-4 h-4" />
            Nuevo Alumno
          </button>
        </div>
      </div>

      {/* --- DASHBOARD ANALYTICS (NUEVO) --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(() => {
          // Cálculos Dinámicos basados en la vista actual (filteredStudents)
          const totalList = filteredStudents.length;
          const alDiaCount = filteredStudents.filter(s => s.saldo === "AL DIA").length;
          const deudaCount = filteredStudents.filter(s => s.saldo !== "AL DIA").length; // ADEUDA o cualquier otra cosa
          const becadosCount = filteredStudents.filter(s => s.isBecado || s.becaPorcentaje > 0).length;

          // Porcentajes (evitando división por cero)
          const getPct = (cnt) => totalList > 0 ? Math.round((cnt / totalList) * 100) : 0;

          return (
            <>
              {/* CARD 1: MATRÍCULA */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Matrícula Visible</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-800">{totalList}</span>
                  <span className="text-xs text-gray-400 font-medium">alumnos</span>
                </div>
              </div>

              {/* CARD 2: COBRANZA (AL DÍA) */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10"><CheckCircle className="w-12 h-12 text-green-500" /></div>
                <span className="text-green-600 text-xs uppercase font-bold tracking-wider mb-1">Solvencia (Al Día)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-700">{getPct(alDiaCount)}%</span>
                  <span className="text-xs text-green-600 font-medium">{alDiaCount} alums</span>
                </div>
                <div className="w-full bg-green-100 h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: `${getPct(alDiaCount)}%` }}></div>
                </div>
              </div>

              {/* CARD 3: MOROSIDAD */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10"><AlertCircle className="w-12 h-12 text-red-500" /></div>
                <span className="text-red-600 text-xs uppercase font-bold tracking-wider mb-1">Morosidad (Deuda)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-700">{getPct(deudaCount)}%</span>
                  <span className="text-xs text-red-600 font-medium">{deudaCount} alums</span>
                </div>
                <div className="w-full bg-red-100 h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: `${getPct(deudaCount)}%` }}></div>
                </div>
              </div>

              {/* CARD 4: BECADOS */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10"><Info className="w-12 h-12 text-blue-500" /></div>
                <span className="text-blue-600 text-xs uppercase font-bold tracking-wider mb-1">Becados</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-700">{getPct(becadosCount)}%</span>
                  <span className="text-xs text-blue-600 font-medium">{becadosCount} alums</span>
                </div>
                <div className="w-full bg-blue-100 h-1.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${getPct(becadosCount)}%` }}></div>
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* BARRA DE HERRAMIENTAS Y FILTROS */}
      <div className="grid md:grid-cols-12 gap-4 mb-6">
        {/* BUSCADOR */}
        <div className="md:col-span-4 relative">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-cristo-accent outline-none text-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* FILTRO NIVEL */}
        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={filterNivel}
              onChange={(e) => { setFilterNivel(e.target.value); setFilterCurso("Todos"); }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-cristo-accent outline-none text-sm appearance-none cursor-pointer"
            >
              <option value="Todos">Todos los Niveles</option>
              <option value="Inicial">Nivel Inicial</option>
              <option value="Primario">Nivel Primario</option>
              <option value="Secundario">Nivel Secundario</option>
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* FILTRO CURSO (DINÁMICO & ROBUSTO) */}
        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={filterCurso}
              onChange={(e) => setFilterCurso(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-cristo-accent outline-none text-sm appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
              disabled={filterNivel === "Todos"}
            >
              <option value="Todos">Todos los Cursos</option>

              {filterNivel === "Inicial" && (
                <>
                  {[3, 4, 5].map(sala => (
                    ["a", "b", "c"].map(div => (
                      <option key={`sala_${sala}_${div}`} value={`sala_${sala}_${div}`}>Sala {sala} "{div.toUpperCase()}"</option>
                    ))
                  ))}
                </>
              )}

              {filterNivel === "Primario" && (
                <>
                  {[1, 2, 3, 4, 5, 6, 7].map(g => (
                    ["a", "b", "c"].map(div => (
                      <option key={`${g}_${div}`} value={`${g}_${div}`}>{getLabelGrado(g)} Grado "{div.toUpperCase()}"</option>
                    ))
                  ))}
                </>
              )}

              {filterNivel === "Secundario" && (
                <>
                  {[1, 2, 3, 4, 5].map(g => (
                    // IDs normalizados: "1_1ra", "1_2da"
                    // Label personalizado: "1ro 1ra" (Sin 'Año')
                    [["1ra", "1ro 1ra"], ["2da", "2do 2da"]].map(([code, label]) => (
                      <option key={`${g}_${code}`} value={`${g}_${code}`}>{getLabelGrado(g)} {code === "1ra" ? "1ra" : "2da"}</option>
                    ))
                  ))}
                </>
              )}
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* TABLA DE LEGAJOS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 gap-2">
            <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
            Cargando Base de Datos...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Alumno</th>
                  <th className="px-6 py-4 font-semibold">Nivel</th>
                  <th className="px-6 py-4 font-semibold text-center">Grado</th>
                  <th className="px-6 py-4 font-semibold text-center">Div</th>
                  <th className="px-6 py-4 font-semibold">Turno</th>
                  <th className="px-6 py-4 font-semibold text-center">Estado de Cuenta</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-6 py-3">
                        <div className="font-bold text-gray-800">{s.apellido}, {s.nombre}</div>
                        <div className="text-xs text-gray-400 font-mono">{s.dni}</div>
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${s.nivel === 'Inicial' ? 'bg-pink-100 text-pink-600' :
                          s.nivel === 'Primario' ? 'bg-blue-100 text-blue-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                          {s.nivel}
                        </span>
                      </td>
                      {/* Quitamos el ° hardcodeado porque el dato ya viene como "1ro" o "1°" a veces */}
                      <td className="px-6 py-3 text-center font-bold text-gray-700">{s.grado}</td>
                      <td className="px-6 py-3 text-center">
                        <span className="w-6 h-6 inline-flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                          {s.division}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500">{s.turno}</td>

                      {/* ESTADO DE CUENTA */}
                      <td className="px-6 py-3 text-center">
                        {s.saldo === "AL DIA" ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                            <Check className="w-3 h-3" /> AL DÍA
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                            <DollarSign className="w-3 h-3" /> DEUDA
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2 opacity-100 transition-opacity">

                          {/* BOTON GESTIONAR PAGOS */}
                          <button
                            onClick={() => openPaymentModal(s)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200"
                            title="Gestionar Pagos"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>

                          {/* BOTON EDITAR */}
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                            title="Editar Datos"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* BOTON ELIMINAR */}
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                            title="Eliminar/Baja"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                      No se encontraron alumnos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL (CREAR / EDITAR) */}
      {
        showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[50] backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-cristo-primary p-4 flex justify-between items-center text-white">
                <h3 className="font-bold">{isEditing ? "Editar Alumno" : "Nuevo Alumno"}</h3>
                <button onClick={() => setShowModal(false)} className="hover:bg-white/10 p-1 rounded"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">DNI</label>
                    <input required type="number" className="w-full p-2 border rounded" value={formData.dni} onChange={e => setFormData({ ...formData, dni: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Apellido</label>
                    <input required type="text" className="w-full p-2 border rounded" value={formData.apellido} onChange={e => setFormData({ ...formData, apellido: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nombres</label>
                  <input required type="text" className="w-full p-2 border rounded" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nivel</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.nivel}
                      onChange={e => {
                        const newNivel = e.target.value;
                        let newGrado = "1";
                        let newDiv = "A";
                        let newTurno = "Mañana";

                        if (newNivel === "Inicial") { newGrado = "3"; newDiv = "A"; }
                        if (newNivel === "Primario") { newGrado = "1"; newDiv = "A"; }
                        if (newNivel === "Secundario") { newGrado = "1"; newDiv = "1era"; newTurno = "Mañana"; }

                        setFormData({ ...formData, nivel: newNivel, grado: newGrado, division: newDiv, turno: newTurno });
                      }}
                    >
                      <option value="Inicial">Inicial</option>
                      <option value="Primario">Primario</option>
                      <option value="Secundario">Secundario</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {formData.nivel === 'Inicial' ? 'Sala' : formData.nivel === 'Secundario' ? 'Año' : 'Grado'}
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.grado}
                      onChange={e => setFormData({ ...formData, grado: e.target.value })}
                    >
                      {formData.nivel === "Inicial" && (
                        <>
                          <option value="3">Sala de 3</option>
                          <option value="4">Sala de 4</option>
                          <option value="5">Sala de 5</option>
                        </>
                      )}
                      {formData.nivel === "Primario" && (
                        <>
                          {[1, 2, 3, 4, 5, 6, 7].map(g => <option key={g} value={String(g)}>{g}° Grado</option>)}
                        </>
                      )}
                      {formData.nivel === "Secundario" && (
                        <>
                          {[1, 2, 3, 4, 5].map(g => <option key={g} value={String(g)}>{g}° Año</option>)}
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">División</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={formData.division}
                      onChange={e => {
                        const newDiv = e.target.value;
                        let newTurno = formData.turno;

                        if (formData.nivel !== "Secundario") {
                          if (newDiv === "A") newTurno = "Mañana";
                          if (newDiv === "B") newTurno = "Tarde";
                        }
                        setFormData({ ...formData, division: newDiv, turno: newTurno });
                      }}
                    >
                      {formData.nivel === "Secundario" ? (
                        <>
                          <option value="1era">1era</option>
                          <option value="2da">2da</option>
                        </>
                      ) : (
                        <>
                          <option value="A">A (Mañana)</option>
                          <option value="B">B (Tarde)</option>
                          <option value="C">C</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Turno</label>
                    <select
                      className="w-full p-2 border rounded bg-gray-50"
                      value={formData.turno}
                      disabled={true}
                    >
                      <option value="Mañana">Mañana</option>
                      <option value="Tarde">Tarde</option>
                    </select>
                  </div>
                </div>

                {/* SECCIÓN BECA */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-cristo-accent focus:ring-cristo-accent"
                        checked={formData.isBecado || false}
                        onChange={e => setFormData({ ...formData, isBecado: e.target.checked })}
                      />
                      <span className="font-bold text-gray-700 text-sm">¿Tiene Beca?</span>
                    </label>

                    {formData.isBecado && (
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-600">% Porcentaje</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-20 p-2 border rounded-lg text-center font-bold"
                          value={formData.becaPorcentaje || ""}
                          onChange={e => setFormData({ ...formData, becaPorcentaje: Number(e.target.value) })}
                        />
                      </div>
                    )}
                  </div>
                  {formData.isBecado && <p className="text-xs text-blue-600 italic">El alumno aparecerá como "BECADO" en los reportes.</p>}
                </div>

                <button type="submit" className="w-full bg-cristo-accent text-white py-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors mt-4">
                  {isEditing ? "Guardar Cambios" : "Guardar e Iniciar Cobranza"}
                </button>
              </form>
            </div>
          </div>
        )
      }

      {/* MODAL GESTIÓN DE PAGOS */}
      {
        showPaymentModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

              <div className="bg-gray-900 p-6 flex justify-between items-start text-white">
                <div>
                  <h3 className="font-bold text-xl">{selectedStudent.apellido}, {selectedStudent.nombre}</h3>
                  <p className="text-gray-400 text-sm">Gestionando pagos ciclo 2026</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadLibreDeuda}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors border border-white/20"
                    title="Descargar Libre Deuda"
                  >
                    <FileText className="w-4 h-4" />
                    Libre Deuda
                  </button>
                  <button onClick={() => setShowPaymentModal(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto">
                {loadingPayments ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="animate-spin w-8 h-8 border-4 border-cristo-primary border-t-transparent rounded-full"></div>
                    <p className="text-gray-500 font-medium">Sincronizando con Banco de Datos...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {monthOrder.map((key) => {
                      const isPaid = payments?.[key];
                      return (
                        <button
                          key={key}
                          onClick={() => togglePayment(key)}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 group
                           ${isPaid
                              ? 'bg-green-50 border-green-500 text-green-700'
                              : 'bg-white border-gray-100 hover:border-cristo-accent hover:shadow-md text-gray-400 hover:text-gray-600'
                            }
                         `}
                        >
                          <span className="font-bold uppercase text-sm tracking-wide">{monthLabels[key]}</span>
                          {isPaid ? (
                            <div className="bg-green-500 text-white rounded-full p-1"><Check className="w-4 h-4" /></div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-cristo-accent"></div>
                          )}
                          <span className="text-[10px] uppercase font-bold mt-1">
                            {isPaid ? 'Pagado' : 'Pendiente'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 border-t border-gray-100 text-center text-xs text-gray-500 flex justify-between items-center px-8">
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> PAGADO</span>
                <span>Los cambios se guardan automáticamente</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 border border-gray-300 rounded-full"></div> PENDIENTE</span>
              </div>

            </div>
          </div>
        )
      }

    </div >
  );
};

export default AdminDashboard;
