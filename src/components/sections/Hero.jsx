import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero = ({ onNavigate }) => {
  const comp = useRef(null);
  const titleContainerRef = useRef(null);
  const elementsRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Agregamos un delay inicial de 2.5s para esperar a que termine el Loading Screen
      // Así la animación empieza justo cuando se levanta el telón.
      const tl = gsap.timeline({ delay: 2.8 }); 
      
      // --- CÁLCULOS DE POSICIÓN ---
      const titleState = titleContainerRef.current.getBoundingClientRect();
      const centerX = window.innerWidth / 2 - titleState.left - titleState.width / 2;
      const centerY = window.innerHeight / 2 - titleState.top - titleState.height / 2;

      // 0. ESTADO INICIAL (Antes de que suba el telón)
      gsap.set(elementsRef.current, { autoAlpha: 0, y: 20 });
      // La imagen empieza con zoom (1.3) y oscura, lista para "abrirse"
      gsap.set(imageRef.current, { scale: 1.3, filter: "brightness(0.4)" });

      // 1. ANIMACIÓN "ACORDE AL ISOLANDING" (Cinemática)
      
      // A. El texto se acomoda suavemente (sin vuelos locos)
      tl.fromTo(titleContainerRef.current, 
        { x: centerX + 50, y: centerY, opacity: 0 }, // Empieza sutilmente a la derecha
        { 
          x: centerX, 
          y: centerY, 
          opacity: 1, 
          duration: 1.2, 
          ease: "power3.out" 
        }
      )
      
      // B. El "Gran Reveal": Texto a su sitio + Luz + Zoom Out
      .to(titleContainerRef.current, { 
        x: 0, y: 0, scale: 1, duration: 1.5, ease: "power4.inOut" 
      }, "open+=0.2")
      
      // La imagen se "aclara" y empieza a retroceder (conecta con el telón subiendo)
      .to(imageRef.current, { 
        filter: "brightness(0.7)", 
        duration: 2, 
        ease: "power2.inOut" 
      }, "open")

      // C. Aparición del contenido secundario
      .to(elementsRef.current, { 
        autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" 
      }, "-=1");

      // 2. MOVIMIENTO CONSTANTE (Cinematic Drift)
      // Eliminamos el "yoyo" (respiración). Ahora es un viaje lineal y elegante.
      // La imagen sigue haciendo zoom-out muy lentamente, creando profundidad infinita.
      gsap.to(imageRef.current, {
        scale: 1, // Va desde 1.3 (inicial) hasta 1
        duration: 20, // Tarda 20 segundos en llegar (muy lento)
        ease: "none", // Movimiento lineal constante
        // Cuando termine, podemos reiniciarlo o dejarlo quieto. 
        // Para "loop" imperceptible, podríamos usar repeat, pero en scale 1 se ve bien.
      });

      // El badge flota suavemente (este sí puede respirar levemente, es un detalle)
      gsap.to(badgeRef.current, {
        y: -5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, comp);

    return () => ctx.revert();
  }, []);

  // 3. PARALLAX INTERACTIVO (Conexión con el usuario)
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 15; // Movimiento sutil (15px)
    const yPos = (clientY / window.innerHeight - 0.5) * 15;

    gsap.to(imageRef.current, {
      x: -xPos,
      y: -yPos,
      duration: 1.5, // Más inercia para que sea elegante
      ease: "power2.out"
    });
  };

  return (
    <section 
      id="home" 
      ref={comp} 
      className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-cristo-primary"
      onMouseMove={handleMouseMove}
    >
      
      {/* Fondo con Imagen */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          ref={imageRef}
          src="/images/hero-colegio.jpg" 
          alt="Colegio Cristo Rey" 
          className="w-full h-full object-cover origin-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cristo-primary/90 via-cristo-primary/40 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 pt-10">
        <div className="max-w-4xl"> 
          
          {/* TÍTULO PRINCIPAL */}
          <div ref={titleContainerRef} className="relative z-50 mb-8 origin-left will-change-transform">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
              Colegio Católico
            </h1>
            <span className="block font-serif text-6xl md:text-8xl text-cristo-secondary italic mt-1 font-medium drop-shadow-md">
              Cristo Rey
            </span>
          </div>
          
          {/* CONTENIDO SECUNDARIO */}
          <div ref={elementsRef} className="invisible">
            <div className="flex items-center space-x-4 mb-8">
              <span className="h-px w-12 bg-cristo-secondary/60"></span>
              <span ref={badgeRef} className="text-cristo-secondary text-xs font-bold tracking-[0.2em] uppercase inline-block">
                Desde 1997 • Tradición y Futuro
              </span>
            </div>

            <p className="text-lg md:text-xl text-gray-100 mb-10 font-light leading-relaxed max-w-lg text-pretty drop-shadow-sm">
              Formamos personas íntegras y líderes compasivos, uniendo la excelencia académica con los valores del Evangelio.
            </p>
            
            <div className="flex flex-wrap gap-4">
               <button onClick={() => onNavigate('contact')} className="group px-8 py-4 bg-cristo-secondary text-cristo-primary font-bold rounded-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(234,219,200,0.2)] hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
                  <span className="relative z-10">Solicitar Admisión</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
               </button>
               <button onClick={() => onNavigate('levels')} className="px-8 py-4 border border-white/30 text-white font-bold rounded-lg hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm">
                  Nuestra Propuesta
               </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;