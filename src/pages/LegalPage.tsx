import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Mail, MessageCircle } from 'lucide-react';
import { CONTACTO } from '../config/contacto';

/**
 * Términos y Política de Privacidad.
 *
 * Los enlaces del pie apuntaban a `#terminos` y `#privacidad`: anclas que no
 * existían en ninguna página, así que el clic no hacía nada.
 *
 * El texto describe lo que el sitio hace HOY (de dónde salen las publicaciones,
 * qué pasa con los datos del formulario, qué se guarda en el navegador).
 * IMPORTANTE: antes de publicar conviene que lo revise un abogado y que se
 * complete la razón social y el domicilio fiscal de la empresa.
 */

const Seccion: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
  <section className="space-y-2">
    <h2 className="text-base font-extrabold text-slate-900">{titulo}</h2>
    <div className="text-sm text-slate-600 leading-relaxed space-y-3">{children}</div>
  </section>
);

const Marco: React.FC<{
  icono: React.ReactNode;
  eyebrow: string;
  titulo: string;
  children: React.ReactNode;
}> = ({ icono, eyebrow, titulo, children }) => (
  <div className="pt-28 pb-20 bg-paper-50 min-h-screen">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
          {icono}
        </div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block">
          {eyebrow}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{titulo}</h1>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-card border border-slate-200 shadow-sm space-y-7">
        {children}

        <div className="pt-5 border-t border-slate-100 space-y-3">
          <h2 className="text-base font-extrabold text-slate-900">Contacto</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Por cualquier consulta sobre estos términos o sobre tus datos personales,
            escribinos y te respondemos.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <a href={`mailto:${CONTACTO.email}`} className="btn btn-outline btn-sm">
              <Mail className="w-4 h-4" />
              <span>{CONTACTO.email}</span>
            </a>
            <a
              href={`https://wa.me/${CONTACTO.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Escribir por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Operaciones matriculadas · Matrícula CUCICBA 6610 · Matrícula CMPCSI 6068 ·{' '}
        <Link to="/contacto" className="text-brand-600 font-semibold hover:underline">
          Contacto
        </Link>
      </p>
    </div>
  </div>
);

export const TerminosPage: React.FC = () => (
  <Marco icono={<FileText className="w-6 h-6" />} eyebrow="Condiciones de uso" titulo="Términos y Condiciones">
    <Seccion titulo="Qué es este sitio">
      <p>
        Cocheras.com.ar es una plataforma de difusión de cocheras, garajes, playas de
        estacionamiento y emprendimientos en la Ciudad Autónoma de Buenos Aires.
        La intermediación se realiza bajo matrícula CUCICBA 6610 y CMPCSI 6068.
      </p>
    </Seccion>

    <Seccion titulo="Sobre la información publicada">
      <p>
        Las publicaciones se sincronizan automáticamente desde nuestro sistema de gestión
        y pueden cambiar o darse de baja sin aviso previo. Los datos de superficie,
        características y disponibilidad son suministrados por los propietarios: cuando un
        dato no fue informado, el sitio lo indica expresamente en lugar de estimarlo.
      </p>
      <p>
        Los valores se informan a pedido. Ninguna publicación de este sitio constituye una
        oferta contractual vinculante ni reemplaza la visita, la documentación de la unidad
        ni el contrato correspondiente.
      </p>
    </Seccion>

    <Seccion titulo="Uso del sitio">
      <p>
        Podés navegar y consultar libremente. No está permitido extraer masivamente el
        contenido, republicar las fichas o las fotografías sin autorización, ni usar el
        sitio para enviar comunicaciones no solicitadas a los anunciantes.
      </p>
    </Seccion>

    <Seccion titulo="Enlaces y servicios de terceros">
      <p>
        El mapa usa cartografía de Google Maps mediante Leaflet, y las consultas se
        derivan a WhatsApp. Esos servicios se rigen por sus propias condiciones, que no
        controlamos.
      </p>
    </Seccion>
  </Marco>
);

export const PrivacidadPage: React.FC = () => (
  <Marco icono={<ShieldCheck className="w-6 h-6" />} eyebrow="Tus datos" titulo="Política de Privacidad">
    <Seccion titulo="Qué datos pedimos">
      <p>
        Sólo los que completás vos en los formularios de contacto y de publicación:
        nombre, correo electrónico, teléfono y el detalle de tu consulta o de la cochera
        que querés publicar. No pedimos datos de tarjetas ni documentos.
      </p>
    </Seccion>

    <Seccion titulo="Qué hacemos con ellos">
      <p>
        Al enviar un formulario, los datos se arman como un mensaje de WhatsApp que vos
        mismo enviás desde tu cuenta a nuestro número comercial. Es decir: la información
        viaja por WhatsApp y queda en esa conversación. La usamos únicamente para
        responderte y gestionar la operación consultada.
      </p>
      <p>
        No vendemos, alquilamos ni cedemos tus datos a terceros con fines publicitarios.
      </p>
    </Seccion>

    <Seccion titulo="Qué se guarda en tu navegador">
      <p>
        El sitio no usa cookies publicitarias ni de seguimiento. Guarda en el
        almacenamiento local del navegador una copia temporal del catálogo, para que la
        navegación entre secciones sea más rápida. Podés borrarla en cualquier momento
        limpiando los datos del sitio desde tu navegador.
      </p>
    </Seccion>

    <Seccion titulo="De dónde salen las publicaciones">
      <p>
        Las fichas, fotos y ubicaciones provienen de nuestro propio sistema de gestión.
        El mapa muestra la ubicación informada de cada propiedad sobre cartografía de
        Google Maps.
      </p>
    </Seccion>

    <Seccion titulo="Tus derechos">
      <p>
        Podés pedirnos en cualquier momento el acceso, la rectificación o la supresión de
        tus datos escribiéndonos a {CONTACTO.email}. Conforme a la Ley 25.326 de
        Protección de los Datos Personales, la Agencia de Acceso a la Información Pública
        es el órgano de control y atiende las denuncias por incumplimiento.
      </p>
    </Seccion>
  </Marco>
);
