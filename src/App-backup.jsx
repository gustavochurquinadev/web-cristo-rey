import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  School, 
  Users, 
  BookOpen, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  DollarSign, 
  FileText, 
  Send, 
  ChevronDown, 
  ChevronUp,
  Heart,
  GraduationCap,
  Briefcase,
  Church,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Newspaper,
  User,
  Upload,
  Paperclip
} from 'lucide-react';

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: '',
    cv: null
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [cvFileName, setCvFileName] = useState('');
  
  const sectionRefs = useRef({});

  // Scroll Spy Implementation
  useEffect(() => {
    const observers = [];
    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleScroll = (sectionId) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  // Enhanced phone validation for Chilean format
  const validatePhone = (phone) => {
    const chileanPhoneRegex = /^(\+?56)?(\s?)(0?9)(\s?)[0-9]{4}(\s?)[0-9]{4}$/;
    return chileanPhoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Por favor ingresa un email válido';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'El teléfono es requerido';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Por favor ingresa un teléfono chileno válido (ej: +56 9 1234 5678)';
    }

    if (!formData.position) {
      errors.position = 'Por favor selecciona una posición';
    }

    if (!formData.cv) {
      errors.cv = 'Por favor adjunta tu CV';
    } else {
      const validExtensions = ['pdf', 'doc', 'docx'];
      const fileExtension = formData.cv.name.split('.').pop().toLowerCase();
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validExtensions.includes(fileExtension)) {
        errors.cv = 'El CV debe ser un archivo PDF, DOC o DOCX';
      } else if (formData.cv.size > maxSize) {
        errors.cv = 'El archivo no debe superar los 5MB';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setFormLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      console.log('CV File:', formData.cv);
      setFormSubmitted(true);
      setFormLoading(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        message: '',
        cv: null
      });
      setCvFileName('');
      setFormErrors({});
      setTimeout(() => setFormSubmitted(false), 5000);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, cv: file }));
      setCvFileName(file.name);
      
      // Clear error when file is selected
      if (formErrors.cv) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.cv;
          return newErrors;
        });
      }
    }
  };

  const toggleExpand = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'levels', label: 'Niveles', icon: School },
    { id: 'pastoral', label: 'Pastoral', icon: Church },
    { id: 'achievements', label: 'Logros', icon: Award },
    { id: 'staff', label: 'Equipo', icon: Users },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'news', label: 'Noticias', icon: Newspaper },
    { id: 'administration', label: 'Administración', icon: Briefcase },
    { id: 'careers', label: 'Trabaja con Nosotros', icon: Briefcase },
    { id: 'contact', label: 'Contacto', icon: Mail }
  ];

  const levels = [
    {
      title: 'Inicial',
      description: 'En esta etapa, los niños desarrollan habilidades fundamentales a través del juego y la exploración en un ambiente acogedor y estimulante.',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
      features: ['Desarrollo emocional', 'Habilidades sociales', 'Aprendizaje lúdico', 'Preparación para primaria']
    },
    {
      title: 'Primario',
      description: 'Fomentamos el aprendizaje integral, desarrollando habilidades académicas, sociales y espirituales en un entorno que promueve la curiosidad y el amor por el conocimiento.',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop',
      features: ['Educación integral', 'Valores cristianos', 'Proyectos interdisciplinarios', 'Tecnología educativa']
    },
    {
      title: 'Secundario',
      description: 'Preparamos a nuestros estudiantes para enfrentar los desafíos del mundo moderno, fomentando el pensamiento crítico, la responsabilidad y la formación de líderes comprometidos con su fe y comunidad.',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
      features: ['Preparación universitaria', 'Liderazgo estudiantil', 'Proyectos comunitarios', 'Orientación vocacional']
    }
  ];

  const pastoralActivities = [
    { title: 'Misa Semanal', description: 'Celebración comunitaria cada viernes para fortalecer nuestra fe y comunidad escolar.' },
    { title: 'Retiros Espirituales', description: 'Experiencias de reflexión y conexión espiritual durante el año escolar.' },
    { title: 'Voluntariado', description: 'Programas de servicio comunitario que fomentan la solidaridad y compasión.' },
    { title: 'Catequesis', description: 'Formación religiosa para todos los niveles educativos.' }
  ];

  const achievements = [
    {
      title: 'Excelencia Académica 2024',
      description: 'Reconocidos por el Ministerio de Educación por nuestros destacados resultados en pruebas estandarizadas.',
      icon: Award,
      color: 'blue'
    },
    {
      title: 'Certificación Ambiental',
      description: 'Primer colegio de la región en obtener certificación de sostenibilidad ambiental.',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: '95% Ingreso Universidad',
      description: 'El 95% de nuestros egresados ingresan a universidades tradicionales cada año.',
      icon: GraduationCap,
      color: 'purple'
    },
    {
      title: 'Premio a la Innovación',
      description: 'Galardonados por nuestro programa de tecnología educativa y metodologías innovadoras.',
      icon: CheckCircle,
      color: 'orange'
    }
  ];

  const staffMembers = [
    {
      name: 'Hna. Prof. Mendez Maria Susana',
      position: 'Representante Legal',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      bio: ''
    },
    {
      name: 'Prof. Gonzalez Espeche Beatriz',
      position: 'Directora Nivel Inicial',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      bio: 'nivelinicial@colecatcristorey.edu.ar'
    },
    {
      name: 'Hna. Prof. Mendez Maria Susana',
      position: 'Directora Nivel Primario',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      bio: 'nivelprimerio@colecatcristorey.edu.ar'
    },
    {
      name: 'Prof. Francou Anahi Analia',
      position: 'Directora Nivel Secundario',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      bio: 'nivelsecundario@colecatcristorey.edu.ar'
    }
  ];

  const calendarEvents = [
    { month: 'Marzo', event: 'Inicio del Año Escolar', date: '1 de Marzo' },
    { month: 'Abril', event: 'Semana Santa - Actividades Especiales', date: '15-19 de Abril' },
    { month: 'Mayo', event: 'Mes de María - Celebraciones', date: 'Todo el mes' },
    { month: 'Junio', event: 'Vacaciones de Invierno', date: '17-28 de Junio' },
    { month: 'Julio', event: 'Fiestas Patrias', date: '18-19 de Julio' },
    { month: 'Agosto', event: 'Semana Aniversario del Colegio', date: '15-19 de Agosto' },
    { month: 'Octubre', event: 'Jornada de Puertas Abiertas', date: '12 de Octubre' },
    { month: 'Noviembre', event: 'Graduación Secundaria', date: '30 de Noviembre' },
    { month: 'Diciembre', event: 'Fin del Año Escolar', date: '20 de Diciembre' }
  ];

  const newsItems = [
    {
      title: 'Estudiantes de Secundaria Ganan Torneo Regional de Robótica',
      date: '15 de Noviembre, 2024',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
      excerpt: 'Nuestro equipo de robótica se coronó campeón en el torneo regional, destacando por su innovación y trabajo en equipo.',
      category: 'Logros'
    },
    {
      title: 'Nueva Biblioteca Digital Disponible para Todos los Estudiantes',
      date: '10 de Noviembre, 2024',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
      excerpt: 'Inauguramos nuestra plataforma de biblioteca digital con más de 5,000 títulos disponibles para toda la comunidad educativa.',
      category: 'Tecnología'
    },
    {
      title: 'Campaña Solidaria Recauda Fondos para Comunidad Local',
      date: '5 de Noviembre, 2024',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop',
      excerpt: 'La comunidad escolar se unió en una exitosa campaña que beneficiará a familias necesitadas de nuestra zona.',
      category: 'Pastoral'
    }
  ];

  const paymentInfo = [
    { level: 'Inicial', amount: '$120.000', dueDate: '10 de cada mes' },
    { level: 'Primario', amount: '$150.000', dueDate: '10 de cada mes' },
    { level: 'Secundario', amount: '$180.000', dueDate: '10 de cada mes' }
  ];

  const positions = [
    { value: '', label: 'Selecciona una posición' },
    { value: 'inicial', label: 'Docente - Nivel Inicial' },
    { value: 'primario', label: 'Docente - Nivel Primario' },
    { value: 'secundario', label: 'Docente - Nivel Secundario' },
    { value: 'administrativo', label: 'Personal Administrativo' },
    { value: 'otros', label: 'Otros' }
  ];

  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 relative">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Colegio Católico Cristo Rey</h1>
                <p className="text-xs md:text-sm text-gray-600">Dejando Huellas de Bien</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-2">
              {sections.slice(0, 6).map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleScroll(section.id)}
                  aria-label={`Navegar a ${section.label}`}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === section.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="text-sm">{section.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menú de navegación"
              aria-expanded={isMenuOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleScroll(section.id)}
                    className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeSection === section.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section 
          id="home" 
          ref={el => sectionRefs.current['home'] = el}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-20"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mb-8"
                >
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">Bienvenidos al Colegio Católico Cristo Rey</h2>
                  <p className="text-lg md:text-xl mb-6">Donde la fe, el conocimiento y los valores se unen para formar hombres y mujeres de carácter.</p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => handleScroll('levels')}
                      className="px-6 py-3 bg-white text-blue-800 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                      Conoce Nuestros Niveles
                    </button>
                    <button 
                      onClick={() => handleScroll('contact')}
                      className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-800 transition-all duration-300 hover:shadow-lg"
                    >
                      Agenda una Visita
                    </button>
                  </div>
                </motion.div>
              </div>
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="w-full h-64 md:h-80 bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop" 
                      alt="Estudiantes del Colegio Cristo Rey" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-xl">
                    <Church className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Levels Section */}
        <section 
          id="levels" 
          ref={el => sectionRefs.current['levels'] = el}
          className="py-16 md:py-20 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Nuestros Niveles Educativos</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Ofrecemos una educación integral desde la primera infancia hasta la preparación para la vida adulta, basada en valores cristianos y excelencia académica.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {levels.map((level, index) => (
                <motion.div
                  key={level.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={level.image} 
                      alt={`Nivel ${level.title}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{level.title}</h3>
                    <p className="text-gray-600 mb-6">{level.description}</p>
                    <div className="space-y-2">
                      {level.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pastoral Section */}
        <section 
          id="pastoral" 
          ref={el => sectionRefs.current['pastoral'] = el}
          className="py-16 md:py-20 bg-blue-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Área de Pastoral</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Vivimos nuestra fe en comunidad, cultivando valores cristianos que guían nuestro crecimiento personal y social.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {pastoralActivities.map((activity, index) => (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{activity.title}</h3>
                  <p className="text-gray-600">{activity.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => handleScroll('contact')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Contáctanos para más información
              </button>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section 
          id="achievements" 
          ref={el => sectionRefs.current['achievements'] = el}
          className="py-16 md:py-20 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Nuestros Logros y Reconocimientos</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Orgullosos de nuestra trayectoria de excelencia académica y compromiso con la comunidad.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 ${colorMap[achievement.color]} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                    <achievement.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{achievement.title}</h3>
                  <p className="text-gray-600 text-center text-sm">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Staff Section */}
        <section 
          id="staff" 
          ref={el => sectionRefs.current['staff'] = el}
          className="py-16 md:py-20 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Nuestro Equipo Directivo</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Líderes comprometidos con la excelencia educativa y el desarrollo integral de cada estudiante.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {staffMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section 
          id="calendar" 
          ref={el => sectionRefs.current['calendar'] = el}
          className="py-16 md:py-20 bg-blue-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Calendario Escolar 2025</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Mantente informado sobre las fechas importantes del año escolar.</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {calendarEvents.map((event, index) => (
                  <motion.div
                    key={event.month}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1">{event.month}</h4>
                        <p className="text-sm text-gray-600 mb-1">{event.event}</p>
                        <p className="text-xs text-blue-600 font-medium">{event.date}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section 
          id="news" 
          ref={el => sectionRefs.current['news'] = el}
          className="py-16 md:py-20 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Noticias y Eventos</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Entérate de las últimas actividades y logros de nuestra comunidad educativa.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {newsItems.map((news, index) => (
                <motion.article
                  key={news.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        {news.category}
                      </span>
                      <span className="text-xs text-gray-500">{news.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{news.title}</h3>
                    <p className="text-gray-600 text-sm">{news.excerpt}</p>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
                Ver Todas las Noticias
              </button>
            </div>
          </div>
        </section>

        {/* Administration Section */}
        <section 
          id="administration" 
          ref={el => sectionRefs.current['administration'] = el}
          className="py-16 md:py-20 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Administración</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Información importante sobre pagos, horarios y procedimientos administrativos para padres y apoderados.</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Cuotas Mensuales</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {paymentInfo.map((info, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{info.level}</span>
                        <span className="text-blue-600 font-bold text-lg">{info.amount}</span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Clock className="inline mr-2 w-4 h-4" />
                        Vence el {info.dueDate}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Importante:</strong> Los pagos realizados después de la fecha de vencimiento tendrán un recargo del 5%.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Horarios de Atención</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <span className="font-medium text-gray-800">Lunes a Viernes</span>
                    <span className="text-blue-600 font-semibold">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <span className="font-medium text-gray-800">Sábados</span>
                    <span className="text-blue-600 font-semibold">9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <span className="font-medium text-gray-800">Domingos</span>
                    <span className="text-gray-500 font-semibold">Cerrado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Careers Section */}
        <section 
          id="careers" 
          ref={el => sectionRefs.current['careers'] = el}
          className="py-16 md:py-20 bg-blue-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Trabaja con Nosotros</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Únete a nuestro equipo de profesionales comprometidos con la educación y los valores cristianos.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      aria-invalid={!!formErrors.name}
                      aria-describedby={formErrors.name ? "name-error" : undefined}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Juan Pérez"
                    />
                    {formErrors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      aria-invalid={!!formErrors.email}
                      aria-describedby={formErrors.email ? "email-error" : undefined}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="juan@example.com"
                    />
                    {formErrors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      aria-invalid={!!formErrors.phone}
                      aria-describedby={formErrors.phone ? "phone-error" : undefined}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+56 9 1234 5678"
                    />
                    {formErrors.phone && (
                      <p id="phone-error" className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                      Posición de Interés *
                    </label>
                    <select
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      aria-invalid={!!formErrors.position}
                      aria-describedby={formErrors.position ? "position-error" : undefined}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        formErrors.position ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {positions.map((pos) => (
                        <option key={pos.value} value={pos.value}>
                          {pos.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.position && (
                      <p id="position-error" className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.position}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Experiencia Previa
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={4}
                    aria-describedby="experience-help"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Describe tu experiencia laboral relevante..."
                  />
                  <p id="experience-help" className="mt-1 text-xs text-gray-500">
                    Incluye años de experiencia, instituciones donde has trabajado, y logros relevantes.
                  </p>
                </div>

                <div>
                  <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-2">
                    Curriculum Vitae (CV) *
                  </label>
                  <div className="relative">
                    <input
                      id="cv"
                      type="file"
                      name="cv"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                      aria-required="true"
                      aria-invalid={!!formErrors.cv}
                      aria-describedby={formErrors.cv ? "cv-error" : "cv-help"}
                      className="hidden"
                    />
                    <label
                      htmlFor="cv"
                      className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                        formErrors.cv 
                          ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                          : cvFileName 
                            ? 'border-green-500 bg-green-50 hover:bg-green-100'
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {cvFileName ? (
                          <>
                            <Paperclip className="w-5 h-5 text-green-600" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-700">{cvFileName}</p>
                              <p className="text-xs text-gray-500">Haz clic para cambiar el archivo</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-gray-400" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-700">Adjunta tu CV</p>
                              <p className="text-xs text-gray-500">PDF, DOC o DOCX (máx. 5MB)</p>
                            </div>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                  {formErrors.cv && (
                    <p id="cv-error" className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.cv}
                    </p>
                  )}
                  {!formErrors.cv && (
                    <p id="cv-help" className="mt-1 text-xs text-gray-500">
                      Formatos aceptados: PDF, DOC, DOCX. Tamaño máximo: 5MB
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje Adicional
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Cuéntanos por qué quieres trabajar con nosotros y qué puedes aportar..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 ${
                      formLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    {formLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Enviar Solicitud</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <AnimatePresence>
                {formSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg flex items-start space-x-3"
                    role="alert"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">¡Solicitud enviada exitosamente!</p>
                      <p className="text-sm mt-1">Gracias por tu interés. Revisaremos tu solicitud y nos pondremos en contacto contigo pronto.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          id="contact" 
          ref={el => sectionRefs.current['contact'] = el}
          className="py-16 md:py-20 bg-gray-800 text-white"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Contáctanos</h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">Estamos aquí para ayudarte. No dudes en ponerte en contacto con nosotros para cualquier consulta o información adicional.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-colors duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Ubicación</h3>
                </div>
                <p className="text-gray-300 mb-4">Av. Bolivia Nro 929 - Ciudad Perico - Jujuy</p>
                <p className="text-gray-300">Código Postal: 4608</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-colors duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Teléfono</h3>
                </div>
                <p className="text-gray-300 mb-2">
                  <a href="tel:+56212345678" className="hover:text-blue-400 transition-colors">
                    388 4912303
                  </a>
                </p>
                
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-colors duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Email</h3>
                </div>
                <p className="text-gray-300 mb-2">
                  <a href="mailto:info@colegiocristorey.edu.ar" className="hover:text-blue-400 transition-colors">
                    administracion@colecatcristorey.edu.ar
                  </a>
                </p>
                
              </motion.div>
            </div>

            <div className="bg-gray-700 rounded-xl overflow-hidden">
              <div className="h-80 bg-gray-600 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-300 text-lg">Mapa del Colegio Cristo Rey</p>
                  <p className="text-sm text-gray-400 mt-2">Ubicado en el corazón de Santiago</p>
                  <p className="text-xs text-gray-500 mt-4">En una implementación real, aquí iría un mapa interactivo</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Cristo Rey</h3>
              </div>
              <p className="text-gray-400 mb-4">Educación con valores cristianos desde 1985</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.991 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Niveles Educativos</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleScroll('levels')} className="text-gray-400 hover:text-white transition-colors">
                    Inicial
                  </button>
                </li>
                <li>
                  <button onClick={() => handleScroll('levels')} className="text-gray-400 hover:text-white transition-colors">
                    Primario
                  </button>
                </li>
                <li>
                  <button onClick={() => handleScroll('levels')} className="text-gray-400 hover:text-white transition-colors">
                    Secundario
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Información</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleScroll('administration')} className="text-gray-400 hover:text-white transition-colors">
                    Horarios
                  </button>
                </li>
                <li>
                  <button onClick={() => handleScroll('administration')} className="text-gray-400 hover:text-white transition-colors">
                    Cuotas
                  </button>
                </li>
                <li>
                  <button onClick={() => handleScroll('contact')} className="text-gray-400 hover:text-white transition-colors">
                    Admisiones
                  </button>
                </li>
                <li>
                  <button onClick={() => handleScroll('calendar')} className="text-gray-400 hover:text-white transition-colors">
                    Calendario
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start space-x-2">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Av. Principal #123, Santiago, Chile</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                  <a href="tel:+56212345678" className="hover:text-white transition-colors">
                    +56 2 1234 5678
                  </a>
                </li>
                <li className="flex items-start space-x-2">
                  <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                  <a href="mailto:info@colegiocristorey.cl" className="hover:text-white transition-colors">
                    info@colegiocristorey.cl
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Colegio Católico Cristo Rey. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default App;