import { useState, useLayoutEffect, useRef, Suspense, lazy, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Toaster } from 'sonner';

import Header from '../components/layout/Header';
import Hero from '../components/sections/Hero';

// Lazy Load
const History = lazy(() => import('../components/sections/History'));
const Levels = lazy(() => import('../components/sections/Levels'));
const Pastoral = lazy(() => import('../components/sections/Pastoral'));
const News = lazy(() => import('../components/sections/News'));
const Fees = lazy(() => import('../components/sections/Fees'));
const Careers = lazy(() => import('../components/sections/Careers'));
const Contact = lazy(() => import('../components/sections/Contact'));
const Footer = lazy(() => import('../components/layout/Footer'));

const SectionLoader = () => <div className="py-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-cristo-accent border-t-transparent rounded-full mx-auto"></div></div>;

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [introComplete, setIntroComplete] = useState(false);

  const loaderRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const lenisRef = useRef(null);

  // 1. Configuración de Scroll y Reset
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      overscroll: false
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));

    // Bloqueamos scroll al inicio
    lenis.stop();

    return () => { lenis.destroy(); gsap.ticker.remove((time) => lenis.raf(time * 1000)); };
  }, []);

  // 2. ANIMACIÓN DE ENTRADA (Sólida y sin saltos)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        onComplete: () => {
          // Reactivar scroll
          if (lenisRef.current) lenisRef.current.start();
          document.body.style.overflow = 'auto';
          setIntroComplete(true);
          gsap.set(loaderRef.current, { display: 'none' });
        }
      });

      // A. Entrada del Logo
      tl.from(logoRef.current, {
        scale: 0,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
      })
        // B. Texto
        .from(textRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.6")

        // C. Pausa de lectura
        .to({}, { duration: 1.5 })

        // D. SALIDA: Solo Opacidad (Fade Out)
        .to(loaderRef.current, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut"
        });

    });
    return () => ctx.revert();
  }, []);

  const handleNavigate = (id) => {
    const element = document.getElementById(id);
    if (element && lenisRef.current) lenisRef.current.scrollTo(element, { offset: -80 });
  };

  return (
    // CAMBIO IMPORTANTE: Quitamos bg-white de aquí. El fondo base es azul por CSS.
    <div className="font-sans selection:bg-cristo-accent selection:text-white relative min-h-screen">
      <Toaster position="top-center" richColors />

      {/* --- PRELOADER (Azul sobre Azul) --- */}
      <div ref={loaderRef} className="loader-overlay">
        <div ref={logoRef} className="w-32 h-32 mb-6 relative">
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full animate-pulse"></div>
          <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-2xl relative z-10" />
        </div>

        <div ref={textRef} className="text-center text-white px-4">
          <h1 className="font-serif text-xl md:text-2xl tracking-[0.3em] uppercase opacity-90">Colegio Católico</h1>
          <p className="font-serif text-4xl md:text-5xl text-cristo-accent italic mt-2 font-medium">Cristo Rey</p>
        </div>
      </div>

      {/* --- CONTENEDOR BLANCO DEL SITIO --- */}
      {/* Aquí es donde empieza lo blanco. Debajo de esto, todo es azul. */}
      <div className="bg-white relative z-0 w-full">
        <Header activeSection={activeSection} onNavigate={handleNavigate} />

        <main>
          <Hero onNavigate={handleNavigate} startAnimation={introComplete} />

          <Suspense fallback={<SectionLoader />}>
            <History />
            <Levels />
            <Pastoral />
            <News />
            <Fees />
            <Careers />
            <Contact />
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
};

export default Landing;