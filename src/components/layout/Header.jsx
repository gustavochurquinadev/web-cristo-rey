import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header = ({ activeSection, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sections = [
    { id: 'home', label: 'Inicio' },
    { id: 'history', label: 'Historia' },
    { id: 'levels', label: 'Niveles Educativos' },
    { id: 'pastoral', label: 'Pastoral' },
    { id: 'news', label: 'Ultimas Noticias' },
    { id: 'fees', label: 'Aranceles' },
    { id: 'careers', label: 'Trabaja con Nosotros' },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setIsMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }} animate={{ y: 0 }} 
      className="bg-white/95 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-40 border-b border-gray-100 transition-all duration-300"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => handleNavClick('home')}>
          <img src="/images/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="font-serif text-xl text-cristo-primary font-bold leading-none">Cristo Rey</h1>
            <p className="text-[10px] text-cristo-accent tracking-widest uppercase mt-1">Colegio Católico</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavClick(section.id)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative group ${
                activeSection === section.id ? 'text-cristo-primary' : 'text-gray-500 hover:text-cristo-primary'
              }`}
            >
              {section.label}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-cristo-accent transform origin-left transition-transform duration-300 ${
                activeSection === section.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
              }`}></span>
            </button>
          ))}
          
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-cristo-primary p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menú"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
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
                  onClick={() => handleNavClick(section.id)}
                  className="block w-full text-left text-lg font-serif opacity-80 hover:opacity-100 py-2"
                >
                  {section.label}
                </button>
              ))}
              <button onClick={() => handleNavClick('contact')} className="block w-full text-left text-lg font-serif text-cristo-accent font-bold py-2">
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