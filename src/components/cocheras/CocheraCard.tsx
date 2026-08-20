import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Video, KeyRound, Lock, Car, ArrowRight, Sparkles } from 'lucide-react';
import { Cochera } from '../../types/cochera';

interface CocheraCardProps {
  cochera: Cochera;
  priority?: boolean;
}

export const CocheraCard: React.FC<CocheraCardProps> = ({ cochera, priority = false }) => {

  const getFeatureIcon = (feature: string) => {
    const lower = feature.toLowerCase();
    if (lower.includes('seguridad') || lower.includes('vigilancia')) return <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />;
    if (lower.includes('cámara') || lower.includes('cctv')) return <Video className="w-3.5 h-3.5 text-brand-600" />;
    if (lower.includes('portón') || lower.includes('remoto')) return <KeyRound className="w-3.5 h-3.5 text-brand-600" />;
    if (lower.includes('cubierta')) return <Lock className="w-3.5 h-3.5 text-brand-600" />;
    return <Car className="w-3.5 h-3.5 text-brand-600" />;
  };

  const imageSrc = cochera.imagenDestacada || (cochera.imagenes && cochera.imagenes[0]?.url);

  const precioTexto =
    cochera.consultarPrecio || !cochera.precio || cochera.precio === 0
      ? 'Consultar Precio'
      : cochera.moneda === 'USD'
        ? `U$S ${cochera.precio.toLocaleString('es-AR')}`
        : `$ ${cochera.precio.toLocaleString('es-AR')}`;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-500/30 transition-all duration-300 flex flex-col justify-between border border-slate-200/80 relative hover:-translate-y-1">
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={cochera.titulo}
            loading={priority ? 'eager' : 'lazy'}
            {...(priority ? { fetchpriority: 'high' } : {})}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-slate-400 space-y-2 bg-slate-900 w-full h-full">
            <Car className="w-10 h-10 text-slate-600" />
            <span className="text-xs font-medium text-slate-400">Sin foto disponible</span>
          </div>
        )}

        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {cochera.destacada && (
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              <span>DESTACADA</span>
            </span>
          )}

          {cochera.statusProperty && (
            <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
              {cochera.statusProperty}
            </span>
          )}
        </div>

        {/* Bottom Left Zone Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
            <MapPin className="w-3 h-3 text-brand-400" />
            <span>{cochera.zona}</span>
          </span>
        </div>

      </div>

      {/* Clean Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-1.5">
          {/* Title */}
          <Link to={`/cocheras/${cochera.slug}`}>
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-brand-600 transition-colors leading-snug line-clamp-2 tracking-tight">
              {cochera.titulo}
            </h3>
          </Link>

          {/* Location Address & Ref Code */}
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium pt-0.5">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span className="truncate">{cochera.direccion || `${cochera.zona}, CABA`}</span>
            </div>
            {cochera.codigoRef && (
              <span className="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">
                Ref #{cochera.codigoRef}
              </span>
            )}
          </div>
        </div>

        {/* Tipo de publicación + características reales */}
        {(cochera.tipoPropiedad.length > 0 || cochera.features.length > 0) && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
            {cochera.tipoPropiedad.slice(0, 1).map((t, idx) => (
              <span
                key={`t-${idx}`}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-50 text-brand-700 text-[11px] font-bold border border-brand-200/70"
              >
                <Car className="w-3.5 h-3.5 text-brand-600" />
                <span>{t}</span>
              </span>
            ))}
            {cochera.features.slice(0, 2).map((feature, idx) => (
              <span
                key={`f-${idx}`}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-50 text-slate-700 text-[11px] font-semibold border border-slate-200/70"
              >
                {getFeatureIcon(feature)}
                <span>{feature}</span>
              </span>
            ))}
          </div>
        )}

        {/* Valor publicado — la tarjeta no decía nada del precio y quedaba coja */}
        <div className="flex items-end justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="min-w-0">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Valor publicado
            </span>
            <span className="block text-lg font-extrabold text-brand-600 tracking-tight truncate">
              {precioTexto}
            </span>
          </div>
          {cochera.disponible && (
            <span className="flex-shrink-0 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Disponible
            </span>
          )}
        </div>

        {/* Single Clean Action CTA Button */}
        <Link
          to={`/cocheras/${cochera.slug}`}
          className="btn btn-dark btn-block rounded-2xl"
        >
          <span>Ver Cochera</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>

    </div>
  );
};
