import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import { Cochera } from '../../types/cochera';
import { MapPin, ArrowRight, MessageCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InteractiveMapProps {
  cocheras: Cochera[];
  onSelectCochera?: (cochera: Cochera) => void;
  loading?: boolean;
  error?: string | null;
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

// Burbuja de agrupación. Sin esto, las 243 chinches se superponen y el mapa
// se ve como una mancha negra sobre Palermo/Recoleta.
const createClusterIcon = (cluster: L.MarkerCluster) => {
  const count = cluster.getChildCount();
  const hasFeatured = cluster.getAllChildMarkers().some((m: any) => m.destacada);
  const size = count < 10 ? 40 : count < 50 ? 48 : 58;
  const bg = hasFeatured ? '#F59E0B' : '#0F172A';
  const glow = hasFeatured ? 'rgba(245,158,11,0.45)' : 'rgba(15,23,42,0.4)';
  const fg = hasFeatured ? '#0F172A' : '#FFFFFF';

  return L.divIcon({
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        background:${bg};
        border:3px solid #FFFFFF;
        color:${fg};
        display:flex;
        align-items:center;
        justify-content:center;
        font-weight:800;
        font-size:${count < 100 ? 14 : 12}px;
        letter-spacing:-0.02em;
        box-shadow:0 6px 18px ${glow};
      ">${count}</div>
    `,
    className: 'custom-cluster-marker',
    iconSize: L.point(size, size),
  });
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ cocheras, onSelectCochera, loading = false, error = null }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  // Id del marcador resaltado. Vive en un ref para que la selección no forme
  // parte de las dependencias del efecto que construye los marcadores.
  const selectedIdRef = useRef<string | null>(null);
  const onSelectRef = useRef(onSelectCochera);
  onSelectRef.current = onSelectCochera;
  
  const [selectedCochera, setSelectedCochera] = useState<Cochera | null>(cocheras[0] || null);
  const [activeZone, setActiveZone] = useState<string>('todas');

  const zonasDisponibles = ['todas', 'Palermo', 'Recoleta', 'Belgrano', 'Monserrat', 'Microcentro'];

  // Al desmontar hay que destruir la instancia de Leaflet: si no, quedan
  // colgados sus listeners globales (resize, focus) por cada visita a la home.
  useEffect(() => {
    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      clusterRef.current = null;
      markersRef.current = {};
      selectedIdRef.current = null;
    };
  }, []);

  // Efecto 1 — construye los marcadores.
  // Deliberadamente NO depende de `selectedCochera`: si dependiera, cada clic en
  // un pin borraría y recrearía los 243 marcadores (y volvería a hacer fitBounds,
  // peleándole el encuadre al usuario).
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

    if (!clusterRef.current) {
      clusterRef.current = L.markerClusterGroup({
        iconCreateFunction: createClusterIcon,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 55,
        disableClusteringAtZoom: 17,
      });
      map.addLayer(clusterRef.current);
    }

    // Clear existing markers
    clusterRef.current.clearLayers();
    markersRef.current = {};

    // Filter cocheras by zone if selected
    const filtered = activeZone === 'todas'
      ? cocheras
      : cocheras.filter(c => c.zona.toLowerCase().includes(activeZone.toLowerCase()));

    // Filter properties that have valid lat/lng coordinates for map rendering
    const withCoords = filtered.filter(item => item.lat !== undefined && item.lng !== undefined);

    // Add markers only for properties with real coordinates
    withCoords.forEach((item) => {
      const lat = item.lat!;
      const lng = item.lng!;
      const id = String(item.id);

      const icon = createCustomIcon(Boolean(item.destacada), selectedIdRef.current === id);

      const marker = L.marker([lat, lng], { icon });
      (marker as any).destacada = Boolean(item.destacada);
      clusterRef.current!.addLayer(marker);

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
        if (onSelectRef.current) onSelectRef.current(item);
      });

      markersRef.current[id] = marker;
    });

    // Adjust view if zone filter changes and we have valid coords
    if (activeZone !== 'todas' && withCoords.length > 0) {
      const bounds = L.latLngBounds(withCoords.map(c => [c.lat!, c.lng!]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }

  }, [cocheras, activeZone]);

  // Efecto 2 — al llegar los datos, deja seleccionada la primera ficha si todavía
  // no hay ninguna (o si la que había ya no existe en el catálogo).
  useEffect(() => {
    if (cocheras.length === 0) return;
    setSelectedCochera((prev) => {
      if (prev && cocheras.some(c => c.id === prev.id)) return prev;
      return cocheras.find(c => c.lat !== undefined && c.lng !== undefined) || cocheras[0];
    });
  }, [cocheras]);

  // Efecto 3 — repinta únicamente los dos marcadores afectados por el cambio de
  // selección, en lugar de reconstruir la capa entera.
  useEffect(() => {
    const nextId = selectedCochera ? String(selectedCochera.id) : null;
    const prevId = selectedIdRef.current;
    if (prevId === nextId) return;

    if (prevId && markersRef.current[prevId]) {
      const prevItem = cocheras.find(c => String(c.id) === prevId);
      if (prevItem) {
        markersRef.current[prevId].setIcon(createCustomIcon(Boolean(prevItem.destacada), false));
      }
    }

    if (nextId && selectedCochera && markersRef.current[nextId]) {
      markersRef.current[nextId].setIcon(createCustomIcon(Boolean(selectedCochera.destacada), true));
    }

    selectedIdRef.current = nextId;
  }, [selectedCochera, cocheras]);

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
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 ring-1 ring-white/20 shadow-[0_28px_70px_-15px_rgba(2,6,23,0.65)]">
      
      {/* Map Filter Tabs Top Bar */}
      <div className="p-3 sm:p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white leading-tight">Mapa Interactivo de Cocheras en CABA</h2>
            <p className="text-[11px] text-muted-dark">Ubicación real de cada propiedad en Buenos Aires</p>
          </div>
        </div>

        {/* Zone Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {zonasDisponibles.map((zone) => (
            <button
              key={zone}
              onClick={() => handleZoneFilter(zone)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
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
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 relative h-[340px] sm:h-[420px] lg:h-full w-full z-0">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Estado de carga / error: sin esto el mapa quedaba mudo y vacío */}
          {(loading || error || cocheras.length === 0) && (
            <div className="absolute inset-0 z-[500] bg-slate-100/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center px-6">
              {error ? (
                <>
                  <AlertTriangle className="w-9 h-9 text-red-500" />
                  <p className="text-sm font-bold text-slate-800">No pudimos cargar el mapa</p>
                  <p className="text-xs text-slate-500 max-w-xs">{error}</p>
                </>
              ) : loading ? (
                <>
                  <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
                  <p className="text-xs font-semibold text-slate-600">Ubicando las cocheras publicadas…</p>
                </>
              ) : (
                <>
                  <MapPin className="w-9 h-9 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-500">No hay cocheras publicadas para mostrar en el mapa.</p>
                </>
              )}
            </div>
          )}

          {/* Map Overlay Badge */}
          {!loading && !error && cocheras.length > 0 && (
            <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{cocheras.length} cocheras en mapa</span>
            </div>
          )}
        </div>

        {/* Selected Cochera Lead Capture Card (Right Side) */}
        <div className="lg:col-span-4 p-5 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-4">
          
          {selectedCochera ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="relative h-44 sm:h-56 lg:h-auto lg:aspect-[16/10] rounded-2xl overflow-hidden shadow-md bg-slate-200">
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
                  {selectedCochera.tipoPropiedad.slice(0, 1).map((t, i) => (
                    <span key={`t-${i}`} className="px-2 py-0.5 rounded-md bg-brand-50 border border-brand-200/70 text-[11px] font-bold text-brand-700">
                      {t}
                    </span>
                  ))}
                  {selectedCochera.features.slice(0, 2).map((f, i) => (
                    <span key={`f-${i}`} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">
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
                  className="btn btn-whatsapp btn-block"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar por WhatsApp ahora</span>
                </a>

                <Link
                  to={`/cocheras/${selectedCochera.slug}`}
                  className="btn btn-outline btn-block py-2.5"
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
