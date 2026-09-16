import React from 'react';
import { CheckCircle2, AlertTriangle, MessageCircle, Mail } from 'lucide-react';
import { CONTACTO } from '../../config/contacto';
import type { EstadoConsulta } from '../../hooks/useConsulta';

interface Props {
  estado: EstadoConsulta;
  error: string | null;
  onReintentar: () => void;
  onWhatsApp: () => void;
  /** Texto del botón para volver al formulario vacío. */
  textoNuevo?: string;
  compacto?: boolean;
}

/** Pantalla de resultado de un envío: éxito por email, éxito por WhatsApp o error. */
export const ResultadoConsulta: React.FC<Props> = ({
  estado,
  error,
  onReintentar,
  onWhatsApp,
  textoNuevo = 'Escribir otra consulta',
  compacto = false,
}) => {
  const pad = compacto ? 'p-5' : 'p-8';
  const btn = compacto ? 'btn btn-sm' : 'btn btn-sm px-5 py-2.5';

  if (estado === 'error') {
    return (
      <div className={`${pad} text-center space-y-4 bg-red-50 border border-red-200 rounded-2xl`}>
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-red-900">No pudimos enviar el mensaje</h3>
          <p className="text-xs text-red-700 max-w-sm mx-auto leading-relaxed">{error}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <button type="button" onClick={onWhatsApp} className={`${btn} btn-whatsapp w-full sm:w-auto`}>
            <MessageCircle className="w-4 h-4" />
            <span>Enviar por WhatsApp</span>
          </button>
          <a href={`mailto:${CONTACTO.email}`} className={`${btn} btn-outline w-full sm:w-auto`}>
            <Mail className="w-4 h-4" />
            <span>Escribir a {CONTACTO.email}</span>
          </a>
          <button type="button" onClick={onReintentar} className={`${btn} btn-outline w-full sm:w-auto`}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const porWhatsApp = estado === 'whatsapp_ok';

  return (
    <div className={`${pad} text-center space-y-4 bg-emerald-50 border border-emerald-200 rounded-2xl`}>
      <CheckCircle2 className="w-11 h-11 text-emerald-600 mx-auto" />
      <div className="space-y-1">
        <h3 className="text-base font-extrabold text-emerald-900">
          {porWhatsApp ? 'Tu consulta está lista en WhatsApp' : '¡Mensaje enviado!'}
        </h3>
        <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
          {porWhatsApp
            ? 'Te abrimos WhatsApp con el mensaje redactado. Tocá enviar y te respondemos a la brevedad.'
            : 'Recibimos tu consulta. Te respondemos por email a la brevedad.'}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        {porWhatsApp && (
          <a
            href={`https://wa.me/${CONTACTO.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className={`${btn} btn-whatsapp w-full sm:w-auto`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>No se abrió WhatsApp</span>
          </a>
        )}
        <button type="button" onClick={onReintentar} className={`${btn} btn-outline w-full sm:w-auto`}>
          {textoNuevo}
        </button>
      </div>
    </div>
  );
};
