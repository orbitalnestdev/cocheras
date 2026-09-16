import React, { useState } from 'react';
import { Car, Upload, ShieldCheck, MapPin, DollarSign } from 'lucide-react';
import { DatosConsulta } from '../config/contacto';
import { useConsulta, leerHoneypot } from '../hooks/useConsulta';
import { BotonesEnvio } from '../components/consultas/BotonesEnvio';
import { ResultadoConsulta } from '../components/consultas/ResultadoConsulta';

const campo = 'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500';

export const PublicarPage: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [zona, setZona] = useState('Recoleta');
  const [tipo, setTipo] = useState('cubierta');
  const [precio, setPrecio] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  // El formulario no pedía ningún dato del propietario: no había forma de
  // responderle salvo que él mismo escribiera por WhatsApp.
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const consulta = useConsulta();

  const armarDatos = (website = ''): DatosConsulta => ({
    nombre, email, telefono, website,
    origen: 'Publicar',
    referencia: titulo,
    mensaje: [
      'Quiero publicar una cochera.',
      '',
      `Título: ${titulo}`,
      `Zona: ${zona}`,
      `Tipo: ${tipo}`,
      `Precio pretendido: ${precio ? `$ ${precio}` : 'a convenir'}`,
      `Dirección: ${direccion}`,
      '',
      'Descripción:',
      descripcion,
    ].join('\n'),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    consulta.enviarEmail(armarDatos(leerHoneypot(e)));
  };

  const limpiar = () => {
    setTitulo(''); setPrecio(''); setDireccion(''); setDescripcion('');
    setNombre(''); setEmail(''); setTelefono('');
    consulta.reset();
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

        {consulta.estado !== 'idle' && consulta.estado !== 'enviando' ? (
          <div className="bg-white p-4 sm:p-6 rounded-card border border-slate-200 shadow-lg animate-fadeIn">
            <ResultadoConsulta
              estado={consulta.estado}
              error={consulta.error}
              onReintentar={consulta.estado === 'error' ? consulta.reset : limpiar}
              onWhatsApp={() => consulta.enviarWhatsApp(armarDatos())}
              textoNuevo="Publicar otra cochera"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-card border border-slate-200 shadow-lg space-y-6 relative">
            
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

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-900 border-b pb-2">2. Tus datos de contacto</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="publicar-nombre" className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre</label>
                  <input id="publicar-nombre" type="text" placeholder="Tu nombre y apellido" value={nombre}
                    onChange={(e) => setNombre(e.target.value)} className={campo} required />
                </div>
                <div>
                  <label htmlFor="publicar-email" className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input id="publicar-email" type="email" placeholder="tu@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} className={campo} required />
                </div>
                <div>
                  <label htmlFor="publicar-telefono" className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono</label>
                  <input id="publicar-telefono" type="tel" placeholder="Ej: 11 5555 4444" value={telefono}
                    onChange={(e) => setTelefono(e.target.value)} className={campo} />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <BotonesEnvio
                enviando={consulta.enviando}
                onWhatsApp={() => consulta.enviarWhatsApp(armarDatos())}
              />
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
