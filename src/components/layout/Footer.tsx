import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-950 text-white border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/img/logo.png"
                alt="Cocheras.com.ar Logo"
                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <p className="text-muted-dark text-sm max-w-sm leading-relaxed">
              La plataforma #1 para la gestión, compra y alquiler de cocheras y garages en Capital Federal y GBA.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-dark hover:text-white hover:bg-brand-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-dark hover:text-white hover:bg-brand-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/5491149973559"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-dark hover:text-white hover:bg-emerald-600 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Navegación por Secciones */}
          <div>
            <h4 className="font-bold text-sm text-white tracking-wider mb-4">Secciones del Sitio</h4>
            <ul className="space-y-2 text-xs text-muted-dark font-medium">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              </li>
              <li>
                <Link to="/emprendimientos" className="hover:text-white transition-colors">Emprendimientos</Link>
              </li>
              <li>
                <Link to="/cocheras-particulares" className="hover:text-white transition-colors">Cocheras Particulares</Link>
              </li>
              <li>
                <Link to="/garages-y-playas" className="hover:text-white transition-colors">Garages y Playas</Link>
              </li>
              <li>
                <Link to="/oficinas" className="hover:text-white transition-colors">Oficinas</Link>
              </li>
              <li>
                <Link to="/departamentos" className="hover:text-white transition-colors">Departamentos</Link>
              </li>
              <li>
                <Link to="/prensa" className="hover:text-white transition-colors">En los Medios</Link>
              </li>
              <li>
                <Link to="/videos" className="hover:text-white transition-colors">Sala de Videos</Link>
              </li>
              <li>
                <Link to="/quienes-somos" className="hover:text-white transition-colors">Quiénes Somos</Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal & Matrícula */}
          <div>
            <h4 className="font-bold text-sm text-white tracking-wider mb-4">Legal & Matrícula</h4>
            <ul className="space-y-2 text-xs text-muted-dark font-medium">
              <li className="text-white font-bold">Matriculado Esteban Sucari</li>
              <li>Matrícula CUCICBA 6610</li>
              <li>Matrícula CMPCSI 6068</li>
              <li className="pt-2">
                <a href="#terminos" className="hover:text-white transition-colors">Términos y Condiciones</a>
              </li>
              <li>
                <a href="#privacidad" className="hover:text-white transition-colors">Política de Privacidad</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contacto */}
          <div>
            <h4 className="font-bold text-sm text-white tracking-wider mb-4">Contacto Directo</h4>
            <ul className="space-y-2.5 text-xs text-muted-dark font-medium">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <a href="mailto:info@cocheras.com.ar" className="hover:text-white transition-colors">info@cocheras.com.ar</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="https://wa.me/5491136920920" target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline">
                  WhatsApp 11 3692 0920
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <a href="tel:+541149973559" className="hover:text-white transition-colors">+54 11 4997-3559</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>11 de Septiembre 2957 2° «C», Núñez, CABA</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 text-center text-xs text-muted-dark">
          <p>© {new Date().getFullYear()} Cocheras. Todos los derechos reservados. Mat. CUCICBA 6610.</p>
        </div>

      </div>
    </footer>
  );
};
