import React, { useState } from 'react';
import { Car, Upload, CheckCircle2, ShieldCheck, MapPin, DollarSign, ArrowRight, MessageCircle } from 'lucide-react';
import { CONTACTO, enviarConsulta } from '../config/contacto';

export const PublicarPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [zona, setZona] = useState('Recoleta');
  const [tipo, setTipo] = useState('cubierta');
  const [precio, setPrecio] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviarConsulta(
      [
        'Hola! Quiero publicar una cochera en cocheras.com.ar',
        '',
        `Título: ${titulo}`,
        `Zona: ${zona}`,
        `Tipo: ${tipo}`,
        `Precio pretendido: ${precio ? `$ ${precio}` : 'a convenir'}`,
        `Dirección: ${direccion}`,
        '',
        'Descripción:',
        descripcion,
      ].join('\n')
    );
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-20 bg-paper-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block">
            PARA PROPIETARIOS
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Publicá tu cochera en minutos
          </h1>
          <p className="text-muted-light text-sm max-w-lg mx-auto">
            Monetizá tu espacio libre. Conectamos tu cochera con miles de conductores buscando en tu zona.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white p-10 rounded-card border border-slate-200 text-center space-y-4 shadow-lg animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Tus datos están listos para enviar</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Te abrimos WhatsApp con los datos de <b>{titulo || 'tu cochera'}</b> ya redactados.
              Tocá enviar y un asesor matriculado revisa la publicación.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <a
                href={`https://wa.me/${CONTACTO.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp w-full sm:w-auto text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>No se abrió WhatsApp</span>
              </a>
              <button
                onClick={() => setSubmitted(false)}
                className="btn btn-outline w-full sm:w-auto text-sm"
              >
                Publicar otra cochera
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-card border border-slate-200 shadow-lg space-y-6">
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-900 border-b pb-2">1. Información Principal</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="publicar-titulo-de-la-publicacion" className="block text-xs font-bold text-slate-700 uppercase mb-1">Título de la publicación</label>
                  <input
                    id="publicar-titulo-de-la-publicacion"
                    type="text"
                    placeholder="Ej: Cochera fija en Recoleta"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="publicar-barrio-zona" className="block text-xs font-bold text-slate-700 uppercase mb-1">Barrio / Zona</label>
                  <select
                    id="publicar-barrio-zona"
                    value={zona}
                    onChange={(e) => setZona(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="Recoleta">Recoleta</option>
                    <option value="Palermo">Palermo</option>
                    <option value="Belgrano">Belgrano</option>
                    <option value="Microcentro">Microcentro</option>
                    <option value="Puerto Madero">Puerto Madero</option>
                    <option value="Caballito">Caballito</option>
                    <option value="Nuñez">Nuñez</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="publicar-tipo-de-cochera" className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipo de Cochera</label>
                  <select
                    id="publicar-tipo-de-cochera"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="cubierta">Cubierta</option>
                    <option value="descubierta">Descubierta</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="publicar-precio-mensual-ars" className="block text-xs font-bold text-slate-700 uppercase mb-1">Precio Mensual ($ ARS)</label>
                  <input
                    id="publicar-precio-mensual-ars"
                    type="number"
                    placeholder="Ej: 50000"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="publicar-direccion-aproximada" className="block text-xs font-bold text-slate-700 uppercase mb-1">Dirección Aproximada</label>
                <input
                    id="publicar-direccion-aproximada"
                  type="text"
                  placeholder="Ej: Av. Santa Fe 1800"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="publicar-descripcion" className="block text-xs font-bold text-slate-700 uppercase mb-1">Descripción</label>
                <textarea
                    id="publicar-descripcion"
                  rows={4}
                  placeholder="Detallá los accesos, si cuenta con portón automático, seguridad 24hs..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                <span>Enviar Publicación</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
