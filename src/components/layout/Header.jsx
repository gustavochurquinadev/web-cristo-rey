import { useState, useLayoutEffect, useRef } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';
import gsap from 'gsap';

const Header = ({ activeSection, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuContainerRef = useRef(null);

  const sections = [
    { id: 'home', label: 'Inicio', type: 'scroll' },
    { id: 'history', label: 'Historia', type: 'scroll' },
    { id: 'levels', label: 'Niveles', type: 'scroll' },
    { id: 'pastoral', label: 'Pastoral', type: 'scroll' },
    { id: 'news', label: 'Noticias', type: 'scroll' },
    { id: 'fees', label: 'Aranceles', type: 'scroll' },
    { id: 'careers', label: 'Trabaja con Nosotros', type: 'scroll' },
    { id: 'portal', label: 'Portal Docente', type: 'external', path: '/portal' },
  ];

  const handleNavClick = (section) => {
    if (section.type === 'external') {
      window.open(section.path, '_blank', 'noopener,noreferrer');
    } else {
      onNavigate(section.id);
    }
    setIsMenuOpen(false);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { y: -100, opacity: 0 });
      gsap.to(headerRef.current, {
        y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 3.5
      });
    });
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isMenuOpen) {
        gsap.to(mobileMenuContainerRef.current, { height: "auto", duration: 0.4, ease: "power2.out" });
        gsap.fromTo(".mobile-nav-item", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.1 });
      } else {
        gsap.to(mobileMenuContainerRef.current, { height: 0, duration: 0.3, ease: "power2.in" });
      }
    }, mobileMenuRef);
    return () => ctx.revert();
  }, [isMenuOpen]);

  return (
    <header
      ref={headerRef}
      className="bg-white/95 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-40 border-b border-gray-100"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => handleNavClick(sections[0])}>
          {/* CAMBIO A .webp */}
          <img src="/images/logo.webp" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <div>
            <p className="text-[10px] text-cristo-accent tracking-widest uppercase mt-1">Colegio Católico</p>
            <h1 className="font-serif text-lg md:text-xl text-cristo-primary font-bold leading-none">Cristo Rey</h1>
          </div>
        </div>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden lg:flex items-center space-x-1"> {/* space-x-1 original */}
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavClick(section)}
              // CLASES ORIGINALES: text-xs, font-medium, padding original
              className={`px-3 py-2 text-xs font-medium transition-all duration-300 relative group flex items-center gap-1 ${section.type === 'external'
                ? 'text-cristo-accent hover:text-cristo-primary border border-cristo-accent/30 rounded-md hover:bg-cristo-accent/10 ml-2 px-4'
                : activeSection === section.id ? 'text-cristo-primary font-bold' : 'text-gray-500 hover:text-cristo-primary'
                }`}
            >
              {/* FIX DE LA LÍNEA: relative inline-block hace que el contenedor mida exactamente lo que el texto */}
              <span className="relative inline-block">
                {section.label}
                {/* LÍNEA DORADA: w-full ahora es el 100% de la palabra, bottom-0 pegado al texto */}
                {section.type !== 'external' && (
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-cristo-accent transform origin-left transition-transform duration-300 ${activeSection === section.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                )}
              </span>

              {section.type === 'external' && <ExternalLink className="w-3 h-3" />}
            </button>
          ))}
        </nav>

        {/* BOTÓN MÓVIL */}
        <button className="lg:hidden text-cristo-primary p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MENÚ MÓVIL */}
      <div ref={mobileMenuRef}>
        <div ref={mobileMenuContainerRef} className="lg:hidden bg-cristo-primary text-white overflow-hidden h-0">
          <div className="px-6 py-8 space-y-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavClick(section)}
                className="mobile-nav-item block w-full text-left text-lg font-serif py-2 border-b border-white/10"
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;