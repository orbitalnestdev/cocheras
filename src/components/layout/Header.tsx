import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Database,
  PlusCircle,
  ChevronDown,
  Car,
  Building2,
  Sparkles,
  Users,
  Newspaper,
  Phone,
  Video,
  Briefcase
} from 'lucide-react';
import { WordPressService } from '../../services/wordpressService';
import { WpStatusModal } from '../cocheras/WpStatusModal';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wpModalOpen, setWpModalOpen] = useState(false);
  const [wpStatus, setWpStatus] = useState(WordPressService.getConfig().status);
  
  // Dropdown hover/click states for desktop
  const [activeDropdown, setActiveDropdown] = useState<'propiedades' | 'nosotros' | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleMouseEnter = (menu: 'propiedades' | 'nosotros') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  // Grouped Navigation Items
  const propiedadesGroup = [
    { name: 'Cocheras Particulares', path: '/cocheras-particulares', desc: 'Fijas y cubiertas en CABA', icon: Car },
    { name: 'Garages y Playas', path: '/garages-y-playas', desc: 'Garajes comerciales y playas', icon: Building2 },
    { name: 'Emprendimientos', path: '/emprendimientos', desc: 'Inversiones en pozo y proyectos', icon: Sparkles },
    { name: 'Oficinas y Comercios', path: '/oficinas', desc: 'Espacios corporativos con cochera', icon: Briefcase },
  ];

  const nosotrosGroup = [
    { name: 'Quiénes Somos', path: '/quienes-somos', desc: 'Trayectoria y equipo matriculado', icon: Users },
    { name: 'En los Medios', path: '/prensa', desc: 'Apariciones en televisión y diarios', icon: Newspaper },
    { name: 'Sala de Videos', path: '/videos', desc: 'Informes de mercado y recorridos', icon: Video },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isGroupActive = (items: { path: string }[]) => {
    return items.some(item => location.pathname.startsWith(item.path));
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || location.pathname !== '/'
            ? 'glass-header py-3 border-b border-white/10 shadow-lg'
            : 'bg-ink-950/90 backdrop-blur-md py-3.5 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand Logo Original */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <img
                src="/img/logo.png"
                alt="Cocheras.com.ar Logo"
                className="h-9 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </Link>

            {/* Optimized & Grouped Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 font-semibold text-xs xl:text-sm">
              
              {/* 1. Propiedades Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('propiedades')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`px-3 py-2 rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                    isGroupActive(propiedadesGroup) || activeDropdown === 'propiedades'
                      ? 'text-white font-bold bg-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Propiedades</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'propiedades' ? 'rotate-180 text-brand-400' : ''}`} />
                </button>

                {/* Submenu Dropdown */}
                {activeDropdown === 'propiedades' && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 z-50 animate-fadeIn">
                    {propiedadesGroup.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                            isActive(item.path)
                              ? 'bg-brand-600/20 text-white border border-brand-500/30'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-brand-600/10 text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block leading-tight">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal leading-tight block mt-0.5">{item.desc}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Oportunidades Direct Link */}
              <Link
                to="/oportunidades"
                className={`px-3 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 ${
                  isActive('/oportunidades')
                    ? 'text-white font-bold bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Oportunidades</span>
              </Link>

              {/* 3. Nosotros & Prensa Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('nosotros')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`px-3 py-2 rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                    isGroupActive(nosotrosGroup) || activeDropdown === 'nosotros'
                      ? 'text-white font-bold bg-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Nosotros y Medios</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'nosotros' ? 'rotate-180 text-brand-400' : ''}`} />
                </button>

                {/* Submenu Dropdown */}
                {activeDropdown === 'nosotros' && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 z-50 animate-fadeIn">
                    {nosotrosGroup.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                            isActive(item.path)
                              ? 'bg-brand-600/20 text-white border border-brand-500/30'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-brand-600/10 text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block leading-tight">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal leading-tight block mt-0.5">{item.desc}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Contacto Direct Link */}
              <Link
                to="/contacto"
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive('/contacto')
                    ? 'text-white font-bold bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Contacto</span>
              </Link>

            </nav>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
              {/* Discrete WP Status Icon */}
              <button
                onClick={() => setWpModalOpen(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title={`Estado WP API: ${wpStatus}`}
              >
                <Database className={`w-4 h-4 ${wpStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}`} />
              </button>

              {/* Primary CTA */}
              <Link
                to="/publicar"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-brand hover:brightness-110 transition-all shadow-md hover:shadow-brand-600/30 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publicar Cochera</span>
              </Link>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none"
                aria-label="Menú principal"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Categorized Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 mt-2 animate-fadeIn max-h-[85vh] overflow-y-auto">
            
            {/* Propiedades Group */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-3 py-1">
                Catálogo y Categorías
              </span>
              {propiedadesGroup.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive(item.path)
                      ? 'text-white bg-brand-600 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4 text-brand-400" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Oportunidades */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-3 py-1">
                Destacados
              </span>
              <Link
                to="/oportunidades"
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive('/oportunidades')
                    ? 'text-white bg-brand-600 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Oportunidades Destacadas</span>
              </Link>
            </div>

            {/* Nosotros & Medios */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-3 py-1">
                Institucional y Prensa
              </span>
              {nosotrosGroup.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive(item.path)
                      ? 'text-white bg-brand-600 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4 text-brand-400" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <Link
                to="/contacto"
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive('/contacto')
                    ? 'text-white bg-brand-600 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Phone className="w-4 h-4 text-brand-400" />
                <span>Contacto</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/publicar"
                className="w-full py-3 text-center text-xs font-extrabold text-white bg-gradient-brand rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publicar Cochera</span>
              </Link>
            </div>

          </div>
        )}
      </header>

      {/* WordPress Connection Modal */}
      <WpStatusModal
        isOpen={wpModalOpen}
        onClose={() => setWpModalOpen(false)}
        onStatusChange={(status) => setWpStatus(status)}
      />
    </>
  );
};
