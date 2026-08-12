import React, { useState } from 'react';
import { Car, Upload, CheckCircle2, ShieldCheck, MapPin, DollarSign, ArrowRight } from 'lucide-react';

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
            <h2 className="text-2xl font-extrabold text-slate-900">¡Publicación enviada a revisión!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Revisaremos los datos de tu cochera en <b>{titulo}</b> y se sincronizará automáticamente en la plataforma.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 bg-brand-600 text-white font-bold text-sm rounded-xl"
            >
              Publicar otra cochera
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-card border border-slate-200 shadow-lg space-y-6">
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-900 border-b pb-2">1. Información Principal</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título de la publicación</label>
                  <input
                    type="text"
                    placeholder="Ej: Cochera fija en Recoleta"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Barrio / Zona</label>
                  <select
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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipo de Cochera</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="cubierta">Cubierta</option>
                    <option value="descubierta">Descubierta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Precio Mensual ($ ARS)</label>
                  <input
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dirección Aproximada</label>
                <input
                  type="text"
                  placeholder="Ej: Av. Santa Fe 1800"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descripción</label>
                <textarea
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
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
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
