import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, ShieldCheck, Video, KeyRound, Lock, Car, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
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
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-brand-500/40 transition-all duration-500 flex flex-col justify-between border border-slate-200/90 relative hover:-translate-y-1.5">
      
      {/* Top Accent Gradient Bar on Hover */}
      <div className="h-1.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-500 absolute top-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      {/* Image Container with aspect 16:10 */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={cochera.titulo}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-slate-400 space-y-2 bg-slate-900 w-full h-full">
            <Car className="w-10 h-10 text-slate-600" />
            <span className="text-xs font-semibold text-slate-400">Sin foto disponible</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-500" />

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {cochera.destacada && (
            <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border border-amber-300/40">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              <span>DESTACADA</span>
            </span>
          )}

          {cochera.statusProperty && (
            <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20 shadow-md">
              {cochera.statusProperty}
            </span>
          )}

          {cochera.videoUrl && (
            <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-indigo-400/30 shadow-md flex items-center gap-1">
              <Video className="w-3 h-3" />
              <span>VIDEO</span>
            </span>
          )}
        </div>

        {/* Bottom Left Zone Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full border border-white/20 shadow-md flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-brand-400" />
            <span>{cochera.zona}</span>
          </span>
        </div>

        {/* Favorite Heart Action */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          aria-label="Guardar a favoritos"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/70 backdrop-blur-md flex items-center justify-center text-white hover:text-red-400 hover:bg-slate-900 transition-all border border-white/20 z-10 shadow-sm cursor-pointer"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Title */}
          <Link to={`/cocheras/${cochera.slug}`}>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-brand-600 transition-colors leading-snug line-clamp-2 tracking-tight">
              {cochera.titulo}
            </h3>
          </Link>

          {/* Location Address */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span className="truncate">{cochera.direccion || `${cochera.zona}, CABA`}</span>
          </div>

          {/* Consultar Precio Badge */}
          <div className="pt-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-black text-xs shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Consultar Precio</span>
            </span>
            {cochera.codigoRef && (
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Ref #{cochera.codigoRef}
              </span>
            )}
          </div>
        </div>

        {/* Feature Chips */}
        {cochera.features && cochera.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
            {cochera.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs"
              >
                {getFeatureIcon(feature)}
                <span>{feature}</span>
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/cocheras/${cochera.slug}`}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-slate-900 via-ink-950 to-slate-900 group-hover:from-brand-600 group-hover:via-brand-500 group-hover:to-indigo-600 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md group-hover:shadow-brand-600/30 cursor-pointer"
        >
          <span>Ver Ficha y Consultar</span>
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>

      </div>

    </div>
  );
};
