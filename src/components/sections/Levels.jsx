import { useLayoutEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Levels = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  // NOTA: Asegúrate de que estas imágenes (.webp) sean las versiones "limpias" (sin texto pintado)
  // para que el efecto de superposición se vea profesional.
  const levels = [
    {
      title: 'Nivel Inicial',
      subtitle: 'Cimentando el futuro',
      description: 'Un espacio seguro donde el juego y el descubrimiento despiertan el amor por aprender.',
      image: '/images/nivel-inicial.webp', // Actualizado a WebP
      features: ['Desarrollo socio-emocional', 'Catequesis temprana', 'Iniciación al inglés']
    },
    {
      title: 'Nivel Primario',
      subtitle: 'Creciendo en valores',
      description: 'Formación integral que equilibra la excelencia académica con el desarrollo espiritual y humano.',
      image: '/images/nivel-primario.webp', // Actualizado a WebP
      features: ['Proyectos interdisciplinarios', 'Tecnología educativa', 'Formación sacramental']
    },
    {
      title: 'Nivel Secundario',
      subtitle: 'Liderazgo y servicio',
      description: 'Preparamos jóvenes con pensamiento crítico y corazón solidario, listos para transformar el mundo.',
      image: '/images/nivel-secundario.webp', // Actualizado a WebP
      features: ['Orientación vocacional', 'Proyectos solidarios', 'Certificaciones académicas']
    }
  ];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {

      // 1. Animación del Título Principal
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: titleRef.current, start: "top 80%" }
        }
      );

      // 2. Animación de las Tarjetas (Cascada)
      const cards = gsap.utils.toArray('.level-card');

      gsap.fromTo(cards,
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );

      // 3. Efecto Parallax en la imagen de fondo
      cards.forEach((card) => {
        const img = card.querySelector('img.level-bg');
        if (img) {
          gsap.to(img, {
            y: 20, // Movimiento vertical suave al hacer scroll
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="levels" ref={sectionRef} className="py-24 bg-white flex items-center">
      <div className="container mx-auto px-6">

        {/* Cabecera de la Sección */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="text-cristo-accent font-bold tracking-widest text-xs uppercase">Excelencia Académica</span>
          <h2 className="font-serif text-4xl text-cristo-primary mt-2">Propuesta Educativa</h2>
        </div>

        {/* Grid de Niveles */}
        <div className="grid md:grid-cols-3 gap-8">
          {levels.map((level, idx) => (
            <div key={idx} className="level-card group bg-gray-50 hover:shadow-2xl transition-all duration-500 overflow-hidden border-b-4 border-transparent hover:border-cristo-accent rounded-t-lg transform hover:-translate-y-2">

              {/* --- ZONA DE IMAGEN ACTIVA --- */}
              <div className="h-64 overflow-hidden relative cursor-pointer">

                {/* 1. Imagen de Fondo (Limpia) */}
                <img
                  src={level.image}
                  alt={level.title}
                  className="level-bg w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* 2. Capa Oscura (Overlay) al pasar el mouse */}
                <div className="absolute inset-0 bg-cristo-primary/0 group-hover:bg-cristo-primary/90 transition-colors duration-500 z-10"></div>

                {/* 3. Contenido "Reveal" (Logo + Texto) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {/* Logo: Asegúrate de tener logo.webp en public/images/ */}
                  <img src="/images/logo.webp" alt="Escudo" className="w-16 h-16 object-contain mb-3 drop-shadow-lg" />

                  {/* Título del Nivel con estilo */}
                  <h3 className="font-serif text-2xl text-white font-bold tracking-wider uppercase drop-shadow-md border-b-2 border-cristo-accent pb-1">
                    {level.title}
                  </h3>
                </div>

              </div>

              {/* --- INFORMACIÓN INFERIOR --- */}
              <div className="p-8 bg-white relative z-20">
                <h3 className="font-serif text-2xl text-cristo-primary mb-1 group-hover:text-cristo-accent transition-colors">
                  {level.title}
                </h3>
                <p className="text-cristo-accent text-sm font-medium mb-4 italic">{level.subtitle}</p>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">{level.description}</p>
                <ul className="space-y-2">
                  {level.features.map((f, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-cristo-secondary mr-2" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Levels;