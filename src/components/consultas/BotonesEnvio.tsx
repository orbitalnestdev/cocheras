import React from 'react';
import { Send, MessageCircle, Loader2 } from 'lucide-react';

interface Props {
  enviando: boolean;
  onWhatsApp: () => void;
  /** Tamaño de los botones: el de la ficha va más compacto. */
  compacto?: boolean;
}

/**
 * Los dos caminos de envío, uno al lado del otro. El submit del formulario
 * envía por email (funciona sin WhatsApp); el secundario abre WhatsApp.
 * Incluye el honeypot anti-spam que lee el plugin de WordPress.
 */
export const BotonesEnvio: React.FC<Props> = ({ enviando, onWhatsApp, compacto = false }) => (
  <div className="space-y-3">
    {/* Honeypot: invisible para personas, tentador para bots */}
    <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
      <label htmlFor="website">No completar</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>

    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${compacto ? '' : 'sm:gap-3'}`}>
      <button
        type="submit"
        disabled={enviando}
        className={`btn btn-primary btn-block ${compacto ? '' : 'text-sm'}`}
      >
        {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        <span>{enviando ? 'Enviando…' : 'Enviar mensaje'}</span>
      </button>
      <button
        type="button"
        onClick={onWhatsApp}
        disabled={enviando}
        className={`btn btn-whatsapp btn-block ${compacto ? '' : 'text-sm'}`}
      >
        <MessageCircle className="w-4 h-4" />
        <span>Enviar por WhatsApp</span>
      </button>
    </div>

    <p className="text-[11px] text-slate-500 text-center leading-relaxed">
      Elegí cómo preferís contactarnos. Por email no necesitás tener WhatsApp.
    </p>
  </div>
);
