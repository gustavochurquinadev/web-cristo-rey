import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  {
    year: '1997',
    title: 'El Comienzo',
    desc: 'Nuestro Colegio Católico Cristo Rey nació en Perico el 14 de marzo de 1997, inspirado por el deseo de brindar educación en valores cristianos a los más necesitados. Inició como Centro Educativo “Fe y Alegría Cristo Rey” en una casa familiar.',
    image: '/images/historia/1997.webp', // Actualizado a WebP
    position: 'object-top' // 👈 CLAVE: Enfoca la parte de arriba (las cabezas)
  },
  {
    year: '1998',
    title: 'Primera Casa',
    desc: 'El 11 de diciembre de 1997, el Colegio se trasladó al edificio actual, ubicado en Av. Bolivia 929. La primera construcción tenía solo dos aulas y sanitarios, levantados gracias a las Hijas de Cristo Rey y el esfuerzo de las familias.',
    image: '/images/historia/1998.webp',
    position: 'object-center' // Edificios suelen verse bien al centro
  },
  {
    year: '2002',
    title: 'Reconocimiento',
    desc: 'En julio de 2002 se presentó la carpeta técnico-pedagógica solicitando la apertura de la EGB 3. La gestión obtuvo aprobación, permitiendo que la enseñanza oficial quedara incorporada en nuestro Centro.',
    image: '/images/historia/2002.webp',
    position: 'object-top' // Personas -> Arriba
  },
  {
    year: '2003',
    title: 'Nivel Secundario',
    desc: 'El 12 de marzo de 2003 comenzó a funcionar el 7º año de la EGB 3, dando inicio formal a este nuevo nivel. Con el tiempo se incorporaron los años restantes, consolidando la continuidad pedagógica.',
    image: '/images/historia/2003.webp',
    position: 'object-top'
  },
  {
    year: '2013',
    title: 'Identidad',
    desc: 'En 2013, Fe y Alegría concluyó su obra en Perico. El Obispo de Jujuy delegó la gestión a las Hermanas Hijas de Cristo Rey, quienes asumieron la conducción para continuar fortaleciendo la misión evangelizadora.',
    image: '/images/historia/2013.webp',
    position: 'object-center'
  },
  {
    year: '2022',
    title: '25 Años',
    desc: 'En el año 2022, toda la comunidad celebró los 25 años de vida institucional. Inspirados en José Gras, renovamos nuestro compromiso bajo el lema “El amor enseña a enseñar”.',
    image: '/images/historia/2022.webp',
    position: 'object-center'
  },
  {
    year: '2026',
    title: 'Futuro',
    desc: 'Hoy, el Colegio Cristo Rey reafirma su camino iniciado en 1997. Fieles al legado de José Gras, seguimos educando con amor, servicio y compromiso para las nuevas generaciones.',
    image: '/images/historia/2025.webp',
    position: 'object-center'
  }
];

const History = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // Línea Central
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

      // Elementos
      const items = gsap.utils.toArray('.history-item');

      items.forEach((item, index) => {
        const imageCard = item.querySelector('.image-card');
        gsap.fromTo(imageCard,
          { opacity: 0, x: index % 2 === 0 ? -50 : 50, rotationY: index % 2 === 0 ? 15 : -15 },
          {
            opacity: 1, x: 0, rotationY: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 80%" }
          }
        );

        const textContent = item.querySelector('.text-content');
        gsap.fromTo(textContent,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 80%" }
          }
        );

        const watermark = item.querySelector('.year-watermark');
        gsap.fromTo(watermark,
          { y: 50, opacity: 0 },
          {
            y: -50, opacity: 0.1, duration: 1, ease: "none",
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1 }
          }
        );

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

      {/* Fondo Textura */}
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
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 hidden md:block"></div>
        <div ref={lineRef} className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-cristo-accent -translate-x-1/2 origin-top shadow-[0_0_15px_rgba(197,160,89,0.5)] hidden md:block"></div>

        <div className="space-y-32">
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className={`history-item flex flex-col md:flex-row items-center gap-8 md:gap-20 relative ${index % 2 === 0 ? '' : 'md:flex-row-reverse'
                }`}
            >

              {/* PUNTO CENTRAL */}
              <div className="absolute left-4 md:left-1/2 w-5 h-5 bg-white border-4 border-cristo-accent rounded-full -translate-x-1/2 z-20 shadow-lg hidden md:block transform hover:scale-150 transition-transform duration-300"></div>

              {/* LADO IMAGEN */}
              <div className="w-full md:w-1/2 pl-12 md:pl-0 perspective-1000">
                <div className="image-card relative group">
                  <div className="h-64 md:h-80 w-full overflow-hidden rounded-lg shadow-xl border-8 border-white relative z-10">
                    <div className="absolute inset-0 bg-cristo-primary/10 group-hover:bg-transparent transition-colors z-20"></div>

                    {/* AQUÍ ESTÁ EL CAMBIO: Usamos event.position */}
                    <img
                      src={event.image}
                      alt={event.title}
                      className={`w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000 ${event.position || 'object-center'}`}
                      loading="lazy"
                    />

                  </div>
                  <div className={`absolute -bottom-4 -right-4 w-full h-full border-2 border-cristo-accent/30 rounded-lg -z-10 ${index % 2 !== 0 ? 'left-4 right-auto' : ''}`}></div>
                </div>
              </div>

              {/* LADO TEXTO */}
              <div className={`w-full md:w-1/2 pl-12 md:pl-0 relative ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>

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
                    <span className="gold-line absolute bottom-0 left-0 w-full h-1 bg-cristo-accent/60 rounded-full"></span>
                  </h3>

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