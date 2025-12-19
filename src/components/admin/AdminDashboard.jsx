import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, ArrowUpCircle, Download, X, DollarSign, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  // CONFIGURACIÓN
  const GOOGLE_SCRIPT_URL_ADMIN = "https://script.google.com/macros/s/AKfycbw18z2n3c7T-GTQo2BS_dvosve9Pr9590VxRDJJFCO6J7nVZg8kIZeeWwWcST0HP52o/exec";

  // ESTADOS
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNivel, setFilterNivel] = useState("Todos");

  // MODALES
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // ESTADO FORMULARIO ALUMNO
  const [formData, setFormData] = useState({
    dni: '', apellido: '', nombre: '', nivel: 'Inicial', grado: '5', division: 'A', turno: 'Mañana'
  });

  // ESTADO PAGOS
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payments, setPayments] = useState(null);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // --- 1. CARGAR DATOS (READ) ---
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
      String(student.nombre).toLowerCase().includes(term) ||
      String(student.apellido).toLowerCase().includes(term) ||
      String(student.dni).includes(term);
    const matchesNivel = filterNivel === "Todos" || student.nivel === filterNivel;
    return matchesSearch && matchesNivel;
  });

  // --- 3. BORRAR (DELETE) ---
  const handleDelete = async (id) => {
    if (confirm("⚠️ ¿Seguro que desea dar de BAJA a este alumno?")) {
      const toastId = toast.loading("Procesando baja...");
      try {
        await fetch(GOOGLE_SCRIPT_URL_ADMIN, {
          method: "POST",
          body: JSON.stringify({ action: "delete", id: id }),
        });
        toast.dismiss(toastId);
        toast.success("Alumno dado de baja exitosamente");
        fetchStudents(); // Recargar tabla
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Error al eliminar");
      }
    }
  };

  // --- 4. PROMOCIÓN AUTOMÁTICA ---
  const handlePromoteAll = async () => {
    if (confirm("⚠️ IMPORTANTE: CIERRE DE CICLO LECTIVO\n\nEsta acción ejecutará la 'Magia de Promoción':\n- Inicial 5 -> Pasa a 1° Grado\n- 7° Grado -> Pasa a 1° Año\n- 5° Año -> EGRESA\n- Todos los demás suben un grado.\n\n¿CONFIRMA EL CAMBIO DE AÑO?")) {
      const toastId = toast.loading("⏳ Procesando cierre de ciclo... Esto puede tardar unos segundos.");
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL_ADMIN, {
          method: "POST",
          body: JSON.stringify({ action: "promoteAll" }),
        });
        const data = await response.json();

        toast.dismiss(toastId);
        if (data.status === "success") {
          toast.success("¡Ciclo Lectivo Cerrado! Alumnos promovidos. 🎉");
          fetchStudents(); // Recargar para ver los cambios
        } else {
          toast.error("Error: " + data.message);
        }
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Error de conexión al promover");
      }
    }
  };

  // --- 5. CREAR ALUMNO (CREATE) ---
  const handleCreate = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Inscribiendo alumno y creando legajo...");
    try {
      await fetch(GOOGLE_SCRIPT_URL_ADMIN, {
        method: "POST",
        body: JSON.stringify({ action: "create", student: formData }),
      });
      toast.dismiss(toastId);
      toast.success("Alumno inscripto correctamente");
      setShowModal(false);
      setFormData({ dni: '', apellido: '', nombre: '', nivel: 'Inicial', grado: '5', division: 'A', turno: 'Mañana' }); // Reset
      fetchStudents();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error al guardar");
    }
  };

  // --- 6. GESTIÓN DE PAGOS ---
  const openPaymentModal = async (student) => {
    setSelectedStudent(student);
    setShowPaymentModal(true);
    setLoadingPayments(true);
    setPayments(null);

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL_ADMIN, {
        method: "POST",
        body: JSON.stringify({ action: "getPayments", dni: student.dni }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setPayments(data.payments);
      } else {
        toast.error("No se encontraron pagos para este alumno");
        setShowPaymentModal(false);
      }
    } catch (error) {
      toast.error("Error al cargar pagos");
      setShowPaymentModal(false);
    } finally {
      setLoadingPayments(false);
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
      toast.success("Pago de " + monthKey + " actualizado");
    } catch (error) {
      toast.error("Error al guardar el pago");
      // Rollback
      setPayments(prev => ({ ...prev, [monthKey]: currentStatus }));
    }
  };

  const monthLabels = {
    matricula: "Matrícula",
    feb: "Febrero", mar: "Marzo", abr: "Abril", may: "Mayo", jun: "Junio",
    jul: "Julio", ago: "Agosto", sep: "Septiembre", oct: "Octubre", nov: "Noviembre", dic: "Diciembre"
  };

  const monthOrder = ['matricula', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  return (
    <div className="space-y-6 relative">

      {/* HEADER DE ACCIONES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Legajos de Alumnos</h2>
          <p className="text-sm text-gray-500">
            {loading ? "Cargando datos..." : students.length + " alumnos matriculados"}
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
            onClick={() => setShowModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-cristo-primary text-white font-bold rounded-lg hover:bg-cristo-dark transition-colors text-sm shadow-lg shadow-cristo-primary/20"
          >
            <Plus className="w-4 h-4" />
            Nuevo Alumno
          </button>
        </div>
      </div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="grid md:grid-cols-12 gap-4">
        <div className="md:col-span-5 relative">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-cristo-accent outline-none text-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={filterNivel}
              onChange={(e) => setFilterNivel(e.target.value)}
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
                  <th className="px-6 py-4 font-semibold text-center">Grado/Año</th>
                  <th className="px-6 py-4 font-semibold text-center">Div</th>
                  <th className="px-6 py-4 font-semibold">Turno</th>
                  <th className="px-6 py-4 font-semibold text-center">Saldos</th>
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
                      <td className="px-6 py-3 text-center font-bold text-gray-700">{s.grado}°</td>
                      <td className="px-6 py-3 text-center">
                        <span className="w-6 h-6 inline-flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                          {s.division}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500">{s.turno}</td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => openPaymentModal(s)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold hover:bg-green-100 transition-colors"
                        >
                          <DollarSign className="w-3 h-3" />
                          Gestionar Pagos
                        </button>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar/Baja">
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

      {/* MODAL NUEVO ALUMNO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[50] backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-cristo-primary p-4 flex justify-between items-center text-white">
              <h3 className="font-bold">Nuevo Alumno</h3>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/10 p-1 rounded"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
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
                  <select className="w-full p-2 border rounded" value={formData.nivel} onChange={e => setFormData({ ...formData, nivel: e.target.value })}>
                    <option value="Inicial">Inicial</option>
                    <option value="Primario">Primario</option>
                    <option value="Secundario">Secundario</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Grado/Año</label>
                  <input required type="number" className="w-full p-2 border rounded" value={formData.grado} onChange={e => setFormData({ ...formData, grado: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">División</label>
                  <select className="w-full p-2 border rounded" value={formData.division} onChange={e => setFormData({ ...formData, division: e.target.value })}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Turno</label>
                  <select className="w-full p-2 border rounded" value={formData.turno} onChange={e => setFormData({ ...formData, turno: e.target.value })}>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-cristo-accent text-white py-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors mt-4">
                Guardar e Iniciar Cobranza
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GESTIÓN DE PAGOS */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

            {/* Header Modal */}
            <div className="bg-gray-900 p-6 flex justify-between items-start text-white">
              <div>
                <h3 className="font-bold text-xl">{selectedStudent.apellido}, {selectedStudent.nombre}</h3>
                <p className="text-gray-400 text-sm">Gestionando pagos ciclo 2026</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>

            {/* Body */}
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

                        {/* Indicador visual pequeño */}
                        <span className="text-[10px] uppercase font-bold mt-1">
                          {isPaid ? 'Pagado' : 'Pendiente'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-100 text-center text-xs text-gray-500 flex justify-between items-center">
              <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Pagado</span>
              <span>Los cambios se guardan automáticamente</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 border border-gray-300 rounded-full"></div> Pendiente</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
