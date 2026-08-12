import React from 'react';
import { ShieldCheck, MapPin, Clock, CreditCard, Award, Zap, Heart, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BeneficiosPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-paper-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block">
            PROPUESTA DE VALOR
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Beneficios Exclusivos de Cocheras
          </h1>
          <p className="text-muted-light text-sm max-w-lg mx-auto">
            Diseñamos la mejor experiencia para que estacionar en Buenos Aires sea cómodo, rápido y 100% seguro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-8 rounded-card border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Seguridad Garantizada</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seleccionamos propiedades en garajes con monitoreo CCTV 24hs, control de accesos automatizado y vigilancia presencial.
            </p>
          </div>

          <div className="bg-white p-8 rounded-card border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Ubicaciones Estratégicas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cocheras situadas a metros de subtes, avenidas principales y nodos gastronómicos y de oficinas claves de la ciudad.
            </p>
          </div>

          <div className="bg-white p-8 rounded-card border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Acceso 24/7</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ingresá y salí cuando quieras con tu propio control remoto o tarjeta magnética individual sin depender de terceros.
            </p>
          </div>

          <div className="bg-white p-8 rounded-card border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Transparencia y Cero Comisiones</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Precios claros con expensas e impuestos incluidos desde el primer día. Sin sorpresas ni gastos extras.
            </p>
          </div>

        </div>

        <div className="bg-gradient-brand p-8 sm:p-10 rounded-banner text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold mb-1">¿Querés alquilar tu cochera?</h3>
            <p className="text-xs text-white/90">Publicá gratis y empezá a generar ingresos recurrentes todos los meses.</p>
          </div>
          <Link
            to="/publicar"
            className="px-6 py-3 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all flex-shrink-0"
          >
            Publicar mi Cochera
          </Link>
        </div>

      </div>
    </div>
  );
};
