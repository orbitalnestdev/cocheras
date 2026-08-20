import React, { useState } from 'react';
import { Video, Play, ExternalLink, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VideosPage: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>('https://www.youtube.com/embed/73PwlaY1TAc');

  const realVideos = [
    {
      id: 1,
      titulo: 'El Parque de Innovación – Carlos Burgueño entrevista a Esteban Sucari',
      duracion: 'A24 TV',
      fecha: '2024',
      descripcion: 'Esteban Sucari analiza la oportunidad histórica de inversión en el Parque de la Innovación en CABA.',
      embedUrl: 'https://www.youtube.com/embed/73PwlaY1TAc',
      youtubeId: '73PwlaY1TAc',
      thumbnail: 'https://img.youtube.com/vi/73PwlaY1TAc/hqdefault.jpg'
    },
    {
      id: 2,
      titulo: 'Cocheras en Recoleta – Renta Mensual Asegurada en Construcción',
      duracion: 'Torre Premium',
      fecha: '2024',
      descripcion: 'Recorrido en video por las cocheras en construcción con renta mensual garantizada desde el día 1.',
      embedUrl: 'https://www.youtube.com/embed/z0kpRKOGaqU',
      youtubeId: 'z0kpRKOGaqU',
      thumbnail: 'https://img.youtube.com/vi/z0kpRKOGaqU/hqdefault.jpg'
    },
    {
      id: 3,
      titulo: 'Cocheras con Pool de Renta – A media cuadra del Hospital Italiano',
      duracion: 'Almagro / CABA',
      fecha: '2024',
      descripcion: 'Análisis de rentabilidad comercial de cocheras fijas en zona médica de alta ocupación.',
      embedUrl: 'https://www.youtube.com/embed/UfnsyJ172dw',
      youtubeId: 'UfnsyJ172dw',
      thumbnail: 'https://img.youtube.com/vi/UfnsyJ172dw/hqdefault.jpg'
    },
    {
      id: 4,
      titulo: 'A Metros de Av. del Libertador – Oportunidades de Cocheras Premium',
      duracion: 'Núñez / Belgrano',
      fecha: '2024',
      descripcion: 'Conocé las características de seguridad, accesos por portón automático y rentabilidad en dólares.',
      embedUrl: 'https://www.youtube.com/embed/0YXU2YN3VCY',
      youtubeId: '0YXU2YN3VCY',
      thumbnail: 'https://img.youtube.com/vi/0YXU2YN3VCY/hqdefault.jpg'
    },
    {
      id: 5,
      titulo: 'Departamentos y Cocheras en Torres Rivadavia Square',
      duracion: 'Caballito',
      fecha: '2024',
      descripcion: 'Presentación del complejo de cocheras y departamentos con renta anual constante en CABA.',
      embedUrl: 'https://www.youtube.com/embed/Hna1B1PV-Lk',
      youtubeId: 'Hna1B1PV-Lk',
      thumbnail: 'https://img.youtube.com/vi/Hna1B1PV-Lk/hqdefault.jpg'
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-paper-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-600 font-extrabold text-xs uppercase tracking-wider">
            <Video className="w-4 h-4" />
            VIDEOS E INFORMES OFICIALES
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Entrevistas y Recorridos en Video
          </h1>
          <p className="text-muted-light text-base leading-relaxed">
            Mirá las notas de televisión y los recorridos en video por los desarrollos de cocheras en Buenos Aires.
          </p>
        </div>

        {/* Featured Main Player */}
        {activeVideo && (
          <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 border border-slate-800">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={`${activeVideo}?autoplay=1`}
                title="Video Destacado"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {realVideos.map((vid) => (
            <div
              key={vid.id}
              className={`bg-white rounded-card overflow-hidden border transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                activeVideo === vid.embedUrl ? 'border-brand-600 ring-2 ring-brand-600/30 shadow-lg' : 'border-slate-200 shadow-sm hover:shadow-md'
              }`}
              onClick={() => {
                setActiveVideo(vid.embedUrl);
                window.scrollTo({ top: 220, behavior: 'smooth' });
              }}
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-900 group">
                  <img
                    src={vid.thumbnail}
                    alt={vid.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md">
                    {vid.duracion}
                  </span>
                </div>

                <div className="p-6 space-y-2">
                  <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider block">
                    {vid.fecha} • {vid.duracion}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                    {vid.titulo}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-normal">
                    {vid.descripcion}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href={`https://wa.me/5491136920920?text=${encodeURIComponent(
                    `Hola, estuve viendo el video "${vid.titulo}" en Cocheras.com.ar y me gustaría más información.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="btn btn-whatsapp btn-block py-2.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar por esta Oportunidad</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
