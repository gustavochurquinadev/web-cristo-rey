import { Coins, CheckCircle, Clock, CreditCard } from 'lucide-react';

const Fees = () => {
  const fees = [
    { level: 'Nivel Inicial', amount: '$35.000', matricula: '$50.000', features: ['Materiales incluidos', 'Seguro escolar', 'Merienda'] },
    { level: 'Nivel Primario', amount: '$30.000', matricula: '$50.000', features: ['Talleres extraprogramáticos', 'Plataforma digital', 'Salidas educativas'] },
    { level: 'Nivel Secundario', amount: '$30.000', matricula: '$50.000', features: ['Orientación universitaria', 'Laboratorios', 'Certificaciones'] }
  ];

  const adminSchedules = [
    { day: 'Lunes', hours: '8:00 - 13:00 / 15:00 - 18:00' },
    { day: 'Martes', hours: '8:00 - 13:00' },
    { day: 'Miércoles', hours: '8:00 - 13:00 / 15:00 - 18:00' },
    { day: 'Jueves', hours: '8:00 - 13:00' },
    { day: 'Viernes', hours: '8:00 - 13:00' }
  ];

  return (
    <section id="fees" className="py-24 bg-gray-50 flex items-center">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-cristo-accent font-bold tracking-widest text-xs uppercase">Aranceles</span>
          <h2 className="font-serif text-4xl text-cristo-primary mt-2">Cuotas Ciclo Lectivo 2026</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {fees.map((fee, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg border-t-4 border-cristo-accent p-8 hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl text-cristo-primary mb-2">{fee.level}</h3>
                <div className="text-4xl font-bold text-cristo-accent mb-1">{fee.amount}</div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Cuota Mensual</span>
              </div>
              <div className="border-t border-gray-100 pt-6 mb-6">
                <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-600">Matrícula</span><span className="font-bold text-cristo-primary">{fee.matricula}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Vencimiento</span><span className="text-sm font-medium text-cristo-accent">Día 10</span></div>
              </div>
              <ul className="space-y-3 mb-8">
                {fee.features.map((item, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-500"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100 grid md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-full text-cristo-primary"><Clock className="w-6 h-6" /></div>
            <div className="w-full">
              <h4 className="font-bold text-cristo-primary mb-2">Horario de Atención</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {adminSchedules.map((sch, i) => (
                  <li key={i} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                    <span className="font-medium">{sch.day}:</span><span>{sch.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-full text-cristo-primary"><CreditCard className="w-6 h-6" /></div>
            <div>
              <h4 className="font-bold text-cristo-primary mb-2">Medios de Pago</h4>
              <p className="text-sm text-gray-600">Transferencias bancarias, débito automático y pagos en efectivo en administración. Consultar por descuentos por hermanos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fees;