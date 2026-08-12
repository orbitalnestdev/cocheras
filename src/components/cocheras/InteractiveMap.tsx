import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Cochera } from '../../types/cochera';
import { MapPin, ArrowRight, MessageCircle, ExternalLink, Navigation, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InteractiveMapProps {
  cocheras: Cochera[];
  onSelectCochera?: (cochera: Cochera) => void;
}

// Custom SVG Pin Icon for Leaflet
const createCustomIcon = (isFeatured: boolean, isSelected: boolean) => {
  const pinColor = isSelected ? '#2563EB' : isFeatured ? '#F59E0B' : '#0F172A';
  const glowColor = isSelected ? 'rgba(37, 99, 235, 0.5)' : isFeatured ? 'rgba(245, 158, 11, 0.5)' : 'rgba(15, 23, 42, 0.35)';
  
  const svgHtml = `
    <div style="
      position: relative;
      width: 40px;
      height: 46px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      filter: drop-shadow(0 6px 14px ${glowColor});
    ">
      <div style="
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: ${pinColor};
        border: 2.5px solid #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      ">
        <div style="
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [40, 46],
    iconAnchor: [20, 46],
    popupAnchor: [0, -46],
  });
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ cocheras, onSelectCochera }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  
  const [selectedCochera, setSelectedCochera] = useState<Cochera | null>(cocheras[0] || null);
  const [activeZone, setActiveZone] = useState<string>('todas');

  const zonasDisponibles = ['todas', 'Palermo', 'Recoleta', 'Belgrano', 'Monserrat', 'Microcentro'];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered at Buenos Aires
      const map = L.map(mapContainerRef.current, {
        center: [-34.595, -58.410],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // Add Google Maps Vector tiles
      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>',
        maxZoom: 20,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Filter cocheras by zone if selected
    const filtered = activeZone === 'todas'
      ? cocheras
      : cocheras.filter(c => c.zona.toLowerCase().includes(activeZone.toLowerCase()));

    // Filter properties that have valid lat/lng coordinates for map rendering
    const withCoords = filtered.filter(item => item.lat !== undefined && item.lng !== undefined);

    if (withCoords.length > 0 && !selectedCochera) {
      setSelectedCochera(withCoords[0]);
    } else if (filtered.length > 0 && !selectedCochera) {
      setSelectedCochera(filtered[0]);
    }

    // Add markers only for properties with real coordinates
    withCoords.forEach((item) => {
      const lat = item.lat!;
      const lng = item.lng!;

      const isSelected = selectedCochera?.id === item.id;
      const icon = createCustomIcon(Boolean(item.destacada), isSelected);

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      // Popup Content
      const imgMarkup = item.imagenDestacada
        ? `<img src="${item.imagenDestacada}" style="width:100%; height:110px; object-fit:cover; border-radius:10px; margin-bottom:8px;" />`
        : `<div style="width:100%; height:80px; background:#F1F5F9; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#64748B; font-size:11px; font-weight:bold; margin-bottom:8px;">Sin foto</div>`;

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-900 font-sans';
      popupContent.innerHTML = `
        <div style="width: 220px; font-family: inherit;">
          ${imgMarkup}
          <h4 style="font-weight:800; font-size:13px; margin:0 0 4px 0; color:#0F172A; line-height:1.2;">${item.titulo}</h4>
          <p style="font-size:11px; color:#64748B; margin:0 0 8px 0;">📍 ${item.direccion || item.zona + ', CABA'}</p>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:800; font-size:14px; color:${item.consultarPrecio ? '#2563EB' : '#0F172A'};">
              ${item.consultarPrecio || item.precio === undefined || item.precio === 0 ? 'Consultar Precio' : item.moneda === 'USD' ? `U$S ${item.precio.toLocaleString('es-AR')}` : `$ ${item.precio.toLocaleString('es-AR')}`}
            </span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { offset: [0, -10] });

      marker.on('click', () => {
        setSelectedCochera(item);
        if (onSelectCochera) onSelectCochera(item);
      });

      markersRef.current[String(item.id)] = marker;
    });

    // Adjust view if zone filter changes and we have valid coords
    if (activeZone !== 'todas' && withCoords.length > 0) {
      const bounds = L.latLngBounds(withCoords.map(c => [c.lat!, c.lng!]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }

  }, [cocheras, activeZone, selectedCochera]);

  const handleZoneFilter = (zone: string) => {
    setActiveZone(zone);
    if (zone !== 'todas') {
      const match = cocheras.find(c => c.zona.toLowerCase().includes(zone.toLowerCase()));
      if (match) {
        setSelectedCochera(match);
        if (mapInstanceRef.current && match.lat && match.lng) {
          mapInstanceRef.current.setView([match.lat, match.lng], 14, { animate: true });
        }
      }
    } else {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([-34.595, -58.410], 13, { animate: true });
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
      
      {/* Map Filter Tabs Top Bar */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white leading-tight">Mapa Interactivo de Cocheras en CABA</h3>
            <p className="text-[11px] text-muted-dark">Ubicación real de cada propiedad en Buenos Aires</p>
          </div>
        </div>

        {/* Zone Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {zonasDisponibles.map((zone) => (
            <button
              key={zone}
              onClick={() => handleZoneFilter(zone)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeZone === zone
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {zone === 'todas' ? '📍 Todas las Zonas' : zone}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Body Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 relative h-[380px] sm:h-[480px] lg:h-full w-full z-0">
          <div ref={mapContainerRef} className="w-full h-full" />
          
          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>{cocheras.length} cocheras en mapa</span>
          </div>
        </div>

        {/* Selected Cochera Lead Capture Card (Right Side) */}
        <div className="lg:col-span-4 p-5 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-4">
          
          {selectedCochera ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-md bg-slate-200">
                  <img
                    src={selectedCochera.imagenDestacada}
                    alt={selectedCochera.titulo}
                    className="w-full h-full object-cover"
                  />
                  {selectedCochera.destacada && (
                    <span className="absolute top-3 left-3 bg-brand-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md">
                      DESTACADA
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    {selectedCochera.tipo}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-lg leading-snug">
                    {selectedCochera.titulo}
                  </h4>
                  <div className="flex items-center gap-1 text-slate-600 text-xs font-medium mt-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                    <span>{selectedCochera.direccion || `${selectedCochera.zona}, CABA`}</span>
                  </div>
                </div>

                {/* Features chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedCochera.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">
                      ✓ {f}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Valor Publicado</span>
                    <span className="text-2xl font-extrabold text-brand-600 tracking-tight">
                      {selectedCochera.consultarPrecio || !selectedCochera.precio || selectedCochera.precio === 0
                        ? 'Consultar Precio'
                        : selectedCochera.moneda === 'USD'
                          ? `U$S ${selectedCochera.precio.toLocaleString('es-AR')}`
                          : `$ ${selectedCochera.precio.toLocaleString('es-AR')}`}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Disponible hoy
                  </span>
                </div>
              </div>

              {/* Lead Capture Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/${selectedCochera.contacto?.whatsapp || '5491149973559'}?text=${encodeURIComponent(
                    `Hola! Estoy interesado en la cochera "${selectedCochera.titulo}" (${selectedCochera.consultarPrecio || !selectedCochera.precio ? 'Consultar Precio' : `$${selectedCochera.precio.toLocaleString('es-AR')}`}) ubicada en ${selectedCochera.zona} que vi en el mapa.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar por WhatsApp ahora</span>
                </a>

                <Link
                  to={`/cocheras/${selectedCochera.slug}`}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Ver Ficha Completa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2 text-slate-400">
              <MapPin className="w-10 h-10 text-slate-300" />
              <p className="text-xs font-semibold">Seleccioná un marcador en el mapa para ver la ficha y consultar disponibilidad.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
