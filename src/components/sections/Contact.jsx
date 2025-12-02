import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Clock, AtSign, MapPin, ExternalLink, Mail, Copy } from 'lucide-react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const mapContainerRef = useRef(null);

  const contactInternals = [
    { area: 'Administración', ext: '101' },
    { area: 'Secretaría General', ext: '102' },
    { area: 'Nivel Inicial/Primario', ext: '103' },
    { area: 'Nivel Secundario', ext: '104' }
  ];

  const institutionalEmails = [
    { area: 'Nivel Inicial', email: 'nivelinicial@colecatcristorey.edu.ar' },
    { area: 'Nivel Primario', email: 'nivelprimario@colecatcristorey.edu.ar' },
    { area: 'Nivel Secundario', email: 'nivelsecundario@colecatcristorey.edu.ar' },
    { area: 'Administración', email: 'administracion@colecatcristorey.edu.ar' },
    { area: 'Aranceles', email: 'aranceles@colecatcristorey.edu.ar' },
    { area: 'Representante Legal', email: 'representantelegal@colecatcristorey.edu.ar' }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      // 1. Animación de Entrada de las Tarjetas
      const cards = gsap.utils.toArray('.contact-card');
      gsap.fromTo(cards,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );

      // 2. Animación del Mapa (Efecto "Reveal")
      gsap.fromTo(mapContainerRef.current,
        { clipPath: "inset(50% 0 50% 0)" }, // Empieza cerrado como una persiana
        {
          clipPath: "inset(0% 0 0% 0)", // Se abre completo
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: { trigger: mapContainerRef.current, start: "top 85%" }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="py-24 bg-gray-50 relative">
      <div className="container mx-auto px-6">
        
        {/* Cabecera */}
        <div className="text-center mb-16">
          <span className="text-cristo-accent font-bold tracking-widest text-xs uppercase mb-3 block">
            Estamos Cerca
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-cristo-primary">
            Canales de Atención
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          
          {/* TARJETA 1: TELÉFONOS (Diseño Glassy) */}
          <div className="contact-card bg-white p-8 rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-cristo-secondary/20 rounded-full flex items-center justify-center text-cristo-accent group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-cristo-primary font-bold">Líneas Telefónicas</h3>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Comunicación Directa</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative overflow-hidden rounded-lg bg-cristo-primary p-6 text-white text-center group/phone cursor-pointer transition-transform hover:-translate-y-1">
                <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Central Telefónica</p>
                <p className="text-3xl font-bold tracking-widest">388 4912303</p>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/phone:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <span className="flex items-center gap-2 font-bold"><Phone className="w-4 h-4" /> Llamar ahora</span>
                </div>
                <a href="tel:3884912303" className="absolute inset-0 z-10"></a>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-full h-px bg-gray-200"></span> Internos <span className="w-full h-px bg-gray-200"></span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {contactInternals.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-cristo-accent/50 transition-colors">
                      <span className="text-gray-600 font-medium">{item.area}</span>
                      <span className="font-bold text-cristo-primary bg-white px-2 py-1 rounded shadow-sm text-xs">{item.ext}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 py-3 rounded-full">
                <Clock className="w-4 h-4 text-cristo-accent" />
                <span>Atención Lun a Vie: <strong>8:00 - 13:00 hs</strong></span>
              </div>
            </div>
          </div>

          {/* TARJETA 2: CORREOS (Diseño Interactivo) */}
          <div className="contact-card bg-white p-8 rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-cristo-secondary/20 rounded-full flex items-center justify-center text-cristo-accent group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-cristo-primary font-bold">Correos Institucionales</h3>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Áreas Específicas</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cristo-secondary scrollbar-track-gray-100">
              {institutionalEmails.map((item, i) => (
                <div key={i} className="group/email p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-300 relative">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded w-fit">{item.area}</p>
                    <div className="flex items-center gap-2 opacity-0 group-hover/email:opacity-100 transition-opacity absolute top-4 right-4 sm:static">
                      <button onClick={() => copyToClipboard(item.email)} className="p-1.5 hover:bg-white rounded-full shadow-sm text-gray-500 hover:text-cristo-accent" title="Copiar"><Copy className="w-3.5 h-3.5" /></button>
                      <a href={`mailto:${item.email}`} className="p-1.5 hover:bg-white rounded-full shadow-sm text-gray-500 hover:text-cristo-primary" title="Enviar correo"><ExternalLink className="w-3.5 h-3.5" /></a>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-cristo-primary mt-2 sm:mt-1 font-mono break-all">{item.email}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MAPA INTERACTIVO (Con Revelación) */}
        <div ref={mapContainerRef} className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.5682977754687!2d-65.11678992383296!3d-24.256847087093226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941b06256c7028ad%3A0xe54c40589a695325!2sColegio%20Cristo%20Rey!5e0!3m2!1ses!2sar!4v1701389823456!5m2!1ses!2sar"
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(0%) contrast(1.1)' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Colegio Catolico Cristo Rey"
            className="group-hover:scale-105 transition-transform duration-[2s] ease-in-out"
          ></iframe>
          
          {/* Card Flotante sobre el mapa */}
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white/95 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg border border-white/50 max-w-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0 animate-bounce" />
              <div>
                <h4 className="font-bold text-cristo-primary text-sm">Sede Central</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">Av. Bolivia 929<br/>Ciudad Perico, Jujuy</p>
                <a 
                  href="https://maps.app.goo.gl/xX1X1X1X1X1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] font-bold text-blue-600 mt-2 block hover:underline"
                >
                  Ver en Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;