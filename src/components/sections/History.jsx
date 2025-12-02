import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  { year: '1997', title: 'El Comienzo', desc: 'Nuestro Colegio Católico Cristo Rey nació en Perico el 14 de marzo de 1997, inspirado por el deseo de brindar educación en valores cristianos a los más necesitados. Inició como Centro Educativo “Fe y Alegría Cristo Rey” en una casa familiar, con cuatro docentes guiadas por el carisma de las Hijas de Cristo Rey. Fieles a la misión de “evangelizar educando”, crecimos desde dos salas de Jardín y un 1º año de EGB, consolidándonos como un Centro confesional de la Iglesia Católica.', image: '/images/historia/1997.jpg' },
  { year: '1998', title: 'Primera Casa', desc: 'El 11 de diciembre de 1997, el Colegio se trasladó al edificio actual, ubicado en Av. Bolivia 929, en terrenos del Obispado de Jujuy. La primera construcción tenía solo dos aulas y sanitarios, levantados gracias a las Hijas de Cristo Rey, el Movimiento Fe y Alegría y las familias, que colaboraban con la merienda y la limpieza. Así comenzó a formarse una comunidad sostenida en los valores del Reino: justicia, caridad, verdad, bondad y libertad.', image: '/images/historia/1998.jpg' },
  { year: '2002', title: 'Reconocimiento', desc: 'En julio de 2002 se presentó la carpeta técnico-pedagógica ante las autoridades eclesiales y del Ministerio de Educación, solicitando la apertura de la EGB 3 con 7º año. La gestión obtuvo aprobación, permitiendo que la EGB 3 quedara incorporada a la enseñanza oficial en nuestro Centro. Este paso marcó un avance decisivo en el crecimiento institucional y en la consolidación de nuestra propuesta educativa.', image: '/images/historia/2002.jpg' },
  { year: '2003', title: 'Nivel Secundario', desc: 'El 12 de marzo de 2003 comenzó a funcionar el 7º año de la Educación General Básica 3, dando inicio formal a este nuevo nivel en la institución. Con el paso del tiempo, se fueron incorporando progresivamente los años restantes, consolidando la continuidad pedagógica y fortaleciendo el crecimiento académico del Colegio en su misión de brindar una educación integral y en valores.', image: '/images/historia/2003.jpg' },
  { year: '2013', title: 'Identidad', desc: 'En 2013, con la institución funcionando en todos sus niveles, el Movimiento de Educación Popular Fe y Alegría decidió concluir su obra en la Ciudad de Perico. Ante esta situación, el Obispo de Jujuy, Mons. Fernández, delegó la gestión del Colegio a las Hermanas Hijas de Cristo Rey, quienes asumieron la conducción para continuar fortaleciendo la misión educativa y evangelizadora de la comunidad.', image: '/images/historia/2013.jpg' },
  { year: '2022', title: '25 Años', desc: 'En el año 2022, toda la comunidad celebró los 25 años de vida institucional. Inspirados en la obra de José Gras, renovamos nuestro compromiso de que el amor fuera la fuerza que impulsara cada acción educativa. Fieles al lema de nuestro fundador, “El amor enseña a enseñar”, continuamos edificando una escuela que reflejara los valores que dieron origen a nuestra misión.', image: '/images/historia/2022.jpg' },
  { year: '2026', title: 'Futuro', desc: 'En 2026, el Colegio Cristo Rey reafirmó su camino iniciado en 1997, cuando nació para brindar educación en valores cristianos a los más necesitados. Tras su crecimiento en niveles, la apertura de la EGB 3 y la asunción de la gestión por las Hijas de Cristo Rey, la comunidad continuó fortaleciendo su misión. Fieles al legado de José Gras, seguimos educando con amor, servicio y compromiso.', image: '/images/historia/2025.jpg' }
];

const History = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. La Línea Central
      gsap.fromTo(lineRef.current, 
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1
          }
        }
      );

      // 2. Animación de Elementos
      const items = gsap.utils.toArray('.history-item');
      
      items.forEach((item, index) => {
        // A. La Tarjeta de Imagen (Entrada 3D)
        const imageCard = item.querySelector('.image-card');
        gsap.fromTo(imageCard,
          { opacity: 0, x: index % 2 === 0 ? -50 : 50, rotationY: index % 2 === 0 ? 15 : -15 },
          {
            opacity: 1, x: 0, rotationY: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 80%" }
          }
        );

        // B. El Texto (Entrada Suave)
        const textContent = item.querySelector('.text-content');
        gsap.fromTo(textContent,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 80%" }
          }
        );

        // C. La Marca de Agua (El Año Gigante) - Parallax
        const watermark = item.querySelector('.year-watermark');
        gsap.fromTo(watermark,
          { y: 50, opacity: 0 },
          {
            y: -50, opacity: 0.1, duration: 1, ease: "none",
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1 }
          }
        );

        // D. La Línea Dorada debajo del título
        const goldLine = item.querySelector('.gold-line');
        gsap.fromTo(goldLine,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 0.8, delay: 0.5, ease: "power2.out", transformOrigin: "left center",
            scrollTrigger: { trigger: item, start: "top 80%" }
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="history" className="py-32 bg-gray-50 relative overflow-hidden">
      
      {/* Fondo de Ruido Sutil (Textura de Papel) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")' }}>
      </div>

      <div className="container mx-auto px-6 mb-24 text-center relative z-10">
        <span className="text-cristo-accent font-bold tracking-[0.2em] text-xs uppercase mb-3 block">
          Nuestro Legado
        </span>
        <h2 className="font-serif text-4xl md:text-5xl text-cristo-primary">
          Historia Viva
        </h2>
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Líneas Centrales */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 hidden md:block"></div>
        <div ref={lineRef} className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-cristo-accent -translate-x-1/2 origin-top shadow-[0_0_15px_rgba(197,160,89,0.5)] hidden md:block"></div>

        <div className="space-y-32">
          {timelineEvents.map((event, index) => (
            <div 
              key={index} 
              className={`history-item flex flex-col md:flex-row items-center gap-8 md:gap-20 relative ${
                index % 2 === 0 ? '' : 'md:flex-row-reverse'
              }`}
            >
              
              {/* PUNTO CENTRAL */}
              <div className="absolute left-4 md:left-1/2 w-5 h-5 bg-white border-4 border-cristo-accent rounded-full -translate-x-1/2 z-20 shadow-lg hidden md:block transform hover:scale-150 transition-transform duration-300"></div>

              {/* LADO IMAGEN (Con marco estilo foto) */}
              <div className="w-full md:w-1/2 pl-12 md:pl-0 perspective-1000">
                <div className="image-card relative group">
                  <div className="h-64 md:h-80 w-full overflow-hidden rounded-lg shadow-xl border-8 border-white relative z-10">
                    <div className="absolute inset-0 bg-cristo-primary/10 group-hover:bg-transparent transition-colors z-20"></div>
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000"
                      loading="lazy"
                    />
                  </div>
                  {/* Elemento decorativo detrás de la foto */}
                  <div className={`absolute -bottom-4 -right-4 w-full h-full border-2 border-cristo-accent/30 rounded-lg -z-10 ${index % 2 !== 0 ? 'left-4 right-auto' : ''}`}></div>
                </div>
              </div>

              {/* LADO TEXTO (Con Marca de Agua de fondo) */}
              <div className={`w-full md:w-1/2 pl-12 md:pl-0 relative ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                
                {/* MARCA DE AGUA (AÑO GIGANTE) */}
                <div className={`year-watermark absolute top-1/2 -translate-y-1/2 text-[8rem] md:text-[10rem] font-serif font-bold text-cristo-primary/5 select-none pointer-events-none leading-none z-0 ${index % 2 === 0 ? '-right-10' : '-left-10'}`}>
                  {event.year}
                </div>

                <div className="text-content relative z-10">
                  <div className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm border border-gray-100 mb-4 ${index % 2 === 0 ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Calendar className="w-4 h-4 text-cristo-accent" />
                    <span className="text-cristo-primary font-bold font-serif">{event.year}</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-cristo-primary mb-6 relative inline-block">
                    {event.title}
                    {/* Línea dorada animada */}
                    <span className="gold-line absolute bottom-0 left-0 w-full h-1 bg-cristo-accent/60 rounded-full"></span>
                  </h3>
                  
                  {/* Párrafo con texto justificado */}
                  <p className="text-gray-600 leading-relaxed text-lg font-light text-justify">
                    {event.desc}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default History;