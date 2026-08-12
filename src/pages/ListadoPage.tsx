import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  MapPin,
  Car,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CocheraCard } from '../components/cocheras/CocheraCard';
import { WordPressService } from '../services/wordpressService';
import { Cochera, FiltrosCochera } from '../types/cochera';

export const ListadoPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [cocheras, setCocheras] = useState<Cochera[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination state (30 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Determine section config based on route pathname
  const getSectionConfig = (pathname: string) => {
    switch (pathname) {
      case '/emprendimientos':
        return {
          eyebrow: 'SECCIÓN EMPRENDIMIENTOS',
          title: 'Emprendimientos Inmobiliarios',
          description: 'Oportunidades de inversión en pozo, garajes comerciales y proyectos en desarrollo.',
          filterTerm: 'Emprendimiento',
          destacada: false
        };
      case '/cocheras-particulares':
        return {
          eyebrow: 'COCHERAS PARTICULARES',
          title: 'Cocheras Particulares en Alquiler',
          description: 'Cocheras fijas, cubiertas y descubiertas para autos y camionetas en CABA.',
          filterTerm: '',
          destacada: false
        };
      case '/garages-y-playas':
        return {
          eyebrow: 'GARAGES Y PLAYAS',
          title: 'Garages y Playas de Estacionamiento',
          description: 'Garajes comerciales con renta activa, cocheras en bloque y playas de estacionamiento.',
          filterTerm: 'Garage',
          destacada: false
        };
      case '/oficinas':
        return {
          eyebrow: 'OFICINAS Y COMERCIOS',
          title: 'Oficinas con Cochera',
          description: 'Espacios corporativos, locales y oficinas con estacionamiento en zonas exclusivas.',
          filterTerm: 'Oficina',
          destacada: false
        };
      case '/departamentos':
        return {
          eyebrow: 'DEPARTAMENTOS',
          title: 'Departamentos para Inversión',
          description: 'Unidades residenciales e inversiones temporarias con cochera en Buenos Aires.',
          filterTerm: 'Departamento',
          destacada: false
        };
      case '/oportunidades':
        return {
          eyebrow: 'OPORTUNIDADES DE INVERSIÓN',
          title: 'Oportunidades Destacadas',
          description: 'Selección de cocheras y propiedades comerciales con alta rentabilidad inmediata.',
          filterTerm: '',
          destacada: true
        };
      default:
        return {
          eyebrow: 'CATÁLOGO COMPLETO',
          title: 'Cocheras en Alquiler y Venta',
          description: 'Explorá y filtrá todas las opciones disponibles con información en tiempo real desde WordPress.',
          filterTerm: searchParams.get('search') || '',
          destacada: false
        };
    }
  };

  const sectionConfig = getSectionConfig(location.pathname);

  // Filters state initialized from URL search params & section config
  const [filtros, setFiltros] = useState<FiltrosCochera>({
    zona: searchParams.get('zona') || 'todas',
    tipo: searchParams.get('tipo') || 'todos',
    precioMin: Number(searchParams.get('precioMin')) || 0,
    precioMax: Number(searchParams.get('precioMax')) || 10000000,
    busqueda: searchParams.get('search') || sectionConfig.filterTerm,
    destacada: searchParams.get('destacada') === 'true' || sectionConfig.destacada,
    orden: (searchParams.get('orden') as any) || 'recientes',
  });

  useEffect(() => {
    // Re-initialize when path or search params change
    const nextConfig = getSectionConfig(location.pathname);
    setFiltros(prev => ({
      ...prev,
      busqueda: searchParams.get('search') || nextConfig.filterTerm,
      destacada: searchParams.get('destacada') === 'true' || nextConfig.destacada,
      zona: searchParams.get('zona') || 'todas',
      tipo: searchParams.get('tipo') || 'todos',
    }));
  }, [location.pathname, searchParams]);

  const zonasDisponibles = [
    'todas',
    'Recoleta',
    'Palermo',
    'Belgrano',
    'Microcentro',
    'Puerto Madero',
    'Caballito',
    'Nuñez',
    'San Telmo'
  ];

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      const data = await WordPressService.getCocheras(filtros);
      setCocheras(data);
      setLoading(false);
    };

    fetchFiltered();
  }, [filtros]);

  // Derived pagination variables
  const totalPages = Math.ceil(cocheras.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, cocheras.length);
  const paginatedCocheras = cocheras.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const updateFiltro = (key: keyof FiltrosCochera, value: any) => {
    const nextFiltros = { ...filtros, [key]: value };
    setFiltros(nextFiltros);
    setCurrentPage(1);

    // Sync params in URL
    const newParams = new URLSearchParams();
    if (nextFiltros.zona && nextFiltros.zona !== 'todas') newParams.set('zona', nextFiltros.zona);
    if (nextFiltros.tipo && nextFiltros.tipo !== 'todos') newParams.set('tipo', nextFiltros.tipo);
    if (nextFiltros.busqueda) newParams.set('search', nextFiltros.busqueda);
    if (nextFiltros.orden) newParams.set('orden', nextFiltros.orden);
    setSearchParams(newParams);
  };

  const handleResetFiltros = () => {
    const resetValues: FiltrosCochera = {
      zona: 'todas',
      tipo: 'todos',
      precioMin: 0,
      precioMax: 10000000,
      busqueda: '',
      destacada: false,
      orden: 'recientes',
    };
    setFiltros(resetValues);
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="pt-28 pb-20 bg-paper-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Section Header */}
        <div className="mb-8 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block">
            {sectionConfig.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {sectionConfig.title}
          </h1>
          <p className="text-muted-light text-sm">
            {sectionConfig.description}
          </p>
        </div>

        {/* Main Grid: Filters Sidebar + Properties list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* FILTERS SIDEBAR */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 bg-white p-6 rounded-card border border-slate-200 shadow-sm space-y-6 sticky top-28">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-sm">Filtros de Búsqueda</h3>
              </div>
              <button
                onClick={handleResetFiltros}
                className="text-[11px] font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
                title="Limpiar todos los filtros"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Filter 1: Palabra Clave / Búsqueda */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Buscar por Nombre
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Ej: Recoleta, Cubierta..."
                  value={filtros.busqueda || ''}
                  onChange={(e) => updateFiltro('busqueda', e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* Filter 2: Zona / Barrio */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ubicación / Barrio
              </label>
              <select
                value={filtros.zona || 'todas'}
                onChange={(e) => updateFiltro('zona', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
              >
                {zonasDisponibles.map((z) => (
                  <option key={z} value={z}>
                    {z === 'todas' ? 'Todas las zonas (CABA)' : z}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Tipo de Cochera */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tipo de Espacio
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
                {['todos', 'cubierta', 'descubierta'].map((t) => (
                  <button
                    key={t}
                    onClick={() => updateFiltro('tipo', t)}
                    className={`py-1.5 rounded-lg font-bold capitalize transition-all text-[11px] ${
                      (filtros.tipo || 'todos') === t
                        ? 'bg-white text-brand-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t === 'todos' ? 'Todas' : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 4: Rango de Precio */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Precio Máximo
                </label>
                <span className="text-xs font-extrabold text-brand-600">
                  ${(filtros.precioMax || 10000000).toLocaleString('es-AR')}
                </span>
              </div>
              <input
                type="range"
                min="30000"
                max="10000000"
                step="50000"
                value={filtros.precioMax || 10000000}
                onChange={(e) => updateFiltro('precioMax', Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-light font-medium">
                <span>$30.000</span>
                <span>$10.000.000</span>
              </div>
            </div>

            {/* Quick Filter Checkbox: Solo Destacadas */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filtros.destacada || false}
                  onChange={(e) => updateFiltro('destacada', e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Mostrar solo DESTACADAS
                </span>
              </label>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* PROPERTIES LIST & CONTROLS */}
          {/* ========================================================================= */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-card border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Count */}
              <div className="text-sm font-semibold text-slate-700">
                Mostrando <span className="font-extrabold text-slate-900">{cocheras.length > 0 ? `${startIndex + 1}-${endIndex}` : '0'}</span> de <span className="font-extrabold text-brand-600">{cocheras.length}</span> cocheras disponibles
              </div>

              {/* Sorting & Layout Toggle */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                
                {/* Sorting Select */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-light font-medium hidden sm:inline">Ordenar:</span>
                  <select
                    value={filtros.orden || 'recientes'}
                    onChange={(e) => updateFiltro('orden', e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
                  >
                    <option value="recientes">Más recientes</option>
                    <option value="precio_asc">Precio: Menor a Mayor</option>
                    <option value="precio_desc">Precio: Mayor a Menor</option>
                  </select>
                </div>

                {/* View Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Vista en Grilla"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Vista en Lista"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* Main Listings Render */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-card h-80 animate-pulse border border-slate-200" />
                ))}
              </div>
            ) : cocheras.length === 0 ? (
              <div className="bg-white p-12 rounded-card text-center border border-slate-200 space-y-4">
                <Car className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No se encontraron cocheras</h3>
                <p className="text-sm text-muted-light max-w-sm mx-auto">
                  Probá ajustando los filtros de búsqueda o reseteando la ubicación.
                </p>
                <button
                  onClick={handleResetFiltros}
                  className="px-5 py-2 bg-brand-600 text-white font-bold text-sm rounded-xl hover:bg-brand-700 transition-colors"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {paginatedCocheras.map((cochera, idx) => (
                    <CocheraCard key={cochera.id} cochera={cochera} priority={idx < 3} />
                  ))}
                </div>

                {/* 30 Items Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 bg-white p-4 rounded-card border">
                    <div className="text-xs text-slate-600 font-semibold">
                      Página <span className="font-extrabold text-slate-900">{currentPage}</span> de <span className="font-extrabold text-slate-900">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Anterior</span>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                            currentPage === p
                              ? 'bg-brand-600 text-white shadow-md'
                              : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                      >
                        <span>Siguiente</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
