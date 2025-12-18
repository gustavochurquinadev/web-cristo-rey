import { useState } from 'react';
import { Lock, User, FileText, Download, LogOut, UserPlus, Key, Calendar, BookOpen, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

const Staff = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ dni: '', password: '' });
  const [registerData, setRegisterData] = useState({ dni: '', name: '', password: '', token: '' });

  // 🔴 URL DE TU SCRIPT (Verifica que sea la correcta)
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx9RF9Cze-DeZFKLFDnbmtXZvO4b4etlr0O4yLzo_J8rftQx6oLgVZbhqnum3RmnySGMQ/exec";

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ ...loginData, action: 'login' })
      });
      const data = await res.json();

      if (data.status === 'success') {
        setIsLoggedIn(true);
        setUser({ name: data.name, dni: loginData.dni });
        toast.success(`Bienvenido/a ${data.name}`);
        fetchReceipts(loginData.dni);
        fetchPublicDocs();
      } else {
        toast.error(data.message || "Error al ingresar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // --- REGISTRO ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ ...registerData, action: 'register' })
      });
      const data = await res.json();

      if (data.status === 'success') {
        toast.success("¡Cuenta creada con éxito! Ahora puedes ingresar.");
        setView('login');
        setLoginData({ dni: registerData.dni, password: '' });
      } else {
        toast.error(data.message || "Error al registrarse");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // --- FETCHERS ---
  const fetchReceipts = async (dni) => {
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ dni, action: 'getReceipts' })
      });
      const data = await res.json();
      if (data.status === 'success') setReceipts(data.receipts);
    } catch (error) { console.error(error); }
  };

  const fetchPublicDocs = async () => {
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'getPublicDocs' })
      });
      const data = await res.json();
      if (data.status === 'success') setDocuments(data.docs);
    } catch (error) { console.error(error); }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setReceipts([]);
    setDocuments([]);
    setLoginData({ dni: '', password: '' });
  };

  // --- VISTA NO LOGUEADO (LOGIN/REGISTRO) ---
  if (!isLoggedIn) {
    return (
      <section id="staff" className="py-24 bg-gray-50 flex justify-center items-center min-h-[700px]">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md transition-all duration-500">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-cristo-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-cristo-primary">
              {view === 'login' ? <Lock className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
            </div>
            <h2 className="font-serif text-2xl text-cristo-primary font-bold">
              {view === 'login' ? 'Portal Docente' : 'Crear Cuenta'}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {view === 'login' ? 'Acceso exclusivo personal docente' : 'Complete sus datos institucionales'}
            </p>
          </div>

          {view === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">DNI</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type="text" value={loginData.dni} onChange={(e) => setLoginData({ ...loginData, dni: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cristo-primary transition-all" placeholder="Sin puntos" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cristo-primary transition-all" placeholder="••••••••" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-cristo-primary text-white font-bold rounded-lg hover:bg-cristo-dark transition-all flex justify-center items-center gap-2 shadow-lg">
                {loading ? 'Verificando...' : 'Ingresar'}
              </button>
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">¿Es tu primera vez? <button type="button" onClick={() => setView('register')} className="text-cristo-accent font-bold hover:underline">Crear cuenta aquí</button></p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nombre Completo</label>
                <input type="text" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cristo-primary" placeholder="Ej: María Perez" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">DNI</label>
                <input type="text" value={registerData.dni} onChange={(e) => setRegisterData({ ...registerData, dni: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cristo-primary" placeholder="Sin puntos" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Crear Contraseña</label>
                <input type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-cristo-primary" placeholder="••••••••" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Código de Invitación</label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input type="text" value={registerData.token} onChange={(e) => setRegisterData({ ...registerData, token: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:border-cristo-primary text-blue-800" placeholder="Solicitar a Administración" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-cristo-accent text-white font-bold rounded-lg hover:bg-yellow-600 transition-all flex justify-center items-center gap-2 shadow-lg">
                {loading ? 'Registrando...' : 'Confirmar Registro'}
              </button>
              <div className="text-center pt-4">
                <button type="button" onClick={() => setView('login')} className="text-sm text-gray-500 hover:text-cristo-primary">← Volver al inicio de sesión</button>
              </div>
            </form>
          )}
        </div>
      </section>
    );
  }

  // --- DASHBOARD (LOGUEADO) - DISEÑO SPLIT (2 COLUMNAS) ---
  return (
    <section id="staff-dashboard" className="py-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* HEADER DE BIENVENIDA */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h2 className="font-serif text-2xl text-cristo-primary font-bold">Hola, {user.name}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <User className="w-4 h-4" /> DNI: {user.dni}
            </p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>

        {/* --- GRID PRINCIPAL (DOS COLUMNAS) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* COLUMNA 1: RECIBOS DE HABERES */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full max-h-[800px]">
            {/* Título de Sección */}
            <div className="p-6 border-b border-gray-100 bg-blue-50/50 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-cristo-primary font-bold">Recibos de Haberes</h3>
              </div>
            </div>

            {/* Contenido Scrolleable */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {receipts.length > 0 ? receipts.map((receipt) => (
                  <div key={receipt.id} className="bg-white p-5 rounded-xl border border-gray-100 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden">

                    {/* Decoración de fondo */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>

                    {/* Icono del Mes */}
                    <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-lg flex flex-col items-center justify-center font-bold shadow-inner mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <span className="text-[10px] uppercase opacity-70 leading-none mb-0.5">MES</span>
                      <span className="text-lg leading-none">{receipt.periodo.substring(0, 3)}</span>
                    </div>

                    {/* Info */}
                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-1">
                      {receipt.periodo.replace(/_/g, ' ')}
                    </h4>

                    <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-4 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      Leg: {receipt.legajo}
                    </div>

                    {/* Botón */}
                    <a
                      href={receipt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-3 h-3" /> Descargar
                    </a>
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-gray-400 font-medium">No hay recibos disponibles.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA 2: DOCUMENTOS INSTITUCIONALES */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full max-h-[800px]">
            {/* Título de Sección */}
            <div className="p-6 border-b border-gray-100 bg-cristo-secondary/10 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-cristo-accent shadow-sm">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-cristo-primary font-bold">Documentación Institucional</h3>
              </div>
            </div>

            {/* Contenido Scrolleable */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
              <div className="grid grid-cols-1 gap-3">
                {documents.length > 0 ? documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-cristo-accent/50 hover:bg-white hover:shadow-md transition-all group cursor-pointer" onClick={() => window.open(doc.url, '_blank')}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400 group-hover:bg-cristo-primary group-hover:text-white transition-colors">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-700 text-sm group-hover:text-cristo-primary transition-colors mb-0.5">
                          {doc.name}
                        </p>
                        <span className="text-[10px] text-white bg-cristo-accent/80 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                          Oficial
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-300 group-hover:text-cristo-accent transition-colors bg-white p-2 rounded-full shadow-sm">
                      <Download className="w-4 h-4" />
                    </div>
                  </div>
                )) : (
                  <div className="py-12 text-center text-gray-400">
                    <p>No hay documentos públicos disponibles.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Staff;