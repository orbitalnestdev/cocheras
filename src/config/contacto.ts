/**
 * Datos de contacto de la inmobiliaria y envío de los formularios.
 *
 * Los formularios de Contacto y Publicar no tenían destino: `handleSubmit` sólo
 * cambiaba un estado local, mostraba "¡Mensaje Recibido!" y el lead se perdía.
 * Hasta que exista un endpoint real, la consulta se entrega por WhatsApp con
 * todos los campos ya redactados.
 *
 * Para migrar a un endpoint (WP REST, Formspree, etc.) alcanza con reemplazar
 * el cuerpo de `enviarConsulta` — las páginas no necesitan cambios.
 */
export const CONTACTO = {
  whatsapp: '5491136920920',
  telefono: '+54 11 4997-3559',
  telefonoLink: '+541149973559',
  email: 'info@cocheras.com.ar',
  direccion: '11 de Septiembre 2957 2° «C», Núñez, CABA',
} as const;

/**
 * Perfiles de redes. Estaban apuntando a `facebook.com` e `instagram.com` a
 * secas — el ícono llevaba a la portada de la red, no al perfil de Ecocheras.
 * Vacío = el ícono no se muestra. Al cargar la URL real vuelve a aparecer solo.
 */
export const REDES = {
  facebook: '',
  instagram: '',
} as const;

export const enviarConsulta = (mensaje: string): void => {
  const url = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};
