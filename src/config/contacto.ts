/**
 * Datos de contacto de la inmobiliaria y envío de los formularios.
 *
 * Los formularios de Contacto, Publicar y la ficha de propiedad no tenían
 * destino: mostraban "¡Mensaje recibido!" y el lead se perdía. Ahora cada uno
 * ofrece dos caminos, elegidos por el usuario:
 *
 *  - `enviarPorEmail`: POST a WordPress (plugin `wp-cocheras-consultas.php`),
 *    que reenvía la consulta por correo. No requiere tener WhatsApp.
 *  - `abrirWhatsApp`: abre WhatsApp con el mensaje ya redactado.
 */
export const CONTACTO = {
  whatsapp: '5491136920920',
  // La única línea de contacto es el WhatsApp comercial. El fijo que había
  // era el teléfono personal del fundador y se pidió sacarlo.
  telefonoVisible: '11 3692 0920',
  telefonoLink: '+5491136920920',
  email: 'info@cocheras.com.ar',
  direccion: '11 de Septiembre 2957 2° «C», Núñez, CABA',
} as const;

/**
 * Perfiles de redes. Vacío = el ícono no se muestra. Al cargar la URL real
 * vuelve a aparecer solo.
 */
export const REDES = {
  facebook: '',
  instagram: '',
} as const;

export interface DatosConsulta {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  /** De qué formulario sale: "Contacto", "Publicar", "Ficha de propiedad". */
  origen: string;
  /** Título o código de la publicación consultada, si aplica. */
  referencia?: string;
  /** Honeypot anti-spam: el usuario nunca lo ve, un bot lo completa. */
  website?: string;
}

export type ResultadoEnvio = { ok: true } | { ok: false; motivo: string };

const API_BASE = (import.meta.env.VITE_WP_API_BASE || 'https://www.cocheras.com.ar/wp-json').replace(/\/+$/, '');

export const enviarPorEmail = async (datos: DatosConsulta): Promise<ResultadoEnvio> => {
  try {
    const res = await fetch(`${API_BASE}/cocheras/v1/consulta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(datos),
    });
    if (res.ok) return { ok: true };

    // 404 = el plugin de WordPress todavía no está instalado: el texto crudo de
    // WP ("No se ha encontrado ninguna ruta…") no le dice nada al usuario.
    if (res.status === 404) {
      return { ok: false, motivo: 'El envío por email todavía no está habilitado. Podés escribirnos por WhatsApp o al correo.' };
    }
    // 400 / 429 / 500: el plugin ya responde en castellano y con contexto.
    const cuerpo = await res.json().catch(() => null);
    return { ok: false, motivo: cuerpo?.message || `No pudimos enviar el mensaje (error ${res.status}).` };
  } catch {
    return { ok: false, motivo: 'No pudimos conectar con el servidor.' };
  }
};

/** Redacta el mismo contenido de la consulta como texto para WhatsApp. */
export const redactarParaWhatsApp = (datos: DatosConsulta): string =>
  [
    `Hola! Te escribo desde cocheras.com.ar (${datos.origen})`,
    '',
    `Nombre: ${datos.nombre}`,
    `Email: ${datos.email}`,
    ...(datos.telefono ? [`Teléfono: ${datos.telefono}`] : []),
    ...(datos.referencia ? [`Referencia: ${datos.referencia}`] : []),
    '',
    datos.mensaje,
  ].join('\n');

export const abrirWhatsApp = (mensaje: string): void => {
  const url = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/** @deprecated usar abrirWhatsApp — se mantiene para no romper imports viejos. */
export const enviarConsulta = abrirWhatsApp;
