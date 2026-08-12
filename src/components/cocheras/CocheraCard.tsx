import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, ShieldCheck, Video, KeyRound, Lock, Car, ArrowRight, Sparkles } from 'lucide-react';
import { Cochera } from '../../types/cochera';

interface CocheraCardProps {
  cochera: Cochera;
  priority?: boolean;
}

export const CocheraCard: React.FC<CocheraCardProps> = ({ cochera, priority = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getFeatureIcon = (feature: string) => {
    const lower = feature.toLowerCase();
    if (lower.includes('seguridad') || lower.includes('vigilancia')) return <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />;
    if (lower.includes('cámara') || lower.includes('cctv')) return <Video className="w-3.5 h-3.5 text-brand-600" />;
    if (lower.includes('portón') || lower.includes('remoto')) return <KeyRound className="w-3.5 h-3.5 text-brand-600" />;
    if (lower.includes('cubierta')) return <Lock className="w-3.5 h-3.5 text-brand-600" />;
    return <Car className="w-3.5 h-3.5 text-brand-600" />;
  };

  const imageSrc = cochera.imagenDestacada || (cochera.imagenes && cochera.imagenes[0]?.url);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-500/30 transition-all duration-300 flex flex-col justify-between border border-slate-200/80 relative hover:-translate-y-1">
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={cochera.titulo}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
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

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          aria-label="Guardar a favoritos"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center text-white hover:text-red-400 hover:bg-slate-900 transition-all border border-white/20 z-10 cursor-pointer"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
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

        {/* Feature Chips if present */}
        {cochera.features && cochera.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
            {cochera.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-50 text-slate-700 text-[11px] font-semibold border border-slate-200/70"
              >
                {getFeatureIcon(feature)}
                <span>{feature}</span>
              </span>
            ))}
          </div>
        )}

        {/* Single Clean Action CTA Button */}
        <Link
          to={`/cocheras/${cochera.slug}`}
          className="w-full py-3 px-4 bg-slate-900 group-hover:bg-brand-600 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md group-hover:shadow-brand-600/30 cursor-pointer"
        >
          <span>Ver Cochera</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>

    </div>
  );
};
