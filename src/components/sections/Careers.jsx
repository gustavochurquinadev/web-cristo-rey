import { useState } from 'react';
import { Send, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Careers = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    cv: null // Aquí guardaremos el objeto File
  });
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔴 ¡PEGA AQUÍ TU URL DE APPS SCRIPT! 🔴
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw7e58zVGcV7jDeMEYsgrBTj6Mp7yO4jNz5SfzMC8y0P9ai-3Lj4no7mZ6DcK8F-Kai/exec"; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB límite
        toast.error("El archivo es muy pesado. Máximo 5MB.");
        return;
      }
      setFormData(prev => ({ ...prev, cv: file }));
      setFileName(file.name);
    }
  };

  // Función auxiliar para convertir archivo a Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Quitamos el prefijo "data:application/pdf;base64," para enviar solo los datos puros
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cv) {
      toast.error("Por favor adjunta tu CV.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Enviando documentación al colegio...");

    try {
      // 1. Convertir el archivo a formato que Google entienda
      const base64File = await fileToBase64(formData.cv);

      // 2. Preparar el paquete de datos
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        fileName: formData.cv.name,
        fileMimeType: formData.cv.type,
        fileData: base64File
      };

      // 3. Enviar a Google Apps Script (usando no-cors para evitar bloqueos simples)
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      // Nota: Con mode 'no-cors' no podemos leer el JSON de respuesta, 
      // pero si no da error de red, asumimos éxito en Apps Script.
      
      toast.success("¡Postulación recibida correctamente!", { id: toastId });
      
      // Limpiar formulario
      setFormData({ name: '', email: '', phone: '', position: '', cv: null });
      setFileName('');

    } catch (error) {
      console.error(error);
      toast.error("Hubo un error de conexión. Intenta nuevamente.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="careers" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Columna Izquierda */}
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <span className="text-cristo-accent font-bold tracking-widest text-xs uppercase mb-2 block">Trabaja con Nosotros</span>
            <h2 className="font-serif text-4xl text-cristo-primary mb-6">Vocación de Servicio</h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              Buscamos docentes y profesionales comprometidos con los valores cristianos y la excelencia educativa.
            </p>
            
            <div className="bg-gray-50 p-8 border-l-4 border-cristo-accent rounded-r-xl shadow-sm">
              <h4 className="text-cristo-primary font-serif text-xl mb-4 font-bold">Documentación Requerida</h4>
              <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex items-start"><CheckCircle className="w-4 h-4 text-cristo-accent mr-2 mt-0.5" /> CV Actualizado con foto</li>
                <li className="flex items-start"><CheckCircle className="w-4 h-4 text-cristo-accent mr-2 mt-0.5" /> Títulos legalizados (copia)</li>
                <li className="flex items-start"><CheckCircle className="w-4 h-4 text-cristo-accent mr-2 mt-0.5" /> Antecedentes penales</li>
              </ul>
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Inputs Personales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nombre Completo</label>
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleChange} required 
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-lg focus:outline-none focus:border-cristo-primary focus:ring-1 focus:ring-cristo-primary transition-all"
                    placeholder="Ej: María González"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Teléfono</label>
                  <input 
                    type="tel" name="phone" value={formData.phone} onChange={handleChange} required 
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-lg focus:outline-none focus:border-cristo-primary focus:ring-1 focus:ring-cristo-primary transition-all"
                    placeholder="Ej: 388 1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email</label>
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange} required 
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-lg focus:outline-none focus:border-cristo-primary focus:ring-1 focus:ring-cristo-primary transition-all"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Cargo</label>
                  <select 
                    name="position" value={formData.position} onChange={handleChange} required
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-lg focus:outline-none focus:border-cristo-primary focus:ring-1 focus:ring-cristo-primary transition-all text-gray-700"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Nivel Inicial">Docencia - Nivel Inicial</option>
                    <option value="Nivel Primario">Docencia - Nivel Primario</option>
                    <option value="Nivel Secundario">Docencia - Nivel Secundario</option>
                    <option value="Administración">Administración / Secretaría</option>
                    <option value="Maestranza">Maestranza / Servicios</option>
                  </select>
                </div>
              </div>

              {/* Input de Archivo (CV) */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Curriculum Vitae (PDF)</label>
                <div className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer group transition-colors ${fileName ? 'border-cristo-accent bg-cristo-secondary/10' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                    accept=".pdf,.doc,.docx" 
                  />
                  <div className="flex flex-col items-center relative z-10">
                    {fileName ? (
                      <>
                        <CheckCircle className="w-10 h-10 text-cristo-accent mb-2" />
                        <span className="text-sm font-bold text-cristo-primary">{fileName}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-sm text-gray-600 font-medium">Haz clic para subir tu CV</span>
                        <span className="text-xs text-gray-400 mt-1">Formato PDF o Word (Máx 5MB)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón de Envío */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-4 bg-cristo-primary text-white font-bold tracking-wide rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all ${isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:bg-cristo-dark hover:shadow-xl active:scale-[0.98]'}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>PROCESANDO...</span>
                  </>
                ) : (
                  <>
                    <span>ENVIAR DATOS</span>
                    <Send className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
              
              <div className="text-center">
                <p className="text-xs text-gray-400 flex items-center justify-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> Información protegida por Google Workspace for Education
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Careers;