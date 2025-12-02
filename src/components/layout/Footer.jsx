import { Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cristo-dark text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/images/logo.png" alt="Logo" className="w-8 h-8 brightness-0 invert opacity-80" />
              <span className="font-serif text-lg">Cristo Rey</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Institución educativa católica comprometida con la formación integral de niños y jóvenes desde 1997.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-sm mb-4 text-cristo-accent uppercase tracking-wider">Institucional</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Proyecto Educativo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reglamento Interno</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Protocolos de Seguridad</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm mb-4 text-cristo-accent uppercase tracking-wider">Comunidad</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Portal de Padres</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Calendario 2026</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm mb-4 text-cristo-accent uppercase tracking-wider">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-cristo-accent hover:text-white transition-all active:scale-95">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Email" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-cristo-accent hover:text-white transition-all active:scale-95">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
          <p>© 2026 Colegio Católico Cristo Rey.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
            <a href="#" className="hover:text-white">GD – Web & Motion Design ❤️</a>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;