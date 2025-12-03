import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Toaster } from 'sonner';

// Importamos los componentes de la Landing Page
// Nota: Como estamos dentro de "pages", subimos un nivel (..) para buscar "components"
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import History from '../components/sections/History';
import Levels from '../components/sections/Levels';
import Pastoral from '../components/sections/Pastoral';
import News from '../components/sections/News';
import Fees from '../components/sections/Fees';
import Careers from '../components/sections/Careers';
import Contact from '../components/sections/Contact';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  
  // Referencias para animaciones
  const lenisRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);

  // 1. Configuración de Scroll Suave (Lenis)
  useEffect(() => {
    const lenis = new Lenis({ 
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: 'vertical', 
      smooth: true 
    });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); gsap.ticker.remove((time) => lenis.raf(time * 1000)); };
  }, []);

  // 2. Animación de Entrada "Cinematográfica" (Loading)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsLoading(false)
      });

      tl.fromTo(logoRef.current, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
      tl.to(logoRef.current, { y: -30, duration: 0.5, ease: "power2.inOut" });
      tl.fromTo(textRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
      tl.to({}, { duration: 0.8 });
      tl.to(loadingScreenRef.current, {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut"
      });
    });
    return () => ctx.revert();
  }, []);

  const handleNavigate = (id) => {
    const element = document.getElementById(id);
    if (element && lenisRef.current) lenisRef.current.scrollTo(element, { offset: -80 });
  };

  return (
    <div className="bg-white text-gray-800 font-sans selection:bg-cristo-accent selection:text-white overflow-x-hidden relative">
      <Toaster position="top-center" richColors />

      {/* Loading Screen */}
      {isLoading && (
        <div ref={loadingScreenRef} className="fixed inset-0 z-[100] bg-cristo-primary flex flex-col items-center justify-center">
          <div ref={logoRef} className="relative w-32 h-32 mb-2">
             <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl"></div>
             <img src="/images/logo.png" alt="Logo Cristo Rey" className="relative w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <div ref={textRef} className="text-center">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-wide">Colegio Católico</h1>
            <p className="font-serif text-4xl md:text-5xl text-cristo-accent italic mt-1">Cristo Rey</p>
          </div>
        </div>
      )}
      
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main>
        <Hero onNavigate={handleNavigate} />
        <History />
        <Levels />
        <Pastoral />
        <News />
        <Fees />
        <Careers />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;