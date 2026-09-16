import { useEffect } from 'react';

/**
 * Chat de Cliengo (burbuja flotante abajo a la derecha).
 *
 * La URL es la misma cuenta que ya usa el WordPress actual de cocheras.com.ar
 * (se tomó del snippet que ese sitio inyecta: plugin "cliengo" 3.0.5). Como no
 * es un dato secreto — está en el HTML público del sitio — va como valor por
 * defecto y el chat funciona sin configurar nada.
 *
 * VITE_CLIENGO_SCRIPT permite cambiarla; el valor "off" lo desactiva.
 */
const CUENTA_ACTUAL = 'https://s.cliengo.com/weboptimizer/5a47d41ee4b04b0328d172e4/5a47d425e4b04b0328d172f0.js';
const configurada: string | undefined = import.meta.env.VITE_CLIENGO_SCRIPT;
const SCRIPT_URL = configurada === 'off' ? '' : configurada || CUENTA_ACTUAL;

export const cliengoActivo = SCRIPT_URL !== '';

export const Cliengo = () => {
  useEffect(() => {
    if (!SCRIPT_URL || document.querySelector('script[data-cliengo]')) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = SCRIPT_URL;
    script.dataset.cliengo = '1';
    document.body.appendChild(script);
  }, []);

  return null;
};
