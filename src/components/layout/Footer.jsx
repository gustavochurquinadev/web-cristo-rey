import { Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cristo-dark text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">

          {/* Columna 1: Logo e Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
                {/* CAMBIO A .webp */}
                <img src="/images/logo.webp" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif text-lg">Cristo Rey</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Desde 1997 educando desde el amor.
            </p>
          </div>

          {/* Columna 2: Institucional */}
          <div>
            <h4 className="font-serif text-sm mb-4 text-cristo-accent uppercase tracking-wider">Institucional</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Proyecto Educativo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reglamento Interno</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Protocolos de Seguridad</a></li>
            </ul>
          </div>

          {/* Columna 3: Comunidad (ACTUALIZADO) */}
          <div>
            <h4 className="font-serif text-sm mb-4 text-cristo-accent uppercase tracking-wider">Comunidad</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {/* Se agregó Pastoral y se eliminó Portal de Padres */}
              <li><a href="#pastoral" className="hover:text-white transition-colors">Pastoral</a></li>
              <li><a href="#calendar" className="hover:text-white transition-colors">Calendario 2026</a></li>
            </ul>
          </div>

          {/* Columna 4: Redes y Contacto */}
          <div>
            <h4 className="font-serif text-sm mb-4 text-cristo-accent uppercase tracking-wider">Síguenos</h4>
            <div className="flex space-x-4">
              {/* FACEBOOK PASTORAL */}
              <a
                href="https://www.facebook.com/profile.php?id=100069602040359"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Pastoral"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-cristo-accent hover:text-white transition-all active:scale-95"
              >
                <Facebook className="w-4 h-4" />
              </a>

              {/* EMAIL DIRECTO */}
              <a
                href="mailto:administracion@colecatcristorey.edu.ar?subject=Consulta%20desde%20la%20Web"
                aria-label="Enviar correo"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-cristo-accent hover:text-white transition-all active:scale-95"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
          <p>© 2026 Colegio Católico Cristo Rey.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
            <a
              href="https://wa.me/5493885016518?text=hola!%20quiero%20consultar%20por%20el%20desarrollo%20de%20una%20pagina%20web"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              GD – Web & Motion Design ❤️
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;