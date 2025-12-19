import { useState } from 'react';
import { Search, Download, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

const Parents = () => {
    const [loginStep, setLoginStep] = useState(true);
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState(null);
    const [dni, setDni] = useState('');

    // 🔴 URL DEL SCRIPT DE PADRES (Diferente al principal)
    const GOOGLE_SCRIPT_URL_PADRES = "https://script.google.com/macros/s/AKfycbx_pcFTph81h5FcsR6KgpoJUxlF7a7gLHbscxp7GW5aqQ4pBswE2p3iS-kXjTbZND2p/exec";

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

    // --- 2. DESCARGAR LIBRE DEUDA ---
    const handleDownload = async () => {
        if (!studentData.debtFree) return toast.error("Debe regularizar sus cuotas para descargar");

        setLoading(true);
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL_PADRES, {
                method: "POST",
                body: JSON.stringify({ action: "generateLibreDeuda", dni: studentData.dni }),
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
        { key: 'mar', label: 'Mar' }, { key: 'abr', label: 'Abr' }, { key: 'may', label: 'May' },
        { key: 'jun', label: 'Jun' }, { key: 'jul', label: 'Jul' }, { key: 'ago', label: 'Ago' },
        { key: 'sep', label: 'Sep' }, { key: 'oct', label: 'Oct' }, { key: 'nov', label: 'Nov' },
        { key: 'dic', label: 'Dic' }
    ];

    return (
        <div className="min-h-screen bg-cristo-light flex items-center justify-center p-4">
            {/* --- PANTALLA DE LOGIN --- */}
            {loginStep ? (
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-cristo-primary">
                    <div className="text-center mb-8">
                        <h2 className="font-serif text-3xl text-cristo-primary mb-2">Portal Familias</h2>
                        <p className="text-gray-500 text-sm">Consulte estado de cuotas y certificados</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">DNI del Alumno</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cristo-accent focus:border-transparent outline-none transition-all"
                                    placeholder="Ingrese DNI sin puntos"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cristo-primary text-white py-3 rounded-xl font-bold hover:bg-cristo-dark transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? <div className="animate-spin w-5 h-5 border-2 border-white/50 border-t-white rounded-full"></div> : "Consultar"}
                        </button>
                    </form>
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
                            onClick={() => setLoginStep(true)}
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
                                        ? 'bg-white border-green-200 shadow-sm'
                                        : 'bg-gray-50 border-gray-100 opacity-60' // O rojo si venció? Por simplicidad: verde o gris
                                        }`}>
                                        <p className="text-xs text-gray-500 uppercase mb-1">{m.label}</p>
                                        <div className="flex justify-center">
                                            {studentData.payments[m.key] ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>
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
                                {/* Botón Libre Deuda */}
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <p className="text-sm font-bold text-gray-700 mb-1">Libre Deuda</p>
                                    <p className="text-xs text-gray-500 mb-3">Válido por 30 días para trámites adminsitrativos.</p>

                                    {studentData.debtFree ? (
                                        <button
                                            onClick={handleDownload}
                                            disabled={loading}
                                            className="w-full bg-cristo-accent text-white py-2 rounded-lg font-bold text-sm hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {loading ? "Generando..." : <><Download className="w-4 h-4" /> Descargar PDF</>}
                                        </button>
                                    ) : (
                                        <div className="bg-red-50 text-red-600 p-2 rounded text-xs text-center border border-red-100 flex flex-col items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Regularice su situación para descargar.</span>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <p className="text-xs text-gray-400">¿Dudas con un pago?</p>
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
