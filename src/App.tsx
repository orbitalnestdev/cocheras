import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ListadoPage } from './pages/ListadoPage';
import { SingleCocheraPage } from './pages/SingleCocheraPage';
import { PublicarPage } from './pages/PublicarPage';
import { ComoFuncionaPage } from './pages/ComoFuncionaPage';
import { NosotrosPage } from './pages/NosotrosPage';
import { ContactoPage } from './pages/ContactoPage';

import { PrensaPage } from './pages/PrensaPage';
import { VideosPage } from './pages/VideosPage';

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
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
