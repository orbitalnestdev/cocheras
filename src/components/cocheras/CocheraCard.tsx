import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, ShieldCheck, Video, KeyRound, Lock, Car, ExternalLink, ImageOff } from 'lucide-react';
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
    <div className="bg-white rounded-card overflow-hidden shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col group border border-slate-200/80 hover:-translate-y-1">
      
      {/* Image Container with ratio 4:3 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={cochera.titulo}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-slate-400 space-y-2 bg-slate-100 w-full h-full">
            <Car className="w-10 h-10 text-slate-300" />
            <span className="text-xs font-semibold text-slate-500">Sin foto disponible</span>
          </div>
        )}

        {/* Badge DESTACADA */}
        {cochera.destacada && (
          <span className="absolute top-3 left-3 bg-brand-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            DESTACADA
          </span>
        )}

        {/* Status Badge (En Alquiler / En Venta / Pozo) */}
        {cochera.statusProperty && (
          <span className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md">
            {cochera.statusProperty}
          </span>
        )}

        {/* Heart Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          aria-label="Guardar a favoritos"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 hover:bg-white transition-all shadow-sm"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Card Body - Spacious and Legible Layout */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Title */}
          <Link to={`/cocheras/${cochera.slug}`}>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-brand-600 transition-colors leading-snug line-clamp-2">
              {cochera.titulo}
            </h3>
          </Link>

          {/* Location Address */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span className="truncate">{cochera.direccion || `${cochera.zona}, CABA`}</span>
          </div>

          {/* Price Block */}
          <div className="pt-2 flex items-baseline gap-1.5">
            {cochera.consultarPrecio || cochera.precio === undefined || cochera.precio === 0 ? (
              <span className="text-lg sm:text-xl font-extrabold text-brand-600 tracking-tight">
                Consultar Precio
              </span>
            ) : (
              <>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {cochera.moneda === 'USD' ? `U$S ${cochera.precio.toLocaleString('es-AR')}` : `$ ${cochera.precio.toLocaleString('es-AR')}`}
                </span>
                <span className="text-xs font-semibold text-slate-500">/{cochera.periodo}</span>
              </>
            )}
          </div>
        </div>

        {/* Feature Chips if present */}
        {cochera.features && cochera.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
            {cochera.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200/80 shadow-2xs"
              >
                {getFeatureIcon(feature)}
                <span>{feature}</span>
              </span>
            ))}
          </div>
        )}

        {/* Direct Link Action */}
        <Link
          to={`/cocheras/${cochera.slug}`}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <span>Ver Detalles y Consultar</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

      </div>

    </div>
  );
};
