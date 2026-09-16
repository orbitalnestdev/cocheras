import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, MessageCircle, ShieldCheck, Award } from 'lucide-react';
import { CONTACTO, DatosConsulta } from '../config/contacto';
import { useConsulta, leerHoneypot } from '../hooks/useConsulta';
import { BotonesEnvio } from '../components/consultas/BotonesEnvio';
import { ResultadoConsulta } from '../components/consultas/ResultadoConsulta';

export const ContactoPage: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const consulta = useConsulta();

  const armarDatos = (website = ''): DatosConsulta => ({
    nombre, email, telefono, mensaje, website,
    origen: 'Contacto',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    consulta.enviarEmail(armarDatos(leerHoneypot(e)));
  };

  const limpiar = () => {
    setNombre(''); setEmail(''); setTelefono(''); setMensaje('');
    consulta.reset();
  };

  return (
    <div className="pt-28 pb-20 bg-paper-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block">
            ESTAMOS PARA AYUDARTE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contacto Directo
          </h1>
          <p className="text-muted-light text-sm max-w-lg mx-auto">
            ¿Tenés alguna consulta sobre alquiler, compra o inversión en cocheras? Escribinos o comunicate con nuestro equipo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 bg-ink-950 text-white p-8 rounded-card space-y-6 shadow-xl border border-white/10">
            <h3 className="text-xl font-bold border-b border-white/10 pb-3">Información de Contacto</h3>
            
            <div className="space-y-4 text-sm text-muted-dark">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-semibold text-white">Email</span>
                  <a href="mailto:info@cocheras.com.ar" className="hover:text-white transition-colors">info@cocheras.com.ar</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-semibold text-white">WhatsApp Directo</span>
                  <a href="https://wa.me/5491136920920" target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline">
                    +54 9 11 3692-0920
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-semibold text-white">Horarios de Atención</span>
                  <span>Lunes a Viernes de 9:00 a 18:00 hs</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-semibold text-white">Oficinas Principales</span>
                  <span>11 de Septiembre 2957, Piso 2° «C», Núñez, CABA</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-white">Matrículas Profesionales:</p>
              <p>Matrícula CUCICBA 6610 / CMPCSI 6068</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-card border border-slate-200 shadow-sm">
            {consulta.estado !== 'idle' && consulta.estado !== 'enviando' ? (
              <ResultadoConsulta
                estado={consulta.estado}
                error={consulta.error}
                onReintentar={consulta.estado === 'error' ? consulta.reset : limpiar}
                onWhatsApp={() => consulta.enviarWhatsApp(armarDatos())}
              />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative">
                <h3 className="font-bold text-slate-900 text-lg border-b pb-2">Envianos una Consulta</h3>

                <div>
                  <label htmlFor="contacto-nombre-completo" className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Completo</label>
                  <input
                    id="contacto-nombre-completo"
                    type="text"
                    placeholder="Tu nombre y apellido"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contacto-email" className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                    <input
                    id="contacto-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contacto-telefono-whatsapp" className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono / WhatsApp</label>
                    <input
                    id="contacto-telefono-whatsapp"
                      type="tel"
                      placeholder="Ej: 11 5555 4444"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contacto-mensaje-o-detalle-de-busqueda" className="block text-xs font-bold text-slate-700 uppercase mb-1">Mensaje o Detalle de Búsqueda</label>
                  <textarea
                    id="contacto-mensaje-o-detalle-de-busqueda"
                    rows={4}
                    placeholder="Contanos en qué zona estás buscando cochera o qué tipo de inversión te interesa..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <BotonesEnvio
                  enviando={consulta.enviando}
                  onWhatsApp={() => consulta.enviarWhatsApp(armarDatos())}
                />
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
