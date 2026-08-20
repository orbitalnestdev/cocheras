import React from 'react';
import { Newspaper, ExternalLink, Calendar, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Una URL sirve como enlace a la nota sólo si apunta a un artículo concreto.
 * Las que hay cargadas hoy son las portadas de los medios
 * (lanacion.com.ar, infobae.com…), así que el botón "Leer nota completa en X"
 * prometía un artículo y dejaba al lector en la home del diario.
 * Al cargar la URL real de cada nota, el enlace vuelve a aparecer solo.
 */
const esEnlaceDeNota = (url?: string): boolean => {
  if (!url) return false;
  try {
    return new URL(url).pathname.replace(/\/+$/, '').length > 1;
  } catch {
    return false;
  }
};

export const PrensaPage: React.FC = () => {
  // TODO: reemplazar por las URLs reales de cada nota. Mientras apunten a la
  // portada del medio, la tarjeta no ofrece el enlace (ver `esEnlaceDeNota`).
  const articulosPrensa = [
    {
      id: 1,
      medio: 'La Nación',
      titulo: 'Invertir en cocheras: la alternativa que le gana a la inflación en CABA',
      fecha: '15 de Mayo, 2025',
      resumen: 'Alberto Sucari, fundador de Cocheras.com.ar, analiza por qué las cocheras en barrios como Palermo, Recoleta y Belgrano continúan siendo un refugio de valor seguro.',
      imagen: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
      url: 'https://www.lanacion.com.ar',
      categoria: 'Mercado Inmobiliario'
    },
    {
      id: 2,
      medio: 'Infobae',
      titulo: 'Cocheras con pool de renta: el modelo que revoluciona el estacionamiento urbano',
      fecha: '28 de Marzo, 2025',
      resumen: 'Cómo funciona la compra de metros cuadrados de cochera en grandes garages comerciales con rentabilidad mensual en dólares o pesos ajustados.',
      imagen: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
      url: 'https://www.infobae.com',
      categoria: 'Inversiones'
    },
    {
      id: 3,
      medio: 'El Cronista',
      titulo: 'Por qué la falta de espacio en CABA dispara la demanda de cocheras privadas',
      fecha: '10 de Enero, 2025',
      resumen: 'Con más de 1.8 millones de vehículos en circulación en Capital Federal, alquilar o comprar una cochera fija se transformó en una necesidad básica.',
      imagen: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
      url: 'https://www.cronista.com',
      categoria: 'Economía & Real Estate'
    },
    {
      id: 4,
      medio: 'Clarín',
      titulo: 'Parque de la Innovación y Madero Sur: las nuevas joyas de la inversión en garajes',
      fecha: '18 de Noviembre, 2024',
      resumen: 'Análisis de los nuevos desarrollos en zonas de expansión corporativa y comercial en la Ciudad de Buenos Aires.',
      imagen: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
      url: 'https://www.clarin.com',
      categoria: 'Tendencias'
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-paper-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-600 font-extrabold text-xs uppercase tracking-wider">
            <Newspaper className="w-4 h-4" />
            EN LOS MEDIOS
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Cocheras.com.ar en la Prensa
          </h1>
          <p className="text-muted-light text-base leading-relaxed">
            Revisá todas las apariciones, notas de opinión e informes especiales en los principales medios gráficos y digitales del país.
          </p>
        </div>

        {/* Press Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articulosPrensa.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-card overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                  <img
                    src={art.imagen}
                    alt={art.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-brand-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {art.medio}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-light">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    <span>{art.fecha}</span>
                    <span>•</span>
                    <span className="text-brand-600 font-bold">{art.categoria}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                    {art.titulo}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    {art.resumen}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                {esEnlaceDeNota(art.url) ? (
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    <span>Leer nota completa en {art.medio}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400">
                    Publicado en {art.medio}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Contact */}
        <div className="bg-gradient-brand rounded-banner p-8 text-white text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-bold">¿Sos periodista o querés realizar una nota?</h3>
          <p className="text-white/90 text-sm max-w-xl mx-auto">
            Ponete en contacto con nuestro equipo de prensa para coordinar entrevistas o solicitar informes de mercado.
          </p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-all"
          >
            <span>Contactar a Prensa</span>
            <ArrowRight className="w-4 h-4 text-brand-600" />
          </Link>
        </div>

      </div>
    </div>
  );
};
