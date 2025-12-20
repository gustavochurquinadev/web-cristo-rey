import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const AdminLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Simple hardcoded auth for demo/MVP
    // En producción esto debería ser más robusto (JWT, etc), pero para este caso de uso local funciona.
    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin') {
            setIsAuthenticated(true);
            toast.success("Binvenido al Sistema de Gestión");
        } else {
            toast.error("Contraseña incorrecta");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword('');
        toast.info("Sesión cerrada");
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border-t-4 border-cristo-accent">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-cristo-primary" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-gray-800">Acceso Administrativo</h2>
                        <p className="text-xs text-gray-500 mt-1">Solo personal autorizado</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Contraseña de Sistema</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cristo-accent outline-none"
                                    placeholder="••••••••"
                                />
                                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>
                        <button className="w-full bg-cristo-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all">
                            Ingresar al Sistema
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <button onClick={() => navigate('/')} className="text-xs text-gray-400 hover:text-white hover:underline">
                            Volver al sitio web
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Topbar */}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-cristo-primary" />
                    <div>
                        <h1 className="font-bold text-gray-800 text-sm leading-tight">Sistema de Gestión</h1>
                        <p className="text-[10px] text-gray-500">Colegio Cristo Rey • Admin PWA</p>
                    </div>
                </div>

                {/* NAVIGATION MENU */}
                <nav className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => navigate('/sistemalegajo')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${location.pathname === '/sistemalegajo' ? 'bg-white text-cristo-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Legajos
                    </button>
                    <button
                        onClick={() => navigate('/sistemalegajo/receipts')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${location.pathname.includes('receipts') ? 'bg-white text-cristo-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Sueldos
                    </button>
                </nav>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400 hidden md:block">Usuario: Dirección</span>
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full transition-colors"
                        title="Cerrar Sesión"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
