import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Car, Database, PlusCircle } from 'lucide-react';
import { WordPressService } from '../../services/wordpressService';
import { WpStatusModal } from '../cocheras/WpStatusModal';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wpModalOpen, setWpModalOpen] = useState(false);
  const [wpStatus, setWpStatus] = useState(WordPressService.getConfig().status);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Exact 8 sections requested by the user
  const navLinks = [
    { name: 'Cocheras Particulares', path: '/cocheras-particulares' },
    { name: 'Garages y Playas', path: '/garages-y-playas' },
    { name: 'Emprendimientos', path: '/emprendimientos' },
    { name: 'Oficinas', path: '/oficinas' },
    { name: 'Oportunidades', path: '/oportunidades' },
    { name: 'Quiénes Somos', path: '/quienes-somos' },
    { name: 'En los Medios', path: '/prensa' },
    { name: 'Contactanos', path: '/contacto' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
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
          <div className="flex items-center justify-between gap-2">
            
            {/* Brand Logo Original */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <img
                src="/img/logo.png"
                alt="Cocheras.com.ar Logo"
                className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </Link>

            {/* Exact 8 Navigation Items for Desktop */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 font-medium text-xs xl:text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2.5 xl:px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    isActive(link.path)
                      ? 'text-white font-bold bg-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Action: Publicar Cochera CTA */}
            <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
              {/* Discreet WP Status Icon */}
              <button
                onClick={() => setWpModalOpen(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title={`Estado WP API: ${wpStatus}`}
              >
                <Database className={`w-4 h-4 ${wpStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}`} />
              </button>

              {/* Main Primary CTA Button */}
              <Link
                to="/publicar"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-brand hover:brightness-110 transition-all shadow-md hover:shadow-brand-600/30 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publicar Cochera</span>
              </Link>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
                aria-label="Menú principal"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-1 mt-2 animate-fadeIn max-h-[85vh] overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3.5 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive(link.path)
                    ? 'text-white bg-brand-600 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}

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
