import { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, ArrowUpCircle, Download } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
    // MOCK DATA INICIAL (LUEGO SE CONECTARÁ AL SCRIPT)
    const [students, setStudents] = useState([
        { id: 1, dni: "12345678", apellido: "Pérez", nombre: "Juan", nivel: "Secundario", grado: "5", division: "A", turno: "Mañana", estado: "Regular" },
        { id: 2, dni: "87654321", apellido: "Gómez", nombre: "María", nivel: "Primario", grado: "3", division: "B", turno: "Tarde", estado: "Regular" },
        { id: 3, dni: "11223344", apellido: "López", nombre: "Sofía", nivel: "Inicial", grado: "5", division: "A", turno: "Mañana", estado: "Regular" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterNivel, setFilterNivel] = useState("Todos");

    // FILTRADO
    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.dni.includes(searchTerm);
        const matchesNivel = filterNivel === "Todos" || student.nivel === filterNivel;
        return matchesSearch && matchesNivel;
    });

    const handleDelete = (id) => {
        if (confirm("¿Seguro que desea dar de baja a este alumno?")) {
            setStudents(students.filter(s => s.id !== id));
            toast.success("Alumno dado de baja");
        }
    };

    const handlePromoteAll = () => {
        if (confirm("⚠️ ¿ESTÁS SEGURO?\n\nEsta acción:\n1. Pasará a todos los alumnos al siguiente año.\n2. Egresará a los del último año.\n\nSe recomienda hacer BACKUP antes.")) {
            toast.loading("Procesando promoción masiva...");
            setTimeout(() => {
                toast.dismiss();
                toast.success("¡Ciclo Lectivo Cerrado Exitosamente!");
                // Aquí iría la llamada real al backend
            }, 2000);
        }
    };

    return (
        <div className="space-y-6">

            {/* HEADER DE ACCIONES */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Legajos de Alumnos</h2>
                    <p className="text-sm text-gray-500">{students.length} alumnos matriculados</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={handlePromoteAll}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg border border-red-100 hover:bg-red-100 transition-colors text-sm"
                    >
                        <ArrowUpCircle className="w-4 h-4" />
                        Cerrar Ciclo Lectivo
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-cristo-primary text-white font-bold rounded-lg hover:bg-cristo-dark transition-colors text-sm shadow-lg shadow-cristo-primary/20">
                        <Plus className="w-4 h-4" />
                        Nuevo Alumno
                    </button>
                </div>
            </div>

            {/* BARRA DE HERRAMIENTAS */}
            <div className="grid md:grid-cols-12 gap-4">
                {/* Buscador */}
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

                {/* Filtros */}
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

                <div className="md:col-span-4 flex justify-end">
                    <button className="text-gray-500 hover:text-cristo-primary text-xs flex items-center gap-1 font-medium bg-white px-3 py-2 rounded-lg border border-gray-200">
                        <Download className="w-4 h-4" /> Exportar Excel
                    </button>
                </div>
            </div>

            {/* TABLA DE LEGAJOS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Alumno</th>
                                <th className="px-6 py-4 font-semibold">Nivel</th>
                                <th className="px-6 py-4 font-semibold text-center">Grado/Año</th>
                                <th className="px-6 py-4 font-semibold text-center">Div</th>
                                <th className="px-6 py-4 font-semibold">Turno</th>
                                <th className="px-6 py-4 font-semibold text-center">Estado</th>
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
                                            <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-[10px] font-bold border border-green-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Regular
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                                        No se encontraron alumnos con ese criterio.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
