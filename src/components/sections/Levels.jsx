import { useLayoutEffect, useRef } from 'react';
import { School, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Levels = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  const levels = [
    {
      title: 'Nivel Inicial',
      subtitle: 'Cimentando el futuro',
      description: 'Un espacio seguro donde el juego y el descubrimiento despiertan el amor por aprender.',
      image: '/images/nivel-inicial.jpg',
      features: ['Desarrollo socio-emocional', 'Catequesis temprana', 'Iniciación al inglés']
    },
    {
      title: 'Nivel Primario',
      subtitle: 'Creciendo en valores',
      description: 'Formación integral que equilibra la excelencia académica con el desarrollo espiritual y humano.',
      image: '/images/nivel-primario.jpg',
      features: ['Proyectos interdisciplinarios', 'Tecnología educativa', 'Formación sacramental']
    },
    {
      title: 'Nivel Secundario',
      subtitle: 'Liderazgo y servicio',
      description: 'Preparamos jóvenes con pensamiento crítico y corazón solidario, listos para transformar el mundo.',
      image: '/images/nivel-secundario.jpg',
      features: ['Orientación vocacional', 'Proyectos solidarios', 'Certificaciones académicas']
    }
  ];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      // 1. Animación del Título (Usamos fromTo para evitar bugs de recarga en React)
      gsap.fromTo(titleRef.current, 
        { y: 50, opacity: 0 }, // Estado INICIAL forzado
        {
          y: 0, 
          opacity: 1, 
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%", // Inicia cuando el título está al 80% de la ventana
          }
        }
      );

      // 2. Animación de las Cards (Cascada / Stagger)
      const cards = gsap.utils.toArray('.level-card');
      
      gsap.fromTo(cards, 
        { y: 100, opacity: 0 }, // Estado INICIAL forzado
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2, // Retraso de 0.2s entre cada una
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );

      // 3. Parallax interno de las imágenes
      cards.forEach((card) => {
        const img = card.querySelector('img');
        
        if (img) {
          gsap.to(img, {
            y: -20, // Se mueve sutilmente hacia arriba
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true // Movimiento atado al scroll
            }
          });
        }
      });

    }, sectionRef);

    return () => ctx.revert(); // Limpieza al desmontar
  }, []);

  return (
    <section id="levels" ref={sectionRef} className="py-24 bg-white flex items-center">
      <div className="container mx-auto px-6">
        
        {/* Título animado */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="text-cristo-accent font-bold tracking-widest text-xs uppercase">Excelencia Académica</span>
          <h2 className="font-serif text-4xl text-cristo-primary mt-2">Propuesta Educativa</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {levels.map((level, idx) => (
            /* IMPORTANTE: La clase 'level-card' es clave para la animación */
            <div key={idx} className="level-card group bg-gray-50 hover:shadow-2xl transition-all duration-500 overflow-hidden border-b-4 border-transparent hover:border-cristo-accent rounded-t-lg transform hover:-translate-y-2">
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-cristo-primary/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                {/* Altura extra para permitir el efecto parallax sin bordes blancos */}
                <img src={level.image} alt={level.title} className="w-full h-[120%] object-cover -mt-4" loading="lazy" />
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl text-cristo-primary mb-1 group-hover:text-cristo-accent transition-colors">{level.title}</h3>
                <p className="text-cristo-accent text-sm font-medium mb-4 italic">{level.subtitle}</p>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">{level.description}</p>
                <ul className="space-y-2">
                  {level.features.map((f, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-500"><CheckCircle className="w-4 h-4 text-cristo-secondary mr-2" />{f}</li>
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