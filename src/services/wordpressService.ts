import { Cochera, FiltrosCochera, WPApiConfig } from '../types/cochera';

const DEFAULT_WP_URL = 'https://www.cocheras.com.ar/wp-json';

let apiConfig: WPApiConfig = {
  baseUrl: localStorage.getItem('cocheras_wp_url') || DEFAULT_WP_URL,
  useFallbackIfError: false, // Strict: no fake data fallback
  status: 'checking',
  totalCount: 0
};

// In-memory cache for instant re-renders
let memoryCache: Cochera[] | null = null;
let activeFetchPromise: Promise<Cochera[]> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

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
    memoryCache = null;
    cacheTimestamp = 0;
    try {
      sessionStorage.removeItem('cocheras_api_cache_v2');
    } catch (e) {}
  }

  static getBaseUrl(): string {
    return apiConfig.baseUrl;
  }

  static getConfig(): WPApiConfig {
    return apiConfig;
  }

  /**
   * Tests connection to WordPress REST API
   */
  static async testConnection(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      apiConfig.status = 'checking';
      
      const wpPropiedadEndpoint = `${apiConfig.baseUrl}/wp/v2/propiedad?per_page=1&_embed`;
      const propRes = await fetch(wpPropiedadEndpoint);
      if (propRes.ok) {
        const totalHeader = propRes.headers.get('X-WP-Total');
        const count = totalHeader ? parseInt(totalHeader, 10) : 0;
        apiConfig.status = 'connected';
        apiConfig.totalCount = count;
        apiConfig.lastChecked = new Date().toLocaleTimeString();
        return {
          success: true,
          message: `Conectado exitosamente a WordPress REST API. ${count} propiedades publicadas en vivo.`,
          count: count
        };
      }
      throw new Error(`HTTP ${propRes.status}: Servidor devolvió respuesta no válida`);
    } catch (err: any) {
      apiConfig.status = 'error';
      return {
        success: false,
        message: `Error de conexión con ${apiConfig.baseUrl}: ${err.message || 'Error de red'}`
      };
    }
  }

  /**
   * Fetches 100% of live properties from WordPress with dynamic pagination
   */
  static async getCocheras(filtros?: FiltrosCochera): Promise<Cochera[]> {
    const now = Date.now();

    // 1. Return from memory cache if fresh (< 10 mins)
    if (memoryCache && (now - cacheTimestamp < CACHE_TTL_MS)) {
      return this.applyLocalFilters(memoryCache, filtros);
    }

    // 2. Try loading from sessionStorage cache
    try {
      const stored = sessionStorage.getItem('cocheras_api_cache_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryCache = parsed;
          apiConfig.status = 'connected';
          apiConfig.totalCount = parsed.length;
          
          // Revalidate in background silently
          this.fetchFromNetwork().then(freshData => {
            if (freshData && freshData.length > 0) {
              memoryCache = freshData;
              cacheTimestamp = Date.now();
              sessionStorage.setItem('cocheras_api_cache_v2', JSON.stringify(freshData));
            }
          });

          return this.applyLocalFilters(memoryCache, filtros);
        }
      }
    } catch (e) {}

    // 3. Fetch from network (or reuse pending promise to avoid redundant parallel requests)
    if (!activeFetchPromise) {
      activeFetchPromise = this.fetchFromNetwork();
    }

    const fetchedItems = await activeFetchPromise;
    activeFetchPromise = null;

    if (fetchedItems && fetchedItems.length > 0) {
      memoryCache = fetchedItems;
      cacheTimestamp = Date.now();
      try {
        sessionStorage.setItem('cocheras_api_cache_v2', JSON.stringify(fetchedItems));
      } catch (e) {}
      return this.applyLocalFilters(memoryCache, filtros);
    }

    // 4. Return empty array if network fetch fails (Strict zero fake data policy)
    apiConfig.status = 'error';
    return [];
  }

  /**
   * Fetches ALL pages from WordPress REST API dynamically (no page caps)
   */
  private static async fetchFromNetwork(): Promise<Cochera[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      // Fetch Page 1 to inspect X-WP-TotalPages and X-WP-Total
      const page1Url = `${apiConfig.baseUrl}/wp/v2/propiedad?per_page=100&_embed&page=1`;
      const responseProp1 = await fetch(page1Url, {
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });

      if (!responseProp1.ok) {
        throw new Error(`HTTP ${responseProp1.status} en obtención de página 1`);
      }

      const totalHeader = responseProp1.headers.get('X-WP-Total');
      const totalPagesHeader = responseProp1.headers.get('X-WP-TotalPages');

      const totalCount = totalHeader ? parseInt(totalHeader, 10) : 0;
      const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;

      apiConfig.totalCount = totalCount;

      const rawProps1 = await responseProp1.json();
      let allRawProps = Array.isArray(rawProps1) ? [...rawProps1] : [];

      // Fetch remaining pages dynamically if totalPages > 1 (bringing 100% of properties)
      if (totalPages > 1) {
        const pagePromises: Promise<any>[] = [];
        for (let p = 2; p <= totalPages; p++) {
          pagePromises.push(
            fetch(`${apiConfig.baseUrl}/wp/v2/propiedad?per_page=100&_embed&page=${p}`, {
              headers: { Accept: 'application/json' },
              signal: controller.signal
            })
              .then(r => (r.ok ? r.json() : []))
              .catch(() => [])
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

      const liveItems = allRawProps
        .map(item => this.mapRealHomesProperty(item))
        .filter((i): i is Cochera => i !== null);

      apiConfig.status = 'connected';
      apiConfig.totalCount = liveItems.length;

      return liveItems;
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Error fetching live properties from WordPress REST API:', err);
      apiConfig.status = 'error';
      return [];
    }
  }

  /**
   * Fetches single property by slug or numeric ID
   */
  static async getCocheraBySlug(slug: string): Promise<Cochera | null> {
    if (!slug) return null;

    try {
      const endpoints = ['propiedad', 'property', 'cochera'];
      for (const cpt of endpoints) {
        const slugUrl = `${apiConfig.baseUrl}/wp/v2/${cpt}?slug=${encodeURIComponent(slug)}&_embed`;
        const res = await fetch(slugUrl, { headers: { Accept: 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return this.mapRealHomesProperty(data[0]);
          }
        }

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
      console.warn('Error fetching single property by slug:', e);
    }

    const all = await this.getCocheras();
    return all.find(c => c.slug === slug || String(c.id) === slug) || null;
  }

  /**
   * Normalizer from raw WordPress REST JSON to internal Cochera model
   * STRICT ZERO INVENTION POLICY
   */
  private static mapRealHomesProperty(raw: any): Cochera | null {
    try {
      if (!raw || !raw.id) return null;

      const meta = raw.property_meta || {};
      const title = raw.title?.rendered ? cleanHtml(raw.title.rendered) : `Propiedad #${raw.id}`;
      const content = raw.content?.rendered || raw.excerpt?.rendered || '';
      
      // Parse real price & currency
      const priceRaw = meta.REAL_HOMES_property_price || meta.precio || '';
      const parsedPrice = parseFloat(priceRaw);
      const hasNumericPrice = !isNaN(parsedPrice) && parsedPrice > 0;
      const precio = hasNumericPrice ? parsedPrice : undefined;
      const consultarPrecio = !hasNumericPrice;

      // Currency logic: Check ONLY real prefix/postfix (STRICT, NO < 100000 GUESSING)
      const postfix = (meta.REAL_HOMES_property_price_postfix || '').toUpperCase();
      const prefix = (meta.REAL_HOMES_property_price_prefix || '').toUpperCase();
      const isUSD = postfix.includes('USD') || postfix.includes('U$S') || prefix.includes('USD') || prefix.includes('U$S');
      const moneda: 'USD' | 'ARS' = isUSD ? 'USD' : 'ARS';

      // Video Tour URL
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

      // Audio Track URL
      let audioUrl: string | undefined = undefined;
      let audioTitle: string | undefined = undefined;
      const audioMatch = content.match(/["']src["']:\s*["'](https?:\/\/[^"']+\.mp3)["']/i) || content.match(/href=["'](https?:\/\/[^"']+\.mp3)["']/i);
      if (audioMatch && audioMatch[1]) {
        audioUrl = audioMatch[1];
        const titleMatch = content.match(/["']title["']:\s*["']([^"']+)["']/i);
        audioTitle = titleMatch && titleMatch[1] ? titleMatch[1].replace(/\\"/g, '"') : 'Entrevista Radial';
      }

      // Taxonomies: zona, tipo, features, statusProperty
      let zona = 'CABA';
      let tipo: 'cubierta' | 'descubierta' = 'cubierta';
      let statusProperty: string | undefined = undefined;
      const extractedFeatures: string[] = [];

      if (raw._embedded && raw._embedded['wp:term']) {
        const termsArray = raw._embedded['wp:term'];
        for (const termGroup of termsArray) {
          if (Array.isArray(termGroup)) {
            for (const t of termGroup) {
              if (t.taxonomy === 'property-city' || t.taxonomy === 'ciudad-propiedad') {
                zona = t.name;
              }
              if (t.taxonomy === 'property-status' || t.taxonomy === 'estado-propiedad') {
                statusProperty = t.name;
              }
              if (t.slug?.includes('descubierta')) {
                tipo = 'descubierta';
              }
              if (
                t.taxonomy === 'property-feature' ||
                t.taxonomy === 'caracteristica-propiedad' ||
                t.taxonomy === 'property-type'
              ) {
                if (t.name && !extractedFeatures.includes(t.name)) {
                  extractedFeatures.push(cleanHtml(t.name));
                }
              }
            }
          }
        }
      }

      // Address: Only from real WP meta or zona
      const direccion = meta.REAL_HOMES_property_address || undefined;

      // Extract Images: ZERO Unsplash Fallbacks
      let mainImg: string | undefined = undefined;
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

      // Extract inline <img> tags from content
      const imgRegex = /src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp|gif))["']/gi;
      let imgMatch: RegExpExecArray | null;
      while ((imgMatch = imgRegex.exec(content)) !== null) {
        if (imgMatch[1] && !imagenes.some(i => i.url === imgMatch![1])) {
          imagenes.push({ url: imgMatch[1], alt: title, width: 1200, height: 900 });
          if (!mainImg) mainImg = imgMatch[1];
        }
      }

      // Geocoding Coordinates: Only real CABA/GBA bounds, NO synthetic hash offsets
      let lat: number | undefined = undefined;
      let lng: number | undefined = undefined;

      const rawLat = parseFloat(meta.REAL_HOMES_property_location?.latitude);
      const rawLng = parseFloat(meta.REAL_HOMES_property_location?.longitude);

      if (!isNaN(rawLat) && !isNaN(rawLng) && rawLat < -34.30 && rawLat > -34.90 && rawLng < -58.10 && rawLng > -58.90) {
        lat = rawLat;
        lng = rawLng;
      }

      const cleanDesc = cleanHtml(content);
      const destacada = Boolean(meta.REAL_HOMES_featured === '1' || meta.destacada);

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
        features: extractedFeatures,
        destacada: destacada,
        disponible: true,
        imagenDestacada: mainImg,
        imagenes: imagenes,
        descripcion: cleanDesc,
        superficie: parseFloat(meta.REAL_HOMES_property_size) || undefined,
        lat: lat,
        lng: lng,
        statusProperty: statusProperty,
        codigoRef: meta.REAL_HOMES_property_id || undefined,
        fechaPublicacion: raw.date ? new Date(raw.date).toLocaleDateString('es-AR') : undefined,
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

  /**
   * Applies local filter rules on Cochera array
   */
  private static applyLocalFilters(items: Cochera[], filtros?: FiltrosCochera): Cochera[] {
    if (!filtros) return items;

    let result = [...items];

    if (filtros.zona && filtros.zona !== 'todas') {
      const z = filtros.zona.toLowerCase();
      result = result.filter(c =>
        c.zona.toLowerCase().includes(z) ||
        (c.direccion && c.direccion.toLowerCase().includes(z)) ||
        c.titulo.toLowerCase().includes(z)
      );
    }

    if (filtros.tipo && filtros.tipo !== 'todos') {
      result = result.filter(c => c.tipo === filtros.tipo);
    }

    if (filtros.destacada) {
      result = result.filter(c => c.destacada);
    }

    if (filtros.busqueda) {
      const q = filtros.busqueda.toLowerCase();
      result = result.filter(c =>
        c.titulo.toLowerCase().includes(q) ||
        c.zona.toLowerCase().includes(q) ||
        (c.direccion && c.direccion.toLowerCase().includes(q)) ||
        c.descripcion.toLowerCase().includes(q)
      );
    }

    if (filtros.precioMin !== undefined && filtros.precioMin > 0) {
      result = result.filter(c => c.precio !== undefined && c.precio >= filtros.precioMin!);
    }

    if (filtros.precioMax !== undefined && filtros.precioMax > 0) {
      result = result.filter(c => c.precio !== undefined && c.precio <= filtros.precioMax!);
    }

    if (filtros.orden) {
      if (filtros.orden === 'precio_asc') {
        result.sort((a, b) => (a.precio || 0) - (b.precio || 0));
      } else if (filtros.orden === 'precio_desc') {
        result.sort((a, b) => (b.precio || 0) - (a.precio || 0));
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
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/\{"type":\s*"audio"[\s\S]*?\}/gi, '')
    .replace(/\{"type":[\s\S]*?\}/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
