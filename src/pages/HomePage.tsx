import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  Zap,
  ShieldCheck,
  CreditCard,
  Car,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Phone,
  MessageCircle,
  HelpCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { CocheraCard } from '../components/cocheras/CocheraCard';
import { InteractiveMap } from '../components/cocheras/InteractiveMap';
import { WordPressService } from '../services/wordpressService';
import { Cochera, esCochera } from '../types/cochera';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [cocherasDestacadas, setCocherasDestacadas] = useState<Cochera[]>([]);
  const [todasCocheras, setTodasCocheras] = useState<Cochera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search state
  const [searchZona, setSearchZona] = useState('');
  const [searchTipo, setSearchTipo] = useState('todos');

  const loadCocheras = async () => {
    setLoading(true);
    setError(null);
    try {
      const dataAll = await WordPressService.getCocheras();
      setTodasCocheras(dataAll);

      // La sección se titula "Cocheras Destacadas": no puede listar departamentos
      // ni oficinas. Sólo hay 5 publicaciones marcadas como destacadas, así que
      // completamos la grilla con el resto de las cocheras del catálogo.
      const soloCocheras = dataAll.filter(esCochera);
      const destacadas = soloCocheras.filter(c => c.destacada);
      const resto = soloCocheras.filter(c => !c.destacada);
      setCocherasDestacadas([...destacadas, ...resto].slice(0, 6));
    } catch (err: any) {
      console.error('Error loading properties on Home:', err);
      setError('No se pudieron obtener las propiedades de WordPress REST API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCocheras();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchZona) params.append('zona', searchZona);
    if (searchTipo && searchTipo !== 'todos') params.append('tipo', searchTipo);
    navigate(`/cocheras?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-paper-50">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH FUNCTIONAL REAL SEARCH */}
      {/* ========================================================================= */}
      <section className="relative bg-ink-950 text-white pt-20 pb-16 sm:pb-20 lg:pt-24 lg:pb-24 overflow-hidden">

        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          {/* WebP con fallback a JPG: el original pesaba 774 kB y es lo primero
              que descarga la home. En WebP son 79 kB (-90%). */}
          <picture>
            <source srcSet="/img/hero-bg.webp" type="image/webp" />
            <img
              src="/img/hero-bg.jpg"
              alt="Fondo Cochera Premium"
              {...{ fetchpriority: 'high' }}
              className="w-full h-full object-cover object-center brightness-[0.3] contrast-[1.1] scale-105"
            />
          </picture>
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/95" />
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className="space-y-5">

            {/* Status Pill with Real WP Count */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-600/20 border border-brand-500/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold text-brand-300">
                {loading ? 'Cargando catálogo oficial...' : `${todasCocheras.length} Cocheras Publicadas en Vivo`}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white tracking-tight leading-[1.15]">
              Encontrá tu cochera <span className="text-gradient">ideal</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Segura, cerca tuyo y al mejor precio del mercado.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-200 max-w-3xl mx-auto"
            >
              {/* Location Input */}
              <div className="relative flex-1 w-full flex items-center px-3 border-b sm:border-b-0 sm:border-r border-slate-200 py-2 sm:py-0">
                <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0 mr-2.5" />
                <input
                  type="text"
                  placeholder="Barrio o dirección (ej: Recoleta, Palermo)"
                  value={searchZona}
                  onChange={(e) => setSearchZona(e.target.value)}
                  className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none"
                />
              </div>

              {/* Type Selector */}
              <div className="relative w-full sm:w-48 flex items-center px-3 py-2 sm:py-0">
                <Car className="w-5 h-5 text-brand-600 flex-shrink-0 mr-2.5" />
                <select
                  value={searchTipo}
                  onChange={(e) => setSearchTipo(e.target.value)}
                  className="w-full bg-transparent text-slate-900 text-sm font-medium focus:outline-none cursor-pointer"
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="cubierta">Cubierta</option>
                  <option value="descubierta">Descubierta</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto text-sm group"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Buscar</span>
              </button>
            </form>

            {/* WhatsApp CTA sólo mobile (en desktop va en la fila de badges) */}
            <a
              href="https://wa.me/5491136920920?text=Hola,%20quisiera%20consultar%20por%20cocheras%20disponibles"
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-block sm:hidden mx-auto max-w-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consulta directa por WhatsApp</span>
            </a>

            {/* Quick Trust Badges + WhatsApp direct line */}
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                Matrícula CUCICBA 6610
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-brand-400" />
                Búsqueda en tiempo real
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                Datos 100% matcheados
              </span>
              <a
                href="https://wa.me/5491136920920?text=Hola,%20quisiera%20consultar%20por%20cocheras%20disponibles"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consulta directa por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAPA INTERACTIVO — visible sin scrollear, montado sobre el hero */}
      {/* ========================================================================= */}
      <section className="relative z-10 -mt-10 sm:-mt-12 lg:-mt-14 pb-12 lg:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveMap cocheras={todasCocheras} loading={loading} error={error} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. GRILLA DE COCHERAS (REAL WP DATA ONLY) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-paper-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block mb-1">
                PUBLICACIONES OFICIALES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Cocheras Destacadas y Disponibles
              </h2>
            </div>

            <Link
              to="/cocheras"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-600 hover:text-brand-700 transition-colors"
            >
              <span>Ver las {todasCocheras.length} cocheras</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-20 text-center space-y-4">
              <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-600">Cargando catálogo oficial desde WordPress REST API...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3 max-w-md mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
              <h3 className="font-bold text-red-900 text-sm">Error al cargar datos de WordPress</h3>
              <p className="text-xs text-red-700">{error}</p>
              <button
                onClick={loadCocheras}
                className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Grid View */}
          {!loading && !error && (
            <>
              {cocherasDestacadas.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {cocherasDestacadas.slice(0, 6).map((cochera, idx) => (
                    <CocheraCard key={cochera.id} cochera={cochera} priority={idx < 3} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-sm font-medium">
                  No se encontraron cocheras para mostrar en este momento.
                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CÓMO FUNCIONA */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block">
              PROCESO SIMPLE Y TRANSPARENTE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ¿Cómo consultar o alquilar tu cochera?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Buscar por Zona</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Navegá por el catálogo en vivo o usá el buscador para encontrar la ubicación adecuada en Recoleta, Palermo, Belgrano, Microcentro y más.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Revisar Detalles</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consultá la información técnica, valor publicado o "Consultar Precio", características de acceso (portón automático, seguridad) y videos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Consulta Directa</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contactate por WhatsApp o teléfono con nuestro equipo matriculado para coordinar visita o acordar el alquiler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CTA FINAL */}
      {/* ========================================================================= */}
      <section className="py-16 bg-paper-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-brand rounded-banner p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                ¿Querés alquilar o publicar tu cochera en CABA?
              </h2>
              <p className="text-white/90 text-xs sm:text-sm max-w-xl font-medium">
                Asesoramiento profesional de un equipo matriculado (Mat. CUCICBA 6610).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/cocheras"
                className="btn btn-white"
              >
                Ver Todas las Cocheras
              </Link>
              <a
                href="https://wa.me/5491136920920?text=Hola,%20quisiera%20consultar%20por%20asesoramiento"
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Escribir por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
