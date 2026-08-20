import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowRight, Search, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-paper-50 min-h-[70vh] flex items-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center mx-auto text-brand-600">
          <Car className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            No encontramos esta página
          </h1>
          <p className="text-sm text-muted-light leading-relaxed max-w-md mx-auto">
            Puede que la publicación ya no esté disponible o que el enlace haya cambiado.
            Probá buscando en el catálogo completo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/cocheras"
            className="btn btn-primary w-full sm:w-auto"
          >
            <Search className="w-4 h-4" />
            <span>Ver todas las cocheras</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="btn btn-outline w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
