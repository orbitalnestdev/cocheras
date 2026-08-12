import React from 'react';
import { Search, Calendar, Car, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComoFuncionaPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-paper-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block">
            GUÍA PASO A PASO
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ¿Cómo funciona Cocheras?
          </h1>
          <p className="text-muted-light text-sm max-w-lg mx-auto">
            Te acompañamos en todo el proceso para que alquilar una cochera sea tan simple como tocar un botón.
          </p>
        </div>

        {/* 3 Main Steps Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-card border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-xl font-black">
              1
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Buscá tu Zona</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ingresá la ubicación de tu interés (Recoleta, Palermo, Belgrano, etc.) y compará opciones por tipo y precio.
            </p>
          </div>

          <div className="bg-white p-8 rounded-card border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-xl font-black">
              2
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Coordiná y Reservá</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Contactá directamente con el propietario o administrador vía WhatsApp o mensaje para solicitar la reserva.
            </p>
          </div>

          <div className="bg-white p-8 rounded-card border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-xl font-black">
              3
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Estacioná Seguro</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recibí el control de acceso o tarjeta magnética y disfrutá de tu lugar reservado las 24 horas.
            </p>
          </div>

        </div>

        {/* FAQ section */}
        <div className="bg-white p-8 sm:p-10 rounded-card border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 border-b pb-4 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-brand-600" />
            Preguntas Frecuentes
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <h4 className="font-bold text-sm text-slate-900">¿Cobran comisión al inquilino?</h4>
              <p className="text-xs text-slate-600">No, el servicio de búsqueda y contacto para inquilinos es 100% gratuito sin comisiones ocultas.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <h4 className="font-bold text-sm text-slate-900">¿Qué tipo de cocheras ofrecen?</h4>
              <p className="text-xs text-slate-600">Ofrecemos cocheras fijas, móviles, cubiertas en subsuelo y descubiertas con portón automático o vigilancia 24hs.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <h4 className="font-bold text-sm text-slate-900">¿Cómo se sincronizan las propiedades?</h4>
              <p className="text-xs text-slate-600">Todas las propiedades son administradas desde el WordPress oficial y se actualizan automáticamente en el sitio.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/cocheras"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 text-white font-bold text-sm rounded-xl hover:bg-brand-700 transition-all shadow-md"
          >
            <span>Explorar Cocheras Disponibles</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
