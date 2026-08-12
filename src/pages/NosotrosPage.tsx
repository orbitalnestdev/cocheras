import React from 'react';
import { ShieldCheck, Award, Users, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NosotrosPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-paper-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block">
            SOBRE NOSOTROS
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Líderes en Gestión e Inversión de Cocheras
          </h1>
          <p className="text-muted-light text-sm max-w-2xl mx-auto leading-relaxed">
            Somos especialistas con años de trayectoria en la comercialización, alquiler y asesoramiento profesional en garages y cocheras en Capital Federal y GBA. (Mat. CUCICBA 6610).
          </p>
        </div>

        {/* Story & Mission split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-white p-8 rounded-card border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">Nuestra Experiencia</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nos enfocamos exclusivamente en el mercado de estacionamientos y cocheras fijas, móviles y en bloque. Brindamos asesoramiento integral tanto a propietarios particulares como a inversores corporativos que buscan rentabilidad segura y constante.
            </p>
          </div>

          <div className="bg-white p-8 rounded-card border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900">Compromiso y Valor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Combinamos transparencia operativa, soporte legal matriculado y tecnología de vanguardia para conectar la oferta de cocheras con miles de usuarios que demandan un lugar seguro para su vehículo todos los días.
            </p>
          </div>
        </div>

        {/* Key Stats Bar */}
        <div className="bg-ink-950 text-white p-8 sm:p-10 rounded-banner shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-400 block">+2.500</span>
            <span className="text-xs text-muted-dark font-medium">Cocheras gestionadas</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-400 block">+15</span>
            <span className="text-xs text-muted-dark font-medium">Años de experiencia</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-400 block">98%</span>
            <span className="text-xs text-muted-dark font-medium">Clientes satisfechos</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-400 block">100%</span>
            <span className="text-xs text-muted-dark font-medium">Operaciones seguras</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pt-4">
          <h3 className="text-xl font-bold text-slate-900">¿Querés asesoramiento o publicar tu inmueble?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/cocheras"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Ver Cocheras Disponibles
            </Link>
            <Link
              to="/contacto"
              className="px-6 py-3 bg-white border border-slate-200 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all"
            >
              Contactar con un Asesor
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
