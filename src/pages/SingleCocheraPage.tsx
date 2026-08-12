import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  MessageCircle,
  ArrowLeft,
  Share2,
  Heart,
  Car,
  Lock,
  Video,
  KeyRound,
  Maximize2,
  Calendar,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Radio
} from 'lucide-react';
import { WordPressService } from '../services/wordpressService';
import { Cochera } from '../types/cochera';
import { CocheraCard } from '../components/cocheras/CocheraCard';

export const SingleCocheraPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [cochera, setCochera] = useState<Cochera | null>(null);
  const [relacionadas, setRelacionadas] = useState<Cochera[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);

  // Form contact state
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('Hola, me interesa solicitar más información sobre esta propiedad.');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const fetchCochera = async () => {
      if (!slug) return;
      setLoading(true);
      setEnviado(false);

      const item = await WordPressService.getCocheraBySlug(slug);
      if (item) {
        setCochera(item);
        setSelectedImage(item.imagenDestacada || item.imagenes[0]?.url);
        
        // Fetch related cocheras in same area
        const all = await WordPressService.getCocheras({ zona: item.zona });
        setRelacionadas(all.filter(c => c.id !== item.id).slice(0, 3));
      }
      setLoading(false);
    };

    fetchCochera();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-light font-medium">Cargando detalles de la cochera...</p>
      </div>
    );
  }

  if (!cochera) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold">Propiedad no encontrada</h2>
        <p className="text-muted-light">No pudimos encontrar la publicación solicitada.</p>
        <Link to="/cocheras-particulares" className="inline-block px-6 py-2.5 bg-brand-600 text-white font-bold rounded-xl">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const priceText = cochera.consultarPrecio || cochera.precio === undefined || cochera.precio === 0
    ? 'Consultar Precio'
    : cochera.moneda === 'USD'
      ? `U$S ${cochera.precio.toLocaleString('es-AR')}`
      : `$ ${cochera.precio.toLocaleString('es-AR')}`;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola! Vi la publicación "${cochera.titulo}" (${priceText}) en Cocheras.com.ar y me gustaría consultar disponibilidad.`
  );

  return (
    <div className="pt-28 pb-20 bg-paper-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
            <Link to="/" className="hover:text-brand-600 transition-colors">Inicio</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/cocheras-particulares" className="hover:text-brand-600 transition-colors">Cocheras Particulares</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-xs">{cochera.titulo}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFavorite(!favorite)}
              className={`p-2 rounded-xl border bg-white transition-all shadow-2xs ${
                favorite ? 'text-red-500 border-red-200' : 'text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
              title="Guardar a favoritos"
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-red-500' : ''}`} />
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 transition-colors shadow-2xs text-xs font-semibold flex items-center gap-1.5 px-3"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir</span>
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-4">
          {/* Main Large Image Container */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200">
            <img
              src={selectedImage}
              alt={cochera.titulo}
              className="w-full h-full object-cover"
            />
            {cochera.destacada && (
              <span className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                DESTACADA
              </span>
            )}
          </div>

          {/* Gallery Thumbnails Row */}
          {cochera.imagenes.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto py-2">
              {cochera.imagenes.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-28 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img.url ? 'border-brand-600 ring-2 ring-brand-600/30 scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Layout: Details + Sticky CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Title, Badges & Location Card */}
            <div className="bg-white p-6 sm:p-8 rounded-card border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-extrabold uppercase tracking-wider border border-brand-200/60">
                  Cochera {cochera.tipo}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold uppercase tracking-wider border border-emerald-200/60 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Disponible ahora
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {cochera.titulo}
              </h1>

              <div className="flex items-center gap-2 text-slate-600 text-base font-semibold pt-1 border-t border-slate-100">
                <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0" />
                <span>{cochera.direccion || `${cochera.zona}, CABA`}</span>
              </div>
            </div>

            {/* Ficha Técnica & Specs Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-card border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <span>Ficha Técnica y Características</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Tipo de Inmueble</span>
                  <span className="font-extrabold text-base text-slate-900 capitalize flex items-center gap-2">
                    <Car className="w-4 h-4 text-brand-600" />
                    {cochera.tipo}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Tipo de Acceso</span>
                  <span className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-brand-600" />
                    {cochera.tipoAcceso || 'Portón Automático'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Superficie Total</span>
                  <span className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-brand-600" />
                    {cochera.superficie || 14} m²
                  </span>
                </div>
              </div>

              {/* Security & Service Tags */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Servicios y Equipamiento
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {cochera.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs"
                    >
                      <ShieldCheck className="w-4 h-4 text-brand-600" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Spacious Description Block */}
            <div className="bg-white p-6 sm:p-8 rounded-card border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Descripción Detallada
              </h2>
              <div className="text-slate-700 text-base leading-relaxed space-y-4 font-normal tracking-wide">
                {cochera.descripcion ? (
                  cochera.descripcion.split('\n').filter(p => p.trim().length > 0).map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed text-slate-700 text-base sm:text-lg">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-500 italic text-sm">
                    Sin descripción detallada publicada. Consultá por WhatsApp para coordinar visita o asesoramiento.
                  </p>
                )}
              </div>
            </div>

            {/* Video Virtual Tour Embed (if available from WordPress) */}
            {cochera.videoUrl && (
              <div className="bg-white p-6 sm:p-8 rounded-card border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Video className="w-5 h-5 text-brand-600" />
                  <span>Video Tour Virtual</span>
                </h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-lg border border-slate-200">
                  <iframe
                    src={cochera.videoUrl}
                    title={`Video Tour - ${cochera.titulo}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
            
            {/* Audio Interview Player (if available from WordPress) */}
            {cochera.audioUrl && (
              <div className="bg-white p-6 sm:p-8 rounded-card border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-brand-600" />
                  <span>{cochera.audioTitle || 'Entrevista Radial'}</span>
                </h2>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                  <audio controls src={cochera.audioUrl} className="w-full" />
                </div>
              </div>
            )}

            {/* Location Google Map Embed */}
            <div className="bg-white p-6 sm:p-8 rounded-card border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-600" />
                  <span>Ubicación en Google Maps</span>
                </h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {cochera.direccion || `${cochera.zona}, CABA`}
                </span>
              </div>
              <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    cochera.lat && cochera.lng
                      ? `${cochera.lat},${cochera.lng}`
                      : `${cochera.direccion || cochera.titulo} ${cochera.zona} Buenos Aires`
                  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  title={`Google Maps - ${cochera.titulo}`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Pricing & Lead Conversion Card */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xl space-y-6 relative overflow-hidden">
              
              {/* Top Accent Color Bar */}
              <div className="h-1.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-500 absolute top-0 left-0 right-0" />

              {/* Price Block */}
              <div className="pb-5 border-b border-slate-100 space-y-2 pt-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  Valor Publicado
                </span>
                <div className="flex items-baseline gap-1.5">
                  {cochera.consultarPrecio || !cochera.precio || cochera.precio === 0 ? (
                    <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                      Consultar Precio
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        {cochera.moneda === 'USD' ? `U$S ${cochera.precio.toLocaleString('es-AR')}` : `$ ${cochera.precio.toLocaleString('es-AR')}`}
                      </span>
                      <span className="text-xs font-extrabold text-slate-400">/{cochera.periodo}</span>
                    </>
                  )}
                </div>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200/80 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Expensas y gastos incluidos</span>
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp CTA Button with Micro-animations & Glow */}
              <div className="space-y-2.5">
                <a
                  href={`https://wa.me/${cochera.contacto?.whatsapp || '5491136920920'}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 px-5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] ring-1 ring-emerald-400/30 group cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 fill-white/20" />
                  <span>Consultar por WhatsApp</span>
                </a>

                {/* Secondary Direct Call Button */}
                <a
                  href={`tel:${cochera.contacto?.telefono || '+541149973559'}`}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all border border-slate-200/80 hover:scale-[1.01] active:scale-[0.98]"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  <span>Llamar al {cochera.contacto?.telefono || '+54 11 4997-3559'}</span>
                </a>
              </div>

              {/* Email Contact Form */}
              <div className="pt-2 space-y-4 border-t border-slate-100">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-600" />
                  <span>Enviar Consulta por Email</span>
                </h3>

                {enviado ? (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-fadeIn">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-extrabold text-base text-emerald-900">¡Consulta Recibida!</h4>
                    <p className="text-xs text-emerald-700">Te responderemos a la brevedad.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        placeholder="Tu Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-xs font-semibold text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-xs font-semibold text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Teléfono / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="Ej: 11 3692 0920"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-xs font-semibold text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Mensaje</label>
                      <textarea
                        rows={3}
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-xs font-semibold text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 bg-slate-900 hover:bg-brand-600 text-white text-xs font-black rounded-xl transition-all duration-300 shadow-md hover:shadow-brand-600/30 hover:scale-[1.01] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Enviar Consulta por Email</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Related Cocheras */}
        {relacionadas.length > 0 && (
          <div className="pt-12 border-t border-slate-200 space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Otras publicaciones en {cochera.zona}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relacionadas.map((rel) => (
                <CocheraCard key={rel.id} cochera={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
