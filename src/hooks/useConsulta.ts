import React, { useCallback, useState } from 'react';
import { DatosConsulta, abrirWhatsApp, enviarPorEmail, redactarParaWhatsApp } from '../config/contacto';

export type EstadoConsulta = 'idle' | 'enviando' | 'email_ok' | 'whatsapp_ok' | 'error';

/**
 * Estado y acciones compartidos por los tres formularios de consulta.
 * Cada página arma sus `DatosConsulta` y decide qué mostrar en cada estado.
 */
export const useConsulta = () => {
  const [estado, setEstado] = useState<EstadoConsulta>('idle');
  const [error, setError] = useState<string | null>(null);

  const enviarEmail = useCallback(async (datos: DatosConsulta) => {
    setEstado('enviando');
    setError(null);
    const r = await enviarPorEmail(datos);
    if (r.ok) {
      setEstado('email_ok');
    } else {
      setError(r.motivo);
      setEstado('error');
    }
  }, []);

  const enviarWhatsApp = useCallback((datos: DatosConsulta) => {
    abrirWhatsApp(redactarParaWhatsApp(datos));
    setEstado('whatsapp_ok');
  }, []);

  const reset = useCallback(() => {
    setEstado('idle');
    setError(null);
  }, []);

  return { estado, error, enviarEmail, enviarWhatsApp, reset, enviando: estado === 'enviando' };
};

/** Lee el honeypot del formulario que disparó el submit. */
export const leerHoneypot = (e: React.FormEvent<HTMLFormElement>): string =>
  (e.currentTarget.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';
