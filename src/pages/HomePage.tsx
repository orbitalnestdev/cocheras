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
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  ShieldAlert,
  Building2,
  Building,
  Home,
  Warehouse,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { CocheraCard } from '../components/cocheras/CocheraCard';
import { InteractiveMap } from '../components/cocheras/InteractiveMap';
import { WordPressService } from '../services/wordpressService';
import { Cochera } from '../types/cochera';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [cocherasDestacadas, setCocherasDestacadas] = useState<Cochera[]>([]);
  const [todasCocheras, setTodasCocheras] = useState<Cochera[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchZona, setSearchZona] = useState('');
  const [searchFecha, setSearchFecha] = useState('');

  useEffect(() => {
    const loadCocheras = async () => {
      setLoading(true);
      const dataAll = await WordPressService.getCocheras();
      setTodasCocheras(dataAll);
      const destacadas = dataAll.filter(c => c.destacada);
      setCocherasDestacadas(destacadas.length > 0 ? destacadas : dataAll);
      setLoading(false);
    };
    loadCocheras();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchZona) params.append('zona', searchZona);
    if (searchFecha) params.append('fecha', searchFecha);
    navigate(`/cocheras?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative bg-ink-950 text-white pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden min-h-[90vh] flex items-center">
        
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=2000&q=80"
            alt="Fondo de cochera subterránea con luces neón"
            className="w-full h-full object-cover object-center opacity-30 scale-105"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-ink-950/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-600/30 border border-brand-500/40 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">
                  #1 EN ALQUILER DE COCHERAS
                </span>
              </div>

              {/* Main Headline H1 */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
                Encontrá tu<br />
                cochera perfecta,<br />
                <span className="text-gradient">sin vueltas.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-muted-dark max-w-xl font-normal leading-relaxed">
                Alquilá cocheras en minutos. Seguridad, confianza y la mejor ubicación al mejor precio.
              </p>

              {/* Search Bar Container */}
              <div className="pt-2">
                <form
                  onSubmit={handleSearchSubmit}
                  className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-100"
                >
                  {/* Location Input */}
                  <div className="relative flex-1 w-full flex items-center px-3 border-b sm:border-b-0 sm:border-r border-slate-200/80 py-2 sm:py-0">
                    <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0 mr-2.5" />
                    <input
                      type="text"
                      placeholder="¿Dónde estás buscando?"
                      value={searchZona}
                      onChange={(e) => setSearchZona(e.target.value)}
                      className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none"
                    />
                  </div>

                  {/* Date Selector */}
                  <div className="relative w-full sm:w-44 flex items-center px-3 py-2 sm:py-0">
                    <Calendar className="w-5 h-5 text-brand-600 flex-shrink-0 mr-2.5" />
                    <input
                      type="text"
                      onFocus={(e) => (e.target.type = 'date')}
                      placeholder="Fecha"
                      value={searchFecha}
                      onChange={(e) => setSearchFecha(e.target.value)}
                      className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-brand-600/30 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Buscar</span>
                  </button>
                </form>

                {/* Quick Trust Badges below search */}
                <div className="flex flex-wrap items-center gap-6 mt-4 text-xs font-medium text-muted-dark">
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-brand-400" />
                    Búsqueda rápida
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-brand-400" />
                    Sin comisión
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-brand-400" />
                    Pago seguro
                  </span>
                </div>
              </div>

            </div>

            {/* Right Content: Floating Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative">
                
                {/* Main Floating Card */}
                <div className="bg-white/95 backdrop-blur-xl p-6 rounded-floating shadow-2xl border border-white/20 max-w-xs sm:max-w-sm w-full text-slate-900 space-y-4 animate-float">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center text-brand-600 flex-shrink-0">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 block leading-none">
                        +2.500
                      </span>
                      <span className="text-xs font-semibold text-muted-light">
                        Cocheras disponibles
                      </span>
                    </div>
                  </div>

                  {/* Avatar Stack */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex -space-x-2 overflow-hidden">
                      <img
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                        alt="Usuario 1"
                      />
                      <img
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                        alt="Usuario 2"
                      />
                      <img
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                        alt="Usuario 3"
                      />
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold ring-2 ring-white">
                        +
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                      Verificadas 100%
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BENEFICIOS BAR (4 Columns) */}
      {/* ========================================================================= */}
      <section className="bg-ink-950 py-16 border-t border-white/5 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Benefit 1 */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center text-brand-500 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white mb-1">Seguridad Garantizada</h3>
                <p className="text-xs text-muted-dark leading-relaxed">
                  Todas nuestras cocheras cuentan con sistemas de seguridad.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center text-brand-500 flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white mb-1">Mejores Ubicaciones</h3>
                <p className="text-xs text-muted-dark leading-relaxed">
                  Cocheras en zonas estratégicas, cerca de todo lo que necesitás.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center text-brand-500 flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white mb-1">Disponible 24/7</h3>
                <p className="text-xs text-muted-dark leading-relaxed">
                  Accedé a tu cochera cuando la necesites, todos los días.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center text-brand-500 flex-shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white mb-1">Pago 100% Seguro</h3>
                <p className="text-xs text-muted-dark leading-relaxed">
                  Procesos de pago seguros y protegidos en todo momento.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIONES DEL SITIO ORIGINAL (Emprendimientos, Garages, Oficinas, etc.) */}
      {/* ========================================================================= */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
              SECCIONES DEL SITIO
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explorá por Categoría de Inversión
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Category 1 */}
            <Link
              to="/emprendimientos"
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-center group flex flex-col items-center gap-3 shadow-xs hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xs text-slate-800 group-hover:text-brand-600 transition-colors">
                Emprendimientos
              </span>
            </Link>

            {/* Category 2 */}
            <Link
              to="/cocheras-particulares"
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-center group flex flex-col items-center gap-3 shadow-xs hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Car className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xs text-slate-800 group-hover:text-brand-600 transition-colors">
                Cocheras Particulares
              </span>
            </Link>

            {/* Category 3 */}
            <Link
              to="/garages-y-playas"
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-center group flex flex-col items-center gap-3 shadow-xs hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Warehouse className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xs text-slate-800 group-hover:text-brand-600 transition-colors">
                Garages y Playas
              </span>
            </Link>

            {/* Category 4 */}
            <Link
              to="/oficinas"
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-center group flex flex-col items-center gap-3 shadow-xs hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Building className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xs text-slate-800 group-hover:text-brand-600 transition-colors">
                Oficinas
              </span>
            </Link>

            {/* Category 5 */}
            <Link
              to="/departamentos"
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-center group flex flex-col items-center gap-3 shadow-xs hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Home className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xs text-slate-800 group-hover:text-brand-600 transition-colors">
                Departamentos
              </span>
            </Link>

            {/* Category 6 */}
            <Link
              to="/oportunidades"
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 transition-all text-center group flex flex-col items-center gap-3 shadow-xs hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xs text-slate-800 group-hover:text-brand-600 transition-colors">
                Oportunidades
              </span>
            </Link>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. COCHERAS DESTACADAS */}
      {/* ========================================================================= */}
      <section className="py-20 bg-paper-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block mb-1">
                COCHERAS DESTACADAS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Las mejores cocheras<br className="hidden sm:inline" /> en las mejores zonas
              </h2>
              <p className="text-muted-light text-sm mt-2 max-w-md">
                Descubrí nuestras cocheras destacadas seleccionadas especialmente para vos.
              </p>
            </div>

            <Link
              to="/cocheras"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-white text-sm font-semibold transition-all shadow-sm self-start md:self-auto"
            >
              <span>Ver todas las cocheras</span>
            </Link>
          </div>

          {/* Cards Grid / Carousel */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-card h-80 animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cocherasDestacadas.slice(0, 4).map((cochera, index) => (
                <CocheraCard key={cochera.id} cochera={cochera} priority={index < 2} />
              ))}
            </div>
          )}

          {/* Dots Pagination */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAPA INTERACTIVO DE COCHERAS (Generación de Leads) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-slate-100 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-600 font-extrabold text-xs uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" />
                MAPA INTERACTIVO EN TIEMPO REAL
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Ubicá tu cochera en el mapa
              </h2>
              <p className="text-muted-light text-sm mt-1 max-w-xl font-medium">
                Seleccioná los pines en el mapa interactivo para ver los detalles, el valor mensual y consultar disponibilidad al instante.
              </p>
            </div>
          </div>

          {!loading && <InteractiveMap cocheras={todasCocheras} />}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CÓMO FUNCIONA (Dark section) */}
      {/* ========================================================================= */}
      <section className="bg-ink-950 text-white py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left intro */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-500 block">
                CÓMO FUNCIONA
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Alquilá tu cochera<br />en 3 simples pasos
              </h2>
              <p className="text-muted-dark text-base leading-relaxed">
                Descubrí rápido, seguro y transparente.
              </p>
              <Link
                to="/cocheras"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-md"
              >
                <span>Comenzar ahora</span>
              </Link>
            </div>

            {/* Right 3 Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Step 1 */}
              <div className="glass-card-dark p-6 rounded-2xl space-y-4 relative overflow-hidden group hover:border-brand-500/40 transition-colors">
                <div className="w-10 h-10 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center font-extrabold text-brand-400 text-sm">
                  1
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-400">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white">Buscá</h3>
                <p className="text-xs text-muted-dark leading-relaxed">
                  Encontrá la cochera ideal en la ubicación que necesitás.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass-card-dark p-6 rounded-2xl space-y-4 relative overflow-hidden group hover:border-brand-500/40 transition-colors">
                <div className="w-10 h-10 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center font-extrabold text-brand-400 text-sm">
                  2
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white">Reservá</h3>
                <p className="text-xs text-muted-dark leading-relaxed">
                  Reservá online en minutos, sin trámites complicados.
                </p>
              </div>

              {/* Step 3 */}
              <div className="glass-card-dark p-6 rounded-2xl space-y-4 relative overflow-hidden group hover:border-brand-500/40 transition-colors">
                <div className="w-10 h-10 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center font-extrabold text-brand-400 text-sm">
                  3
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-400">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white">Disfrutá</h3>
                <p className="text-xs text-muted-dark leading-relaxed">
                  Accedé a tu cochera y disfrutá de la tranquilidad.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. POR QUÉ ELEGIRNOS (Split section) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-paper-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block">
                ¿POR QUÉ ELEGIRNOS?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Más que cocheras,<br />soluciones.
              </h2>
              <p className="text-muted-light text-base leading-relaxed max-w-lg">
                Nos enfocamos en brindarte la mejor experiencia de alquiler de cocheras.
              </p>

              {/* Check list */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-600/10 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    Sin comisión ni cargos ocultos
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-600/10 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    Atención personalizada
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-600/10 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    Cocheras verificadas
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-600/10 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    Cancelación flexible
                  </span>
                </div>
              </div>
            </div>

            {/* Right Media Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80"
                  alt="Auto de lujo estacionado en garage moderno"
                  className="w-full h-80 sm:h-96 object-cover"
                />

                {/* Floating Phone Graphic Overlay */}
                <div className="absolute right-4 bottom-4 w-36 sm:w-44 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                  <div className="bg-slate-950 rounded-xl p-2 text-center text-white space-y-1">
                    <Smartphone className="w-5 h-5 mx-auto text-brand-400" />
                    <span className="text-[10px] font-bold block text-slate-300">App Mobile</span>
                    <div className="h-1.5 bg-brand-500 rounded-full w-3/4 mx-auto" />
                  </div>
                </div>

                {/* Floating Badge +98% */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-full shadow-xl text-center border border-slate-100 animate-pulse">
                  <span className="text-xl font-extrabold text-slate-900 block leading-none">
                    +98%
                  </span>
                  <span className="text-[10px] font-bold text-muted-light block">
                    Clientes satisfechos
                  </span>
                </div>

                {/* Floating Card "Zona Segura" */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-100 max-w-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Zona Segura</h4>
                    <p className="text-[10px] text-muted-light">Todas nuestras cocheras están verificadas</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TESTIMONIOS (Dark section) */}
      {/* ========================================================================= */}
      <section className="bg-ink-950 text-white py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-500 block mb-1">
                TESTIMONIOS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Lo que dicen<br />nuestros usuarios
              </h2>
            </div>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 text-sm font-semibold transition-all self-start md:self-auto">
              <span>Ver más testimonios</span>
            </button>
          </div>

          {/* Testimonials Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Testimonial 1 */}
            <div className="glass-card-dark p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-star">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-star text-star" />
                  ))}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  "Encontré la cochera perfecta cerca de mi trabajo. El proceso fue súper fácil y rápido."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="María G."
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">María G.</h4>
                  <span className="text-xs text-muted-dark">Palermo, CABA</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="glass-card-dark p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-star">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-star text-star" />
                  ))}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  "Excelente servicio y atención. Las cocheras son seguras y están en muy buenas ubicaciones."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Juan P."
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">Juan P.</h4>
                  <span className="text-xs text-muted-dark">Belgrano, CABA</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="glass-card-dark p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-star">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-star text-star" />
                  ))}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  "Muy recomendable. Alquilé durante 6 meses sin ningún problema. Todo perfecto."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Ana L."
                  className="w-10 h-10 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">Ana L.</h4>
                  <span className="text-xs text-muted-dark">Recoleta, CABA</span>
                </div>
              </div>
            </div>

          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
            <span className="w-2 h-2 rounded-full bg-white/20"></span>
            <span className="w-2 h-2 rounded-full bg-white/20"></span>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CTA FINAL BANNER */}
      {/* ========================================================================= */}
      <section className="py-16 bg-paper-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-brand rounded-banner p-8 sm:p-12 text-white shadow-glow-brand flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                ¿Listo para encontrar tu cochera ideal?
              </h2>
              <p className="text-white/90 text-sm sm:text-base max-w-xl font-medium">
                Unite a miles de usuarios que ya encontraron la cochera perfecta.
              </p>
            </div>

            <Link
              to="/cocheras"
              className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 flex-shrink-0 group hover:scale-105 active:scale-95"
            >
              <span>Buscar cocheras ahora</span>
              <ArrowRight className="w-4 h-4 text-brand-600 group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
};
