import { useState, useEffect } from 'react';
import { Coins, CheckCircle, Clock, CreditCard, AlertCircle, Calendar } from 'lucide-react';

// URL del Script (Misma que en AdminDashboard)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby6a9pr6g54of3nZ343bqxc6Xx3IdbWP21NUop4q6tmJJfWYmEOppw1uhfD-wVOVoLt2g/exec"; // Reemplazar con URL real del usuario

const Fees = () => {
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        // Intentar leer de cache primero si existe (compartido con Admin)
        const cached = localStorage.getItem('admin_fees');
        if (cached) {
          setFees(JSON.parse(cached));
          setLoading(false);
        }

        const res = await fetch("https://script.google.com/macros/s/AKfycbz_d_2v3K4Z5J6H7L8M9N0O1P2Q3R4S5T6U7V8W9X0Y1Z2/exec", { // URL GENÉRICA, DEBERÍA SER LA DE ENV
          method: 'POST',
          body: JSON.stringify({ action: 'getFees' })
        });
        const data = await res.json();
        if (data.status === 'success') {
          setFees(data.fees);
          // Actualizar cache, pero cuidado con colisiones si Admin usa otra key. 
          // Usaremos una key específica para publico para no romper nada.
          localStorage.setItem('public_fees', JSON.stringify(data.fees));
        }
      } catch (error) {
        console.error("Error fetching fees:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  // VALORES POR DEFECTO (Fallback si falla carga)
  const displayFees = fees || {
    Inicial: 38500,
    Primario: 33000,
    Secundario: 33000,
    Matricula: 40000,
    Matricula_Tardia: 45000
  };

  const levels = [
    { name: 'Nivel Inicial', price: displayFees.Inicial, features: ['Jornada Simple', 'Materiales Incluidos', 'Seguro Escolar'], sinVacantes: true },
    { name: 'Nivel Primario', price: displayFees.Primario, features: ['Jornada Extendida (Opcional)', 'Plataforma Digital', 'Talleres Extraprogramáticos'], sinVacantes: false },
    { name: 'Nivel Secundario', price: displayFees.Secundario, features: ['Orientación Universitaria', 'Laboratorios', 'Certificaciones IT'], sinVacantes: false }
  ];

  const formatPrice = (amount) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);

  return (
    <section id="fees" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-10">
          <span className="text-cristo-accent font-bold tracking-widest text-xs uppercase">Administración</span>
          <h2 className="font-serif text-3xl md:text-4xl text-cristo-primary mt-2">Aranceles 2026</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto text-lg">Valores vigentes para el Ciclo Lectivo 2026. Sujetos a actualización en Junio y Septiembre.</p>
        </div>

        {/* 1. SECCIÓN MATRÍCULA */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-cristo-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">INSCRIPCIONES ABIERTAS</div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-xl font-bold text-cristo-primary flex items-center gap-2">
                <Coins className="w-5 h-5 text-cristo-accent" /> Matrícula 2026
              </h3>
              <p className="text-gray-500 text-sm mt-1">Reserva de vacante anual</p>
            </div>

            <div className="flex flex-row gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {/* Anticipada */}
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex-1 min-w-[160px] text-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Pago Anticipado</span>
                <div className="text-2xl font-serif font-bold text-cristo-primary">{formatPrice(displayFees.Matricula)}</div>
                <span className="text-xs text-gray-500 font-medium bg-white px-2 py-0.5 rounded-full border border-gray-100 mt-1 inline-block">
                  Hasta 14 de Febrero
                </span>
              </div>

              {/* Tardía */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex-1 min-w-[160px] text-center opacity-75">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Pago Tardío</span>
                <div className="text-2xl font-serif font-bold text-gray-400">{formatPrice(displayFees.Matricula_Tardia || 45000)}</div>
                <span className="text-xs text-gray-400 font-medium mt-1 inline-block">
                  Después del 14/02
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CUOTAS MENSUALES */}
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-10">
          {levels.map((level, idx) => (
            <div key={idx} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 p-5 relative group overflow-hidden ${level.sinVacantes ? 'border-gray-300' : 'border-cristo-primary'}`}>

              {level.sinVacantes && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                  <div className="bg-red-100 text-red-600 font-bold text-sm uppercase tracking-widest px-6 py-2 rounded-lg border-2 border-red-200 shadow-sm transform -rotate-12">
                    Sin Vacantes
                  </div>
                </div>
              )}

              <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-100 transition-opacity">
                <div className={`bg-cristo-accent w-1.5 h-1.5 rounded-full ${level.sinVacantes ? 'hidden' : ''}`}></div>
              </div>
              <h3 className={`font-serif text-lg mb-3 ${level.sinVacantes ? 'text-gray-400' : 'text-cristo-primary'}`}>{level.name}</h3>
              <div className="mb-4">
                <span className={`text-3xl font-bold ${level.sinVacantes ? 'text-gray-300' : 'text-gray-800'}`}>{formatPrice(level.price)}</span>
                <span className="text-xs uppercase tracking-wide text-gray-400 block mt-1">Mensual (Mar-Dic)</span>
              </div>
              <ul className="space-y-2 mb-2">
                {level.features.map((feat, i) => (
                  <li key={i} className={`flex items-start text-sm ${level.sinVacantes ? 'text-gray-300' : 'text-gray-600'}`}>
                    <CheckCircle className={`w-3.5 h-3.5 mr-2 flex-shrink-0 mt-0.5 ${level.sinVacantes ? 'text-gray-300' : 'text-green-500'}`} />
                    <span className="leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 3. INFO FINANCIERA (VENCIMIENTOS Y RECARGOS) */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">

          {/* VENCIMIENTOS */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 flex gap-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg h-fit"><Clock className="w-5 h-5" /></div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 mb-2 text-sm">Vencimientos y Recargos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>Vencimiento cuota mensual: <strong>Día 20 de cada mes</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>Mora automática: <strong>10% mensual</strong> sobre el valor vigente.</span>
                </li>
                <li className="text-xs text-gray-400 mt-1 italic leading-tight">Las cuotas atrasadas se abonan al valor actualizado al momento del pago.</li>
              </ul>
            </div>
          </div>

          {/* MEDIOS DE PAGO Y BENEFICIOS */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 flex gap-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg h-fit"><CreditCard className="w-5 h-5" /></div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 mb-2 text-sm">Beneficios y Medios de Pago</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0"></span>
                  <span className="leading-tight">
                    <strong>Pago Anticipado Anual:</strong> Abonando las 10 cuotas en Marzo, se congelan al valor inicial.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0"></span>
                  <span className="leading-tight">Transferencia bancaria o efectivo en administración.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Fees;