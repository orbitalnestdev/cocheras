import { z } from 'zod';

export type TipoCochera = 'cubierta' | 'descubierta';
export type Moneda = 'ARS' | 'USD';
export type Periodo = 'mes' | 'dia' | 'hora';

export interface ImagenCochera {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Cochera {
  id: number | string;
  slug: string;
  titulo: string;
  zona: string;
  ciudad: string;
  direccion?: string;
  precio?: number;
  consultarPrecio: boolean;
  moneda: Moneda;
  periodo: Periodo;
  tipo: TipoCochera;
  tipoAcceso?: string;
  features: string[];
  destacada: boolean;
  disponible: boolean;
  imagenes: ImagenCochera[];
  imagenDestacada?: string;
  descripcion: string;
  ambientes?: number;
  banos?: number;
  superficie?: number; // m²
  lat?: number;
  lng?: number;
  videoUrl?: string;
  audioUrl?: string;
  audioTitle?: string;
  statusProperty?: string; // 'En Alquiler' | 'En Venta' | 'Emprendimiento'
  codigoRef?: string;
  fechaPublicacion?: string;
  contacto?: {
    telefono: string;
    whatsapp: string;
    email: string;
  };
}

export interface FiltrosCochera {
  zona?: string;
  tipo?: string;
  precioMin?: number;
  precioMax?: number;
  destacada?: boolean;
  busqueda?: string;
  orden?: 'precio_asc' | 'precio_desc' | 'recientes';
}

export interface WPApiConfig {
  baseUrl: string;
  useFallbackIfError: boolean;
  status: 'connected' | 'error' | 'fallback' | 'checking';
  totalCount?: number;
  lastChecked?: string;
}

// Zod schema for validating WP API response items safely without invention
export const CocheraZodSchema = z.object({
  id: z.union([z.number(), z.string()]),
  slug: z.string(),
  titulo: z.string(),
  zona: z.string().default('CABA'),
  ciudad: z.string().default('CABA'),
  direccion: z.string().optional(),
  precio: z.number().optional(),
  consultarPrecio: z.boolean().default(true),
  moneda: z.enum(['ARS', 'USD']).default('ARS'),
  periodo: z.enum(['mes', 'dia', 'hora']).default('mes'),
  tipo: z.enum(['cubierta', 'descubierta']).default('cubierta'),
  features: z.array(z.string()).default([]),
  destacada: z.boolean().default(false),
  disponible: z.boolean().default(true),
  imagenes: z.array(z.object({
    url: z.string(),
    alt: z.string().default('Cochera'),
    width: z.number().optional(),
    height: z.number().optional()
  })).default([]),
  imagenDestacada: z.string().optional(),
  descripcion: z.string().default(''),
  superficie: z.number().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  statusProperty: z.string().optional(),
  codigoRef: z.string().optional(),
  fechaPublicacion: z.string().optional()
});
