import { useLayoutEffect, useRef } from 'react';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const News = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  const newsItems = [
    {
      title: 'Huellas de Cristo Rey en la Eucaristía 2025',
      date: '20 Nov, 2025',
      image: '/images/noticias/1.webp',
      category: 'Festejos',
      description: 'La comunidad celebró la Eucaristía de Cristo Rey 2025, agradeciendo a todos los que participaron en su organización.'
    },
    {
      title: 'Huellas de fiesta, juegos y talentos',
      date: '19 Nov, 2025',
      image: '/images/noticias/2.webp',
      category: 'Celebración',
      description: 'Jornada con diversas actividades artísticas, culturales y lúdicas que reflejaron el espíritu celebrativo.'
    },
    {
      title: 'Huellas de Cristo Rey',
      date: '17 Nov, 2025',
      image: '/images/noticias/3.webp',
      category: 'Comunidad',
      description: 'La comunidad expresó su gratitud hacia los estudiantes de la promoción 2025 que realizaron catequesis.'
    }
  ];

  const fullCalendar = [
    { month: 'Enero', event: 'Receso de Verano', date: '-' },
    { month: 'Febrero', event: 'Inicio de Ciclo Lectivo', date: '23' },
    { month: 'Marzo', event: 'Inicio del Ciclo Lectivo', date: '01' },
    { month: 'Abril', event: 'Semana Santa y Pascuas', date: '15-19' },
    { month: 'Mayo', event: 'Mes de la Virgen María', date: 'Todo el mes' },
    { month: 'Junio', event: 'Promesa a la Bandera', date: '20' },
    { month: 'Julio', event: 'Receso Escolar de Invierno', date: '13-24' },
    { month: 'Agosto', event: 'Semana del Colegio', date: '12-16' },
    { month: 'Septiembre', event: 'Día del Estudiante', date: '21' },
    { month: 'Octubre', event: 'Expo Cristo Rey', date: '10' },
    { month: 'Noviembre', event: 'Muestras Anuales', date: '15-30' },
    { month: 'Diciembre', event: 'Finalizacion del Cliclo Lectivo', date: '18' }
  ];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {

      // 1. Animación del Título
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: titleRef.current, start: "top 85%" }
        }
      );

      // 2. Animación de las Tarjetas de Noticias
      gsap.fromTo(".news-card",
        { y: 100, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)",
          scrollTrigger: { trigger: ".news-grid", start: "top 80%" }
        }
      );

      // 3. Animación del Calendario (Aparecen los meses como fichas)
      gsap.fromTo(".calendar-item",
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: "power2.out",
          scrollTrigger: { trigger: "#calendar", start: "top 75%" }
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Micro-interacción Hover con GSAP
  const handleMouseEnter = (e) => {
    const img = e.currentTarget.querySelector('img');
    const badge = e.currentTarget.querySelector('.category-badge');
    gsap.to(img, { scale: 1.1, duration: 0.5 });
    gsap.to(badge, { y: -5, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = (e) => {
    const img = e.currentTarget.querySelector('img');
    const badge = e.currentTarget.querySelector('.category-badge');
    gsap.to(img, { scale: 1, duration: 0.5 });
    gsap.to(badge, { y: 0, duration: 0.3, ease: "power2.out" });
  };

  return (
    <div ref={sectionRef}>
      {/* SECCIÓN NOTICIAS */}
      <section id="news" className="py-24 bg-gray-50 flex items-center">
        <div className="container mx-auto px-6">
          <div ref={titleRef} className="text-center mb-16">
            <span className="text-cristo-accent font-bold tracking-widest text-xs uppercase">Novedades</span>
            <h2 className="font-serif text-4xl text-cristo-primary mt-2">Últimas Noticias</h2>
          </div>

          <div className="news-grid grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {newsItems.map((news, index) => (
              <article
                key={index}
                className="news-card bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group h-full flex flex-col border border-transparent hover:border-cristo-accent/30 transition-colors"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="h-60 overflow-hidden relative">
                  <div className="category-badge absolute top-4 left-4 bg-cristo-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 shadow-sm">
                    {news.category}
                  </div>
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white text-sm font-bold flex items-center">Leer más <ArrowRight className="w-4 h-4 ml-2" /></span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <span className="text-xs text-cristo-accent font-bold mb-3 flex items-center uppercase tracking-wide">
                    <Calendar className="w-3 h-3 mr-1" /> {news.date}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-cristo-primary mb-3 leading-tight group-hover:text-cristo-accent transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow line-clamp-3">
                    {news.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN CALENDARIO */}
      <section id="calendar" className="py-24 bg-white relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-cristo-accent font-bold tracking-widest text-xs uppercase">Agenda</span>
            <h2 className="font-serif text-4xl text-cristo-primary mt-2">Calendario 2026</h2>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fullCalendar.map((month, i) => (
                <div key={i} className="calendar-item bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-cristo-accent hover:shadow-md transition-all duration-300 group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-serif text-lg font-bold text-cristo-primary">{month.month}</span>
                    {month.date !== '-' && (
                      <span className="text-xs font-bold text-cristo-accent bg-cristo-secondary/20 px-2 py-1 rounded text-right">{month.date}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide group-hover:text-cristo-dark transition-colors">
                    {month.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;