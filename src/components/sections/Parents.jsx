import { useState, useEffect } from 'react';
import { Search, Download, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

const Parents = () => {
    const [loginStep, setLoginStep] = useState(true);
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState(null);
    const [dni, setDni] = useState('');

    // 🔴 URL DEL SCRIPT (Usamos la misma del Admin para compartir la base de datos)
    const GOOGLE_SCRIPT_URL_PADRES = "https://script.google.com/macros/s/AKfycby6a9pr6g54of3nZ343bqxc6Xx3IdbWP21NUop4q6tmJJfWYmEOppw1uhfD-wVOVoLt2g/exec";

    // --- 0. CACHE (Auto-Login) ---
    useEffect(() => {
        const cachedDni = localStorage.getItem('parent_dni');
        const cachedData = localStorage.getItem('parent_data');

        if (cachedDni) setDni(cachedDni);

        if (cachedData) {
            setStudentData(JSON.parse(cachedData));
            setLoginStep(false);
            // Opcional: Re-validar en background si fuera necesario, pero para este caso asumimos cache válido para velocidad.
        }
    }, []);

    // --- 1. LOGIN ---
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!dni) return toast.error("Por favor ingrese el DNI");

        setLoading(true);
        try {
            // Simulación de respuesta para el DEMO (Descomentar para probar sin backend real)
            /*
            setTimeout(() => {
              setStudentData({
                name: "Juan Pérez",
                course: "5to Año A",
                dni: dni,
                payments: {
                  matricula: true,
                  mar: true, abr: true, may: true, jun: true,
                  jul: true, ago: false, sep: false, oct: false, nov: false, dic: false
                },
                debtFree: false // Cambiar a true para probar descarga
              });
              setLoginStep(false);
              setLoading(false);
            }, 1500);
            return; 
            */

            // Conexión Real
            const response = await fetch(GOOGLE_SCRIPT_URL_PADRES, {
                method: "POST",
                body: JSON.stringify({ action: "login", dni: dni }),
            });
            const data = await response.json();

            if (data.status === "success") {
                setStudentData(data.student);
                setLoginStep(false);
                // GUARDAR EN CACHE
                localStorage.setItem('parent_dni', dni);
                localStorage.setItem('parent_data', JSON.stringify(data.student));

                toast.success(`Bienvenido/a familia de ${data.student.name}`);
            } else {
                toast.error("Alumno no encontrado o DNI incorrecto");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    // --- 2. DESCARGAR DOCUMENTOS ---
    const handleDownload = async (actionType) => {
        setLoading(true);
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL_PADRES, {
                method: "POST",
                body: JSON.stringify({ action: actionType, dni: studentData.dni }),
            });
            const data = await response.json();

            if (data.status === "success") {
                window.open(data.url, '_blank');
                toast.success("Documento generado correctamente");
            } else {
                toast.error("Error al generar documento: " + data.message);
            }
        } catch (error) {
            toast.error("Error al procesar solicitud");
        } finally {
            setLoading(false);
        }
    };

    const months = [
        { key: 'feb', label: 'Feb' },
        { key: 'mar', label: 'Mar' }, { key: 'abr', label: 'Abr' }, { key: 'may', label: 'May' },
        { key: 'jun', label: 'Jun' }, { key: 'jul', label: 'Jul' }, { key: 'ago', label: 'Ago' },
        { key: 'sep', label: 'Sep' }, { key: 'oct', label: 'Oct' }, { key: 'nov', label: 'Nov' },
        { key: 'dic', label: 'Dic' }
    ];

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            {/* --- PANTALLA DE LOGIN --- */}
            {loginStep ? (
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border-t-4 border-cristo-accent transition-all duration-500">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-cristo-primary" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-gray-800">Portal Familias</h2>
                        <p className="text-xs text-gray-500 mt-1">Consulte estado de cuotas y certificados</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">DNI del Alumno</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cristo-accent outline-none"
                                    placeholder="Ingrese DNI sin puntos"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cristo-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <div className="animate-spin w-5 h-5 border-2 border-white/50 border-t-white rounded-full"></div> : "Consultar"}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <a href="/" className="text-xs text-gray-400 hover:text-gray-600 hover:underline">
                            Volver al sitio web
                        </a>
                    </div>
                </div>
            ) : (
                /* --- DASHBOARD --- */
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="bg-cristo-primary p-6 text-white flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <h2 className="font-serif text-2xl font-bold">{studentData.name}</h2>
                            <p className="text-cristo-secondary opacity-90">{studentData.course} • DNI: {studentData.dni}</p>
                        </div>
                        <button
                            onClick={() => {
                                setLoginStep(true);
                                setStudentData(null);
                                localStorage.removeItem('parent_data');
                                localStorage.removeItem('parent_dni');
                            }}
                            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors self-start md:self-auto"
                        >
                            Cerrar Sesión
                        </button>
                    </div>

                    <div className="p-6 md:p-8 grid lg:grid-cols-3 gap-8">

                        {/* Columna Principal: Estado de Pagos */}
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-cristo-accent" />
                                Estado de Cuotas 2026
                            </h3>

                            {/* Matrícula */}
                            <div className={`flex items-center justify-between p-4 rounded-xl border ${studentData.payments.matricula ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                <span className="font-bold text-gray-700">Matrícula 2026</span>
                                {studentData.payments.matricula ?
                                    <span className="text-green-600 font-bold text-sm bg-green-100 px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Pagada</span> :
                                    <span className="text-red-500 font-bold text-sm bg-red-100 px-3 py-1 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Pendiente</span>
                                }
                            </div>

                            {/* Grilla Mensual */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {months.map((m) => (
                                    <div key={m.key} className={`p-3 rounded-lg border text-center transition-all ${studentData.payments[m.key]
                                        ? 'bg-green-50 border-green-200 shadow-sm'
                                        : 'bg-red-50 border-red-200'
                                        }`}>
                                        <p className={`text-xs uppercase mb-1 ${studentData.payments[m.key] ? 'text-green-700' : 'text-red-700'}`}>{m.label}</p>
                                        <div className="flex justify-center">
                                            {studentData.payments[m.key] ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar: Acciones */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-fit">
                            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-cristo-primary" />
                                Documentación
                            </h4>

                            <div className="space-y-4">
                                {/* 1. LIBRE DEUDA */}
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                                    <p className="text-sm font-bold text-gray-700 mb-1">Libre Deuda</p>
                                    <p className="text-xs text-gray-500 mb-3">Válido por 30 días.</p>

                                    {studentData.debtFree ? (
                                        <button
                                            onClick={() => handleDownload("generateLibreDeuda")}
                                            disabled={loading}
                                            className="w-full bg-cristo-accent text-white py-2 rounded-lg font-bold text-xs hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {loading ? "..." : <><Download className="w-3 h-3" /> Descargar PDF</>}
                                        </button>
                                    ) : (
                                        <div className="bg-red-50 text-red-600 p-2 rounded text-xs text-center border border-red-100 flex items-center justify-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> Pendiente
                                        </div>
                                    )}
                                </div>

                                {/* 2. CERTIFICADO INICIO */}
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <p className="text-sm font-bold text-gray-700 mb-1">Certificado Inicio</p>
                                    <p className="text-xs text-gray-500 mb-3">Requiere Matrícula y Febrero.</p>

                                    {studentData.payments.matricula && studentData.payments.feb ? (
                                        <button
                                            onClick={() => handleDownload("generateInicio")}
                                            disabled={loading}
                                            className="w-full bg-cristo-primary text-white py-2 rounded-lg font-bold text-xs hover:bg-cristo-dark transition-colors flex items-center justify-center gap-2"
                                        >
                                            {loading ? "..." : <><Download className="w-3 h-3" /> Descargar PDF</>}
                                        </button>
                                    ) : (
                                        <div className="bg-gray-50 text-gray-500 p-2 rounded text-xs text-center border border-gray-100">
                                            No disponible
                                        </div>
                                    )}
                                </div>

                                {/* 3. CERTIFICADO FINALIZACIÓN */}
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <p className="text-sm font-bold text-gray-700 mb-1">Fin de Ciclo</p>
                                    <p className="text-xs text-gray-500 mb-3">Requiere Diciembre pago.</p>

                                    {studentData.payments.dic ? (
                                        <button
                                            onClick={() => handleDownload("generateFinal")}
                                            disabled={loading}
                                            className="w-full bg-green-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {loading ? "..." : <><Download className="w-3 h-3" /> Descargar PDF</>}
                                        </button>
                                    ) : (
                                        <div className="bg-gray-50 text-gray-500 p-2 rounded text-xs text-center border border-gray-100">
                                            Disponible Diciembre
                                        </div>
                                    )}
                                </div>

                                <div className="text-center pt-2">
                                    <a href="https://wa.me/5493884912303" target="_blank" className="text-xs text-cristo-primary font-bold hover:underline">Contactar Administración</a>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Parents;
