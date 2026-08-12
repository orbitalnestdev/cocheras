import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, CheckCircle2, Send, MessageCircle, ShieldCheck, Award } from 'lucide-react';

export const ContactoPage: React.FC = () => {
  const [enviado, setEnviado] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
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
                <Phone className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-semibold text-white">Teléfonos</span>
                  <a href="tel:+541149973559" className="hover:text-white transition-colors block">+54 11 4997-3559</a>
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
              <p>Esteban Sucari — Matrícula CUCICBA 6610 / CMPCSI 6068</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-card border border-slate-200 shadow-sm">
            {enviado ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">¡Mensaje Recibido!</h3>
                <p className="text-xs text-slate-600">Nos pondremos en contacto con vos a la brevedad.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg border-b pb-2">Envianos una Consulta</h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Completo</label>
                  <input
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
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="Ej: 11 4997 3559"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mensaje o Detalle de Búsqueda</label>
                  <textarea
                    rows={4}
                    placeholder="Contanos en qué zona estás buscando cochera o qué tipo de inversión te interesa..."
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Consulta</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
