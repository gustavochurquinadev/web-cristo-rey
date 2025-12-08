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
  // Estado para controlar si el Hero puede animarse
  const [introComplete, setIntroComplete] = useState(false);

  const loaderRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), direction: 'vertical', smooth: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));

    // Bloqueamos el scroll nativo de Lenis al inicio
    lenis.stop();

    return () => { lenis.destroy(); gsap.ticker.remove((time) => lenis.raf(time * 1000)); };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        onComplete: () => {
          // Al terminar: desbloqueamos scroll, avisamos al Hero y ocultamos el loader del DOM
          if (lenisRef.current) lenisRef.current.start();
          document.body.style.overflow = 'auto';
          setIntroComplete(true);
          gsap.set(loaderRef.current, { display: 'none' });
        }
      });

      // 1. ANIMACIÓN DE ENTRADA (El logo ya es visible, solo lo animamos desde scale 0)
      tl.from(logoRef.current, {
        scale: 0,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)"
      })
        .from(textRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.6")

        // 2. PAUSA (Para que se lea bien la marca)
        .to({}, { duration: 1.5 })

        // 3. SALIDA (Fade Out hacia arriba)
        .to(loaderRef.current, {
          opacity: 0,
          y: -50, // Un ligero desplazamiento hacia arriba al desvanecerse queda muy elegante
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
    <div className="bg-white text-gray-800 font-sans selection:bg-cristo-accent selection:text-white relative min-h-screen">
      <Toaster position="top-center" richColors />

      {/* --- PRELOADER --- */}
      {/* Usamos la clase .loader-overlay que definimos en CSS para forzar el tamaño */}
      <div ref={loaderRef} className="loader-overlay">

        {/* LOGO */}
        <div ref={logoRef} className="w-32 h-32 mb-6 relative">
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full animate-pulse"></div>
          <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-2xl relative z-10" />
        </div>

        {/* TEXTO */}
        <div ref={textRef} className="text-center text-white px-4">
          <h1 className="font-serif text-xl md:text-2xl tracking-[0.3em] uppercase opacity-90">Colegio Católico</h1>
          <p className="font-serif text-4xl md:text-5xl text-cristo-accent italic mt-2 font-medium">Cristo Rey</p>
        </div>
      </div>

      {/* --- CONTENIDO WEB --- */}
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main>
        {/* El Hero recibe la señal para animar sus textos internos */}
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
  );
};

export default Landing;