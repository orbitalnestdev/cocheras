import { Cochera, FiltrosCochera, WPApiConfig } from '../types/cochera';
import { COCHERAS_SNAPSHOT } from '../data/cocherasSnapshot';

const DEFAULT_WP_URL = 'https://www.cocheras.com.ar/wp-json';

let apiConfig: WPApiConfig = {
  baseUrl: localStorage.getItem('cocheras_wp_url') || DEFAULT_WP_URL,
  useFallbackIfError: true,
  status: 'checking',
};

// In-memory cache for instant loads
let memoryCache: Cochera[] | null = null;
let activeFetchPromise: Promise<Cochera[]> | null = null;

export class WordPressService {
  static setBaseUrl(url: string) {
    let cleanUrl = url.trim();
    if (cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    if (!cleanUrl.endsWith('/wp-json')) {
      cleanUrl = `${cleanUrl}/wp-json`;
    }
    apiConfig.baseUrl = cleanUrl;
    localStorage.setItem('cocheras_wp_url', cleanUrl);
    memoryCache = null; // Clear cache on URL change
    sessionStorage.removeItem('cocheras_api_cache');
  }

  static getBaseUrl(): string {
    return apiConfig.baseUrl;
  }

  static getConfig(): WPApiConfig {
    return apiConfig;
  }

  /**
   * Prueba la conexión a la REST API del WordPress configurado
   */
  static async testConnection(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      apiConfig.status = 'checking';
      
      const wpPropiedadEndpoint = `${apiConfig.baseUrl}/wp/v2/propiedad?per_page=5&_embed`;
      const propRes = await fetch(wpPropiedadEndpoint);
      if (propRes.ok) {
        const data = await propRes.json();
        apiConfig.status = 'connected';
        apiConfig.lastChecked = new Date().toLocaleTimeString();
        return { success: true, message: `Conectado a WordPress RealHomes CPT ('propiedad'). ${data.length} propiedades encontradas en vivo.`, count: data.length };
      }

      throw new Error(`Servidor devolvió respuesta no válida`);
    } catch (err: any) {
      apiConfig.status = 'fallback';
      return {
        success: false,
        message: `No se pudo conectar a ${apiConfig.baseUrl}. Usando snapshot local seguro. (${err.message || 'Error de red'})`
      };
    }
  }

  /**
   * Obtiene la lista de cocheras conectándose a la API o usando fallback instantáneo con caché
   */
  static async getCocheras(filtros?: FiltrosCochera): Promise<Cochera[]> {
    // 1. Return from memory cache if available (0ms load)
    if (memoryCache && memoryCache.length > 0) {
      return this.applyLocalFilters(memoryCache, filtros);
    }

    // 2. Try loading from sessionStorage cache
    try {
      const stored = sessionStorage.getItem('cocheras_api_cache');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0 && !stored.includes('"tracklist"')) {
          memoryCache = parsed;
          apiConfig.status = 'connected';
          
          // Trigger background refresh silently
          this.fetchFromNetwork().then(freshData => {
            if (freshData && freshData.length > 0) {
              memoryCache = freshData;
              sessionStorage.setItem('cocheras_api_cache', JSON.stringify(freshData));
            }
          });

          return this.applyLocalFilters(memoryCache, filtros);
        }
      }
    } catch (e) {
      // sessionStorage error ignore
    }

    // 3. Fetch from network (or reuse pending promise to avoid redundant parallel requests)
    if (!activeFetchPromise) {
      activeFetchPromise = this.fetchFromNetwork();
    }

    const fetchedItems = await activeFetchPromise;
    activeFetchPromise = null;

    if (fetchedItems && fetchedItems.length > 0) {
      memoryCache = fetchedItems;
      try {
        sessionStorage.setItem('cocheras_api_cache', JSON.stringify(fetchedItems));
      } catch (e) {}
      return this.applyLocalFilters(memoryCache, filtros);
    }

    // 4. Fallback snapshot if network failed or timed out
    memoryCache = [...COCHERAS_SNAPSHOT];
    return this.applyLocalFilters(memoryCache, filtros);
  }

  private static async fetchFromNetwork(): Promise<Cochera[]> {
    let items: Cochera[] = [];

    // Controller with 20s timeout to allow WordPress REST API to process all 243 properties
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      // 1. Fetch Page 1 (first 100 properties)
      const page1Url = `${apiConfig.baseUrl}/wp/v2/propiedad?per_page=100&_embed&page=1`;
      const responseProp1 = await fetch(page1Url, {
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });

      if (responseProp1.ok) {
        const rawProps1 = await responseProp1.json();
        const totalPagesHeader = responseProp1.headers.get('X-WP-TotalPages');
        const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 3;

        let allRawProps = Array.isArray(rawProps1) ? [...rawProps1] : [];

        // Fetch remaining pages in parallel if totalPages > 1 (e.g. 243 properties across pages 1, 2, 3)
        if (totalPages > 1) {
          const pagePromises: Promise<any>[] = [];
          for (let p = 2; p <= Math.min(totalPages, 5); p++) {
            pagePromises.push(
              fetch(`${apiConfig.baseUrl}/wp/v2/propiedad?per_page=100&_embed&page=${p}`, {
                headers: { Accept: 'application/json' },
                signal: controller.signal
              }).then(r => (r.ok ? r.json() : [])).catch(() => [])
            );
          }

          const otherPagesResults = await Promise.all(pagePromises);
          otherPagesResults.forEach(pageItems => {
            if (Array.isArray(pageItems)) {
              allRawProps = allRawProps.concat(pageItems);
            }
          });
        }

        clearTimeout(timeoutId);

        if (allRawProps.length > 0) {
          const liveItems = allRawProps
            .map(item => this.mapRealHomesProperty(item))
            .filter((i): i is Cochera => i !== null);
          
          // Merge live items with snapshot items if missing
          const existingIds = new Set(liveItems.map(i => String(i.id)));
          const existingSlugs = new Set(liveItems.map(i => i.slug));

          const additionalItems = COCHERAS_SNAPSHOT.filter(
            snap => !existingIds.has(String(snap.id)) && !existingSlugs.has(snap.slug)
          );

          items = [...liveItems, ...additionalItems];
          apiConfig.status = 'connected';
        }
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Network fetch timeout or error, using cache/snapshot:', err);
      apiConfig.status = 'fallback';
    }

    if (items.length === 0) {
      items = [...COCHERAS_SNAPSHOT];
    }

    return items;
  }

  static async getCocheraBySlug(slug: string): Promise<Cochera | null> {
    if (!slug) return null;

    try {
      const endpoints = ['propiedad', 'property', 'cochera'];
      for (const cpt of endpoints) {
        // Try search by slug
        const slugUrl = `${apiConfig.baseUrl}/wp/v2/${cpt}?slug=${encodeURIComponent(slug)}&_embed`;
        const res = await fetch(slugUrl, { headers: { Accept: 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return this.mapRealHomesProperty(data[0]);
          }
        }

        // Try search by ID if numeric
        if (/^\d+$/.test(slug)) {
          const idUrl = `${apiConfig.baseUrl}/wp/v2/${cpt}/${slug}?_embed`;
          const resId = await fetch(idUrl, { headers: { Accept: 'application/json' } });
          if (resId.ok) {
            const itemData = await resId.json();
            if (itemData && itemData.id) {
              return this.mapRealHomesProperty(itemData);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error fetching single property by slug from API:', e);
    }

    const all = await this.getCocheras();
    const found = all.find(c => c.slug === slug || String(c.id) === slug);
    return found || all[0] || COCHERAS_SNAPSHOT[0];
  }

  /**
   * Mapeador para CPT RealHomes de WordPress (usado en cocheras.com.ar)
   */
  private static mapRealHomesProperty(raw: any): Cochera | null {
    try {
      const meta = raw.property_meta || {};
      const title = raw.title?.rendered ? cleanHtml(raw.title.rendered) : 'Cochera sin título';
      const content = raw.content?.rendered || raw.excerpt?.rendered || '';
      
      // Parse real price & currency matched with cocheras.com.ar
      const priceRaw = meta.REAL_HOMES_property_price || meta.precio || '';
      const parsedPrice = parseFloat(priceRaw);
      const hasNumericPrice = !isNaN(parsedPrice) && parsedPrice > 0;
      const precio = hasNumericPrice ? parsedPrice : 0;
      const consultarPrecio = !hasNumericPrice;

      const postfix = (meta.REAL_HOMES_property_price_postfix || '').toUpperCase();
      const prefix = (meta.REAL_HOMES_property_price_prefix || '').toUpperCase();
      const isUSD = postfix.includes('USD') || postfix.includes('U$S') || prefix.includes('USD') || prefix.includes('U$S') || (hasNumericPrice && precio > 0 && precio < 100000);
      const moneda: 'USD' | 'ARS' = isUSD ? 'USD' : 'ARS';

      // Extract Video URL if available in RealHomes meta or content
      let videoUrl: string | undefined = undefined;
      if (meta.REAL_HOMES_tour_video_url) {
        videoUrl = meta.REAL_HOMES_tour_video_url;
      } else if (Array.isArray(meta.inspiry_video_group) && meta.inspiry_video_group[0]?.inspiry_video_url) {
        videoUrl = meta.inspiry_video_group[0].inspiry_video_url;
      } else {
        const ytMatch = content.match(/(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)|vimeo\.com\/)([a-zA-Z0-9_-]+)/);
        if (ytMatch && ytMatch[1]) {
          if (ytMatch[0].includes('youtube') || ytMatch[0].includes('youtu.be')) {
            videoUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
          } else if (ytMatch[0].includes('vimeo')) {
            videoUrl = `https://player.vimeo.com/video/${ytMatch[1]}`;
          }
        }
      }

      // Extract Audio track URL (e.g. Radio Milenium interview mp3)
      let audioUrl: string | undefined = undefined;
      let audioTitle: string | undefined = undefined;

      const audioMatch = content.match(/["']src["']:\s*["'](https?:\/\/[^"']+\.mp3)["']/i) || content.match(/href=["'](https?:\/\/[^"']+\.mp3)["']/i);
      if (audioMatch && audioMatch[1]) {
        audioUrl = audioMatch[1];
        const titleMatch = content.match(/["']title["']:\s*["']([^"']+)["']/i);
        audioTitle = titleMatch && titleMatch[1] ? titleMatch[1].replace(/\\"/g, '"') : 'Entrevista Radial Esteban Sucari';
      }

      // Extract zona / ciudad from taxonomy terms
      let zona = 'CABA';
      let tipo: 'cubierta' | 'descubierta' = 'cubierta';
      let destacada = Boolean(meta.REAL_HOMES_featured === '1' || meta.destacada);

      if (raw._embedded && raw._embedded['wp:term']) {
        const termsArray = raw._embedded['wp:term'];
        for (const termGroup of termsArray) {
          if (Array.isArray(termGroup)) {
            for (const t of termGroup) {
              if (t.taxonomy === 'property-city' || t.taxonomy === 'ciudad-propiedad') {
                zona = t.name;
              }
              if (t.slug?.includes('descubierta')) {
                tipo = 'descubierta';
              }
            }
          }
        }
      }

      // Address
      const direccion = meta.REAL_HOMES_property_address || `${zona}, CABA`;

      // Extract Featured Image & Gallery Images
      let mainImg = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80';
      const imagenes: { url: string; alt: string; width?: number; height?: number }[] = [];

      if (raw._embedded && raw._embedded['wp:featuredmedia'] && raw._embedded['wp:featuredmedia'][0]) {
        const featUrl = raw._embedded['wp:featuredmedia'][0].source_url || raw._embedded['wp:featuredmedia'][0].media_details?.sizes?.full?.source_url;
        if (featUrl) {
          mainImg = featUrl;
          imagenes.push({ url: featUrl, alt: title, width: 1200, height: 900 });
        }
      }

      if (raw._embedded && Array.isArray(raw._embedded['wp:attachment'])) {
        raw._embedded['wp:attachment'].forEach((att: any) => {
          const attUrl = att.source_url || att.media_details?.sizes?.full?.source_url;
          if (attUrl && attUrl !== mainImg) {
            imagenes.push({
              url: attUrl,
              alt: att.title?.rendered ? cleanHtml(att.title.rendered) : title,
              width: att.media_details?.width || 1200,
              height: att.media_details?.height || 900
            });
          }
        });
      }

      // Extract <img> tags from content HTML if present
      const imgRegex = /src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp|gif))["']/gi;
      let imgMatch: RegExpExecArray | null;
      while ((imgMatch = imgRegex.exec(content)) !== null) {
        if (imgMatch[1] && !imagenes.some(i => i.url === imgMatch![1])) {
          imagenes.push({ url: imgMatch[1], alt: title, width: 1200, height: 900 });
        }
      }

      if (imagenes.length === 0) {
        imagenes.push({ url: mainImg, alt: title, width: 1200, height: 900 });
      }

      // Provide additional fallback photos for complete gallery view
      if (imagenes.length === 1) {
        imagenes.push({
          url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
          alt: 'Portón de acceso automatizado con tarjeta',
          width: 1200,
          height: 900
        });
        imagenes.push({
          url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
          alt: 'Rampa de maniobra e iluminación CCTV',
          width: 1200,
          height: 900
        });
      }

      // Dynamic features extraction from WordPress taxonomies
      const extractedFeatures: string[] = [];
      if (raw._embedded && raw._embedded['wp:term']) {
        const termsArray = raw._embedded['wp:term'];
        for (const termGroup of termsArray) {
          if (Array.isArray(termGroup)) {
            for (const t of termGroup) {
              if (
                t.taxonomy === 'property-feature' ||
                t.taxonomy === 'caracteristica-propiedad' ||
                t.taxonomy === 'property-type' ||
                t.taxonomy === 'property-status'
              ) {
                if (t.name && !extractedFeatures.includes(t.name)) {
                  extractedFeatures.push(cleanHtml(t.name));
                }
              }
            }
          }
        }
      }

      const features = extractedFeatures.length > 0 ? extractedFeatures : ['Cubierta', 'Seguridad 24hs', 'Portón automático'];

      // Geocoding Coordinates for Map (matching real CABA addresses)
      let lat = -34.6037;
      let lng = -58.3816;

      const rawLat = parseFloat(meta.REAL_HOMES_property_location?.latitude);
      const rawLng = parseFloat(meta.REAL_HOMES_property_location?.longitude);

      if (!isNaN(rawLat) && !isNaN(rawLng) && rawLat < -34.50 && rawLat > -34.70 && rawLng < -58.34 && rawLng > -58.55) {
        lat = rawLat;
        lng = rawLng;
      } else {
        const searchLocationText = `${direccion} ${title} ${zona}`.toLowerCase();
        const cabaNeighborhoodCoords: Record<string, { lat: number; lng: number }> = {
          'recoleta': { lat: -34.5889, lng: -58.3963 },
          'palermo': { lat: -34.5861, lng: -58.4252 },
          'belgrano': { lat: -34.5614, lng: -58.4560 },
          'monserrat': { lat: -34.6073, lng: -58.3842 },
          'microcentro': { lat: -34.6037, lng: -58.3816 },
          'puerto madero': { lat: -34.6118, lng: -58.3644 },
          'caballito': { lat: -34.6186, lng: -58.4428 },
          'nuñez': { lat: -34.5463, lng: -58.4632 },
          'nunez': { lat: -34.5463, lng: -58.4632 },
          'san telmo': { lat: -34.6212, lng: -58.3731 },
          'retiro': { lat: -34.5946, lng: -58.3776 },
          'almagro': { lat: -34.6083, lng: -58.4189 },
          'villa urquiza': { lat: -34.5717, lng: -58.4878 },
          'colegiales': { lat: -34.5746, lng: -58.4510 },
          'barracas': { lat: -34.6391, lng: -58.3789 },
          'balvanera': { lat: -34.6088, lng: -58.4019 },
          'once': { lat: -34.6088, lng: -58.4019 },
          'flores': { lat: -34.6279, lng: -58.4634 },
          'san nicolás': { lat: -34.6041, lng: -58.3812 },
          'san nicolas': { lat: -34.6041, lng: -58.3812 },
          'tribunales': { lat: -34.6035, lng: -58.3855 },
          'barrio norte': { lat: -34.5927, lng: -58.4061 },
          'parque patricios': { lat: -34.6358, lng: -58.4061 },
          'villa del parque': { lat: -34.6033, lng: -58.4908 },
          'villa luro': { lat: -34.6377, lng: -58.5034 },
          'villa pueyrredon': { lat: -34.5843, lng: -58.5008 },
          'villa crespo': { lat: -34.5982, lng: -58.4418 },
          'saavedra': { lat: -34.5512, lng: -58.4876 },
          'abasto': { lat: -34.6038, lng: -58.4108 },
          'congreso': { lat: -34.6117, lng: -58.3935 }
        };

        const matchedKey = Object.keys(cabaNeighborhoodCoords).find(k => searchLocationText.includes(k));
        const baseCoords = matchedKey ? cabaNeighborhoodCoords[matchedKey] : { lat: -34.6037, lng: -58.3816 };
        
        const hash = (Number(raw.id) || 1);
        lat = baseCoords.lat + (((hash % 11) - 5) * 0.0018);
        lng = baseCoords.lng + (((hash % 13) - 6) * 0.0018);
      }

      const cleanDesc = cleanHtml(content);

      return {
        id: raw.id,
        slug: raw.slug || `cochera-${raw.id}`,
        titulo: title,
        zona: zona,
        ciudad: 'CABA',
        direccion: direccion,
        precio: precio,
        consultarPrecio: consultarPrecio,
        moneda: moneda,
        videoUrl: videoUrl,
        audioUrl: audioUrl,
        audioTitle: audioTitle,
        periodo: 'mes',
        tipo: tipo,
        features: features,
        destacada: destacada,
        disponible: true,
        imagenDestacada: mainImg,
        imagenes: imagenes,
        descripcion: cleanDesc && cleanDesc.length > 20 ? cleanDesc : `Excelente oportunidad de cochera en ${zona}, CABA. Ubicación privilegiada con seguridad física y monitoreo las 24 horas. Acceso ágil con portón automático y amplias rampas de circulación.`,
        superficie: parseFloat(meta.REAL_HOMES_property_size) || 14,
        lat: lat,
        lng: lng,
        contacto: {
          telefono: '+54 11 4997-3559',
          whatsapp: '5491136920920',
          email: 'info@cocheras.com.ar'
        }
      };
    } catch (err) {
      console.warn('Error mapping RealHomes property:', err);
      return null;
    }
  }

  private static normalizeItem(item: any): Cochera | null {
    if (!item || !item.titulo) return null;
    return {
      id: item.id || Math.random(),
      slug: item.slug || 'cochera',
      titulo: item.titulo,
      zona: item.zona || 'CABA',
      ciudad: item.ciudad || 'CABA',
      direccion: item.direccion,
      precio: item.precio || 50000,
      moneda: item.moneda || 'ARS',
      periodo: item.periodo || 'mes',
      tipo: item.tipo || 'cubierta',
      features: item.features || ['Cubierta', 'Seguridad 24hs'],
      destacada: item.destacada || false,
      disponible: item.disponible !== false,
      imagenes: item.imagenes || [{ url: item.imagenDestacada, alt: item.titulo }],
      imagenDestacada: item.imagenDestacada || item.imagenes?.[0]?.url,
      descripcion: item.descripcion || '',
      lat: item.lat,
      lng: item.lng
    };
  }

  private static applyLocalFilters(items: Cochera[], filtros?: FiltrosCochera): Cochera[] {
    if (!filtros) return items;

    let result = [...items];

    if (filtros.zona && filtros.zona !== 'todas') {
      const zonaLower = filtros.zona.toLowerCase();
      result = result.filter(item => item.zona.toLowerCase().includes(zonaLower));
    }

    if (filtros.tipo && filtros.tipo !== 'todos') {
      result = result.filter(item => item.tipo === filtros.tipo);
    }

    if (filtros.destacada) {
      result = result.filter(item => item.destacada);
    }

    if (filtros.precioMax && filtros.precioMax > 0 && filtros.precioMax < 10000000) {
      result = result.filter(item => item.precio <= filtros.precioMax!);
    }

    if (filtros.busqueda && filtros.busqueda.trim() !== '') {
      const term = filtros.busqueda.toLowerCase();
      result = result.filter(item =>
        item.titulo.toLowerCase().includes(term) ||
        item.zona.toLowerCase().includes(term) ||
        item.descripcion.toLowerCase().includes(term)
      );
    }

    if (filtros.orden) {
      if (filtros.orden === 'precio_asc') {
        result.sort((a, b) => a.precio - b.precio);
      } else if (filtros.orden === 'precio_desc') {
        result.sort((a, b) => b.precio - a.precio);
      } else if (filtros.orden === 'recientes') {
        result.sort((a, b) => Number(b.id) - Number(a.id));
      }
    }

    return result;
  }
}

function cleanHtml(htmlStr: string): string {
  if (!htmlStr) return '';
  return htmlStr
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // remove script tags and inner JSON/code
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // remove style tags and inner CSS
    .replace(/\{"type":\s*"audio"[\s\S]*?\}/gi, '') // remove unparsed WP audio playlist JSON
    .replace(/\{"type":[\s\S]*?\}/gi, '') // remove any unparsed WP JSON objects
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // remove map iframe
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ') // normalize whitespace
    .trim();
}
