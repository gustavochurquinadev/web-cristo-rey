import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ExternalLink } from 'lucide-react'; // Importamos icono de link externo

const Header = ({ activeSection, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sections = [
    { id: 'home', label: 'Inicio', type: 'scroll' },
    { id: 'history', label: 'Historia', type: 'scroll' },
    { id: 'levels', label: 'Niveles', type: 'scroll' },
    { id: 'pastoral', label: 'Pastoral', type: 'scroll' },
    { id: 'news', label: 'Noticias', type: 'scroll' },
    { id: 'fees', label: 'Aranceles', type: 'scroll' },
    { id: 'careers', label: 'Trabaja con Nosotros', type: 'scroll' },
    // 👇 ESTO ES LO IMPORTANTE: type: 'external'
    { id: 'portal', label: 'Portal Docente', type: 'external', path: '/portal' },
  ];

  const handleNavClick = (section) => {
    if (section.type === 'external') {
      // ESTA LÍNEA ABRE LA NUEVA PESTAÑA
      window.open(section.path, '_blank', 'noopener,noreferrer');
    } else {
      // Esto hace el scroll normal
      onNavigate(section.id);
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }} animate={{ y: 0 }} 
      className="bg-white/95 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-40 border-b border-gray-100 transition-all duration-300"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => handleNavClick(sections[0])}>
          <img src="/images/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="font-serif text-xl text-cristo-primary font-bold leading-none">Cristo Rey</h1>
            <p className="text-[10px] text-cristo-accent tracking-widest uppercase mt-1">Colegio Católico</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavClick(section)}
              className={`px-3 py-2 text-xs font-medium transition-all duration-300 relative group flex items-center gap-1 ${
                section.type === 'external' 
                  ? 'text-cristo-accent hover:text-cristo-primary border border-cristo-accent/30 rounded-md hover:bg-cristo-accent/10 ml-2 px-4' 
                  : activeSection === section.id ? 'text-cristo-primary' : 'text-gray-500 hover:text-cristo-primary'
              }`}
            >
              {section.label}
              {section.type === 'external' && <ExternalLink className="w-3 h-3" />}
              
              {section.type !== 'external' && (
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-cristo-accent transform origin-left transition-transform duration-300 ${
                  activeSection === section.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                }`}></span>
              )}
            </button>
          ))}
        </nav>

        <button className="lg:hidden text-cristo-primary p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="lg:hidden bg-cristo-primary text-white overflow-hidden"
          >
            <div className="px-6 py-8 space-y-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleNavClick(section)}
                  className={`block w-full text-left text-lg font-serif py-2 border-b border-white/10 last:border-0 flex justify-between items-center ${
                    section.type === 'external' ? 'text-cristo-accent font-bold' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {section.label}
                  {section.type === 'external' && <ExternalLink className="w-4 h-4" />}
                </button>
              ))}
              <button onClick={() => { onNavigate('contact'); setIsMenuOpen(false); }} className="block w-full text-left text-lg font-serif text-white font-bold py-2 mt-4">
                Contacto
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;