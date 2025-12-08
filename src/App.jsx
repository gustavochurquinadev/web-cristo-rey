import { useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

// Páginas y Componentes
import Landing from './pages/Landing';
import Staff from './components/sections/Staff';
import ReceiptProcessor from './components/admin/ReceiptProcessor';
import PageTransition from './components/layout/PageTransition';

// Componente para resetear el scroll al cambiar de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Wrapper auxiliar para limpiar el código de las rutas
const WithTransition = ({ children }) => (
  <PageTransition>
    {children}
  </PageTransition>
);

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" richColors />

      <Routes>
        {/* Ruta 1: Landing Page */}
        <Route path="/" element={
          <WithTransition>
            <Landing />
          </WithTransition>
        } />

        {/* Ruta 2: Portal Docente */}
        <Route path="/portal" element={
          <WithTransition>
            <div className="bg-gray-50 min-h-screen">
              <Staff />
            </div>
          </WithTransition>
        } />

        {/* Ruta 3: Admin */}
        <Route path="/admin" element={
          <WithTransition>
            <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
              <ReceiptProcessor />
            </div>
          </WithTransition>
        } />
      </Routes>
    </Router>
  );
};

export default App;