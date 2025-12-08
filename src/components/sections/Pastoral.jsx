import { useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Church, Facebook, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Pastoral = () => {
  const sectionRef = useRef(null);

  const pastoralImages = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      src: `/images/pastoral/foto${i + 1}.webp`,
      height: i % 3 === 0 ? 'h-64' : (i % 2 === 0 ? 'h-48' : 'h-80')
    }));
  }, []);

  const col1 = pastoralImages.slice(0, 4);
  const col2 = pastoralImages.slice(4, 8);
  const col3 = pastoralImages.slice(8, 12);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(".pastoral-col-1", {
        y: -50,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 }
      });
      gsap.fromTo(".pastoral-col-2",
        { y: -80 }, { y: 20, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 } }
      );
      gsap.to(".pastoral-col-3", {
        y: -30,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.5 }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pastoral" ref={sectionRef} className="py-24 bg-cristo-primary text-white relative overflow-hidden flex items-center">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-4/12 z-20 lg:sticky lg:top-32">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-white/20 w-fit">
              <Heart className="w-4 h-4 text-cristo-accent fill-current" />
              <span className="text-xs font-bold tracking-widest uppercase">Corazón y Espíritu</span>
            </div>
            <h2 className="font-serif text-5xl mb-6 leading-tight">Pastoral Educativa</h2>
            <p className="text-cristo-secondary text-lg mb-10 leading-relaxed font-light">Cada rostro cuenta una historia de encuentro, alegría y servicio. Nuestra pastoral es el latido de la comunidad Cristo Rey.</p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border-l-2 border-transparent hover:border-cristo-accent">
                <Church className="w-6 h-6 text-cristo-accent mt-1" />
                <div>
                  <h4 className="font-serif text-lg mb-1">Encuentros</h4>
                  <p className="text-sm text-gray-300">Retiros espirituales y jornadas de convivencia.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border-l-2 border-transparent hover:border-cristo-accent">
                <Heart className="w-6 h-6 text-cristo-accent mt-1" />
                <div>
                  <h4 className="font-serif text-lg mb-1">Misión Solidaria</h4>
                  <p className="text-sm text-gray-300">Proyectos de servicio en la comunidad.</p>
                </div>
              </div>
              <a href="https://www.facebook.com/profile.php?id=100069602040359&sk=photos&locale=es_LA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 px-6 py-3 bg-cristo-accent text-white font-semibold rounded hover:bg-yellow-600 transition-colors shadow-lg"><Facebook className="w-5 h-5" /><span>Visitar Facebook Pastoral</span><ExternalLink className="w-4 h-4 ml-1" /></a>
            </div>
          </div>
          <div className="lg:w-8/12 h-[800px] overflow-hidden relative">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="pastoral-col-1 space-y-4 md:space-y-6">
                {col1.map((img) => (
                  <div key={img.id} className={`overflow-hidden rounded-xl shadow-xl ${img.height} relative group`}>
                    <div className="absolute inset-0 bg-cristo-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img src={img.src} alt="Pastoral" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.target.src = '/images/hero-colegio.webp' }} loading="lazy" />
                  </div>
                ))}
              </div>
              <div className="pastoral-col-2 space-y-4 md:space-y-6 pt-12">
                {col2.map((img) => (
                  <div key={img.id} className={`overflow-hidden rounded-xl shadow-xl ${img.height} relative group`}>
                    <div className="absolute inset-0 bg-cristo-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img src={img.src} alt="Pastoral" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.target.src = '/images/hero-colegio.webp' }} loading="lazy" />
                  </div>
                ))}
              </div>
              <div className="pastoral-col-3 space-y-4 md:space-y-6 hidden md:block">
                {col3.map((img) => (
                  <div key={img.id} className={`overflow-hidden rounded-xl shadow-xl ${img.height} relative group`}>
                    <div className="absolute inset-0 bg-cristo-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img src={img.src} alt="Pastoral" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.target.src = '/images/hero-colegio.webp' }} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-cristo-primary to-transparent z-20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cristo-primary to-transparent z-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pastoral;