import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';

// La home entra en el bundle inicial; el resto se descarga al visitarse.
// Antes viajaba todo junto: 543 kB para ver la portada, incluyendo Leaflet,
// el clustering y páginas que la mayoría de las visitas nunca abre.
const ListadoPage = lazy(() => import('./pages/ListadoPage').then(m => ({ default: m.ListadoPage })));
const SingleCocheraPage = lazy(() => import('./pages/SingleCocheraPage').then(m => ({ default: m.SingleCocheraPage })));
const PublicarPage = lazy(() => import('./pages/PublicarPage').then(m => ({ default: m.PublicarPage })));
const ComoFuncionaPage = lazy(() => import('./pages/ComoFuncionaPage').then(m => ({ default: m.ComoFuncionaPage })));
const NosotrosPage = lazy(() => import('./pages/NosotrosPage').then(m => ({ default: m.NosotrosPage })));
const ContactoPage = lazy(() => import('./pages/ContactoPage').then(m => ({ default: m.ContactoPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const TerminosPage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.TerminosPage })));
const PrivacidadPage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.PrivacidadPage })));
const PrensaPage = lazy(() => import('./pages/PrensaPage').then(m => ({ default: m.PrensaPage })));
const VideosPage = lazy(() => import('./pages/VideosPage').then(m => ({ default: m.VideosPage })));

const CargandoRuta: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-brand-600 animate-spin" />
  </div>
);

// Scroll to top helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-paper-50 text-slate-900 font-sans selection:bg-brand-600 selection:text-white">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<CargandoRuta />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cocheras" element={<ListadoPage />} />
          <Route path="/cocheras/:slug" element={<SingleCocheraPage />} />
          
          {/* Secciones originales de cocheras.com.ar */}
          <Route path="/emprendimientos" element={<ListadoPage />} />
          <Route path="/cocheras-particulares" element={<ListadoPage />} />
          <Route path="/garages-y-playas" element={<ListadoPage />} />
          <Route path="/oficinas" element={<ListadoPage />} />
          <Route path="/departamentos" element={<ListadoPage />} />
          <Route path="/oportunidades" element={<ListadoPage />} />
          <Route path="/prensa" element={<PrensaPage />} />
          <Route path="/videos" element={<VideosPage />} />

          <Route path="/publicar" element={<PublicarPage />} />
          <Route path="/como-funciona" element={<ComoFuncionaPage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/quienes-somos" element={<NosotrosPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/contactanos" element={<ContactoPage />} />

          <Route path="/terminos" element={<TerminosPage />} />
          <Route path="/privacidad" element={<PrivacidadPage />} />

          {/* Sin esto cualquier URL inválida renderizaba header + footer
              con el medio en blanco, sin mensaje ni salida. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;
