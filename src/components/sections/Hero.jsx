import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero = ({ onNavigate, startAnimation }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (startAnimation) {
      const ctx = gsap.context(() => {
        // Animación de entrada
        gsap.fromTo(textRef.current.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
        );

        // Movimiento de fondo
        gsap.to(imageRef.current, {
          scale: 1.1,
          duration: 10,
          ease: "none",
          repeat: -1,
          yoyo: true
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [startAnimation]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-cristo-primary"
    >
      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <img
          ref={imageRef}
          src="/images/hero-colegio.webp"
          alt="Colegio Cristo Rey"
          className="w-full h-full object-cover"
          fetchpriority="high"
          loading="eager"
        />
        {/* CORRECCIÓN: Gradiente un poco más oscuro para asegurar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-cristo-primary/95 via-cristo-primary/60 to-transparent"></div>
      </div>

      {/* Contenido Alineado a la Izquierda */}
      <div className="container mx-auto px-6 relative z-10 pt-10">
        <div ref={textRef} className="max-w-4xl">

          <div className="mb-8 opacity-0">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
              Colegio Católico
            </h1>
            {/* CORRECCIÓN DE COLOR AQUÍ: text-cristo-accent (Dorado) en lugar de secondary (Crema) */}
            <span className="block font-serif text-6xl md:text-8xl text-cristo-accent italic mt-1 font-medium drop-shadow-md">
              Cristo Rey
            </span>
          </div>

          <div className="flex items-center space-x-4 mb-8 opacity-0">
            <span className="h-px w-12 bg-cristo-secondary/60"></span>
            <span className="text-cristo-secondary text-xs font-bold tracking-[0.2em] uppercase inline-block">
              Desde 1997 • Tradición y Futuro
            </span>
          </div>

          <p className="text-lg md:text-xl text-gray-100 mb-10 font-light leading-relaxed max-w-lg text-pretty drop-shadow-sm opacity-0">
            Tu familia forma parte de un sueño... el sueño de José Gras.
          </p>


        </div>
      </div>
    </section>
  );
};

export default Hero;