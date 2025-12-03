import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Importamos las "Páginas" principales
import Landing from './pages/Landing';
import Staff from './components/sections/Staff';
import ReceiptProcessor from './components/admin/ReceiptProcessor';

const App = () => {
  return (
    <Router>
      {/* Notificaciones globales disponibles en todas las rutas */}
      <Toaster position="top-center" richColors />
      
      <Routes>
        {/* Ruta 1: La Web Principal (http://localhost:3000/) */}
        <Route path="/" element={<Landing />} />
        
        {/* Ruta 2: El Portal Docente (http://localhost:3000/portal) */}
        <Route path="/portal" element={
          <div className="bg-gray-50 min-h-screen">
            {/* Aquí podrías agregar un Header simplificado si quisieras */}
            <Staff />
          </div>
        } />
        
        {/* Ruta 3: Tu Panel Secreto (http://localhost:3000/admin) */}
        <Route path="/admin" element={
          <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
            <ReceiptProcessor />
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;