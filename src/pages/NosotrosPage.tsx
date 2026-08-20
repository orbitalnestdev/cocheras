import React from 'react';
import { ShieldCheck, Award, Building2, TrendingUp, Calendar, ArrowRight, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NosotrosPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-paper-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-4 py-1.5 rounded-full border border-brand-200/80 inline-block">
            QUIÉNES SOMOS — ECOCHERAS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Especialistas en Cocheras y Estacionamientos
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            Ecocheras es una empresa especializada en el mercado de cocheras y estacionamientos. Actualmente es la <strong className="font-extrabold text-slate-900">única inmobiliaria</strong> que ofrece cocheras comerciales, emprendimientos desde el pozo, estacionamientos completos y el mayor surtido de cocheras particulares en la Ciudad de Buenos Aires.
          </p>
        </div>

        {/* Feature Banner: Impulsores del Crecimiento */}
        <div className="bg-gradient-to-br from-slate-900 via-ink-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Impulsores del Desarrollo Urbano en CABA
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Ecocheras es uno de los principales impulsores de la creación de nuevos estacionamientos en la Ciudad de Buenos Aires. Unimos a desarrolladores, dueños de terrenos, empresas constructoras y socios capitalistas para generar nuevos emprendimientos mejorando la necesidad creciente de estacionamiento que hay en la ciudad.
              </p>
            </div>
            <div className="lg:col-span-4 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4 text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Respaldo Profesional</span>
                <h4 className="text-base font-extrabold text-white">Esteban Sucari</h4>
                <p className="text-xs text-slate-300">Mat. CUCICBA 6610 / CMPCSI 6068</p>
              </div>
            </div>
          </div>
        </div>

        {/* Story & History Section */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 block">
              TRAYECTORIA Y EVOLUCIÓN
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Nuestra Historia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Timeline Item 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-shadow relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-black text-sm flex items-center justify-center border border-brand-200">
                  2003
                </div>
                <h3 className="font-extrabold text-xl text-slate-900">El Origen</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Ecocheras nace en el 2003 en un contexto de crisis / oportunidad como una inmobiliaria clásica en la Ciudad de Buenos Aires.
              </p>
            </div>

            {/* Timeline Item 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-shadow relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-black text-sm flex items-center justify-center border border-brand-200">
                  2008
                </div>
                <h3 className="font-extrabold text-xl text-slate-900">Especialización en Nicho</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                A partir del año 2008, con la crisis mundial y la caída de Lehman Brothers entendimos que había que encontrar un nicho que garantice a nuestros inversores estabilidad de valores y buena renta.
              </p>
            </div>

            {/* Timeline Item 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-shadow relative md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-black text-sm flex items-center justify-center border border-emerald-200">
                  ECO
                </div>
                <h3 className="font-extrabold text-xl text-slate-900">Estudio Detallado y Nacimiento de ECOCHERAS</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Al ver que los garajes se demolían para construir oficinas y departamentos y que el sector automotriz vislumbraba un crecimiento en su producción, decidimos comenzar a estudiar el mercado de las cocheras con absoluto detalle para especializarnos en el mismo. Es en ese contexto donde nace <strong className="font-extrabold text-slate-900">ECOCHERAS</strong>, especialistas en cocheras y estacionamientos.
              </p>
            </div>

          </div>
        </div>

        {/* Protection & Investment Value Section */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 block">INSTRUMENTO DE RESGUARDO</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Protección Patrimonial y Refugio de Valor</h3>
            </div>
          </div>
          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-6">
            <p>
              Entendimos que el contexto de alta inestabilidad que cíclicamente se vive en la Argentina contribuye a generar en el universo de inversores privados una sensación de que sólo unos pocos instrumentos de inversión pueden protegerlo contra el riesgo devaluatorio y al mismo tiempo generar un flujo que mínimamente lo cubra de la inflación.
            </p>
            <p className="font-extrabold text-slate-900 text-base sm:text-lg bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              Hace años venimos posicionando a las cocheras como un instrumento para proteger los ahorros de inversores medianos y chicos.
            </p>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-xl">
          <h3 className="text-2xl font-extrabold text-white">¿Querés invertir o recibir asesoramiento personalizado?</h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
            Contactate directamente con nuestro equipo técnico matriculado para conocer todas las oportunidades disponibles en Buenos Aires.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="https://wa.me/5491136920920?text=Hola!%20Me%20gustar%C3%ADa%20recibir%20asesoramiento%20sobre%20cocheras%20e%20inversiones."
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consultar por WhatsApp</span>
            </a>
            <Link
              to="/cocheras"
              className="btn btn-primary"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
