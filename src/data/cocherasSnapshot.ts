import { Cochera } from '../types/cochera';

export const COCHERAS_SNAPSHOT: Cochera[] = [
  {
    id: 1,
    slug: 'cochera-en-recoleta',
    titulo: 'Cochera en Recoleta',
    zona: 'Recoleta',
    ciudad: 'CABA',
    direccion: 'Av. Las Heras 2100, Recoleta, CABA',
    precio: 55000,
    moneda: 'ARS',
    periodo: 'mes',
    tipo: 'cubierta',
    tipoAcceso: 'Portón automático con tarjeta magnética',
    features: ['Cubierta', 'Seguridad 24hs', 'Cámaras CCTV', 'Elevador de autos'],
    destacada: true,
    disponible: true,
    imagenDestacada: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    imagenes: [
      {
        url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
        alt: 'Vista principal de cochera cubierta en Recoleta',
        width: 1200,
        height: 900
      },
      {
        url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
        alt: 'Entrada con portón automático',
        width: 1200,
        height: 900
      },
      {
        url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
        alt: 'Rampa de acceso y señalización',
        width: 1200,
        height: 900
      }
    ],
    descripcion: 'Excelente espacio de estacionamiento fijo y cubierto en primer subsuelo sobre la tradicional Av. Las Heras en Recoleta. Cuenta con seguridad física y monitoreo de cámaras las 24 hs, acceso por tarjeta magnética y excelente iluminación.',
    ambientes: 1,
    banos: 1,
    superficie: 15,
    lat: -34.5889,
    lng: -58.3934,
    contacto: {
      telefono: '+54 11 4589-2020',
      whatsapp: '5491145892020',
      email: 'recoleta@cocheras.com.ar'
    }
  },
  {
    id: 2,
    slug: 'cochera-en-palermo',
    titulo: 'Cochera en Palermo',
    zona: 'Palermo',
    ciudad: 'CABA',
    direccion: 'Humboldt 1900, Palermo Hollywood, CABA',
    precio: 48000,
    moneda: 'ARS',
    periodo: 'mes',
    tipo: 'descubierta',
    tipoAcceso: 'Control remoto individual',
    features: ['Descubierta', 'Portón automático', 'Acceso 24hs'],
    destacada: true,
    disponible: true,
    imagenDestacada: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
    imagenes: [
      {
        url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
        alt: 'Cochera fija descubierta en Palermo',
        width: 1200,
        height: 900
      },
      {
        url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
        alt: 'Espacio de maniobra amplio',
        width: 1200,
        height: 900
      }
    ],
    descripcion: 'Espacio exclusivo para autos o camionetas medianas en la zona gastronómica y de oficinas de Palermo Hollywood. Portón levadizo con apertura remota y fácil maniobrabilidad.',
    ambientes: 1,
    banos: 0,
    superficie: 13,
    lat: -34.5812,
    lng: -58.4348,
    contacto: {
      telefono: '+54 11 4589-2021',
      whatsapp: '5491145892021',
      email: 'palermo@cocheras.com.ar'
    }
  },
  {
    id: 3,
    slug: 'cochera-en-belgrano',
    titulo: 'Cochera en Belgrano',
    zona: 'Belgrano',
    ciudad: 'CABA',
    direccion: 'Av. Cabildo 2400, Belgrano, CABA',
    precio: 52000,
    moneda: 'ARS',
    periodo: 'mes',
    tipo: 'cubierta',
    tipoAcceso: 'Control de huella / tarjeta',
    features: ['Cubierta', 'Cámaras', 'Vigilancia nocturna', 'Fácil acceso'],
    destacada: true,
    disponible: true,
    imagenDestacada: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
    imagenes: [
      {
        url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
        alt: 'Cochera moderna cubierta en Belgrano',
        width: 1200,
        height: 900
      },
      {
        url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
        alt: 'Instalaciones con iluminación LED',
        width: 1200,
        height: 900
      }
    ],
    descripcion: 'Espacio techado muy bien ubicado a metros del subte D en Belgrano. Ideal para quienes trabajan en la zona o residentes que buscan guardar su coche con total tranquilidad.',
    ambientes: 1,
    banos: 1,
    superficie: 14,
    lat: -34.5617,
    lng: -58.4562,
    contacto: {
      telefono: '+54 11 4589-2022',
      whatsapp: '5491145892022',
      email: 'belgrano@cocheras.com.ar'
    }
  },
  {
    id: 4,
    slug: 'cochera-en-microcentro',
    titulo: 'Cochera en Microcentro',
    zona: 'Microcentro',
    ciudad: 'CABA',
    direccion: 'Florida 600, Microcentro, CABA',
    precio: 45000,
    moneda: 'ARS',
    periodo: 'mes',
    tipo: 'cubierta',
    tipoAcceso: 'Garajista y portón automatizado',
    features: ['Cubierta', 'Vigilancia', 'Seguridad 24hs', 'Sistema anti-incendio'],
    destacada: true,
    disponible: true,
    imagenDestacada: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    imagenes: [
      {
        url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
        alt: 'Subsuelo iluminado en Microcentro',
        width: 1200,
        height: 900
      }
    ],
    descripcion: 'Ubicación clave para ejecutivos e inquilinos del centro financiero. Edificio exclusivo de cocheras con valets de estacionamiento y seguridad constante.',
    ambientes: 1,
    banos: 1,
    superficie: 12.5,
    lat: -34.6037,
    lng: -58.3758,
    contacto: {
      telefono: '+54 11 4589-2023',
      whatsapp: '5491145892023',
      email: 'microcentro@cocheras.com.ar'
    }
  },
  {
    id: 5,
    slug: 'cochera-en-puerto-madero',
    titulo: 'Cochera de Lujo en Puerto Madero',
    zona: 'Puerto Madero',
    ciudad: 'CABA',
    direccion: 'Juana Manso 1100, Puerto Madero, CABA',
    precio: 85000,
    moneda: 'ARS',
    periodo: 'mes',
    tipo: 'cubierta',
    tipoAcceso: 'Lector de patente automático',
    features: ['Cubierta', 'Seguridad 24hs', 'Valet Parking', 'Cargador Eléctrico', 'Cámaras HD'],
    destacada: true,
    disponible: true,
    imagenDestacada: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    imagenes: [
      {
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
        alt: 'Cochera premium en Puerto Madero con tótem de recarga',
        width: 1200,
        height: 900
      }
    ],
    descripcion: 'Cochera fija en el complejo más moderno de Puerto Madero. Apta para camionetas de gran porte, incluye punto de recarga de vehículos eléctricos sin costo adicional.',
    ambientes: 1,
    banos: 1,
    superficie: 18,
    lat: -34.6111,
    lng: -58.3629,
    contacto: {
      telefono: '+54 11 4589-2024',
      whatsapp: '5491145892024',
      email: 'madero@cocheras.com.ar'
    }
  },
  {
    id: 6,
    slug: 'cochera-en-caballito',
    titulo: 'Cochera Fija en Caballito',
    zona: 'Caballito',
    ciudad: 'CABA',
    direccion: 'Av. Rivadavia 5100, Caballito, CABA',
    precio: 42000,
    moneda: 'ARS',
    periodo: 'mes',
    tipo: 'cubierta',
    tipoAcceso: 'Portón automático',
    features: ['Cubierta', 'Portón automático', 'Expensas incluidas'],
    destacada: false,
    disponible: true,
    imagenDestacada: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    imagenes: [
      {
        url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
        alt: 'Cochera en Caballito cerca de Parque Rivadavia',
        width: 1200,
        height: 900
      }
    ],
    descripcion: 'Práctica cochera en planta baja de fácil maniobra sobre Av. Rivadavia. Expensas yABL incluidos en el canon mensual.',
    ambientes: 1,
    banos: 0,
    superficie: 13,
    lat: -34.6186,
    lng: -58.4359,
    contacto: {
      telefono: '+54 11 4589-2025',
      whatsapp: '5491145892025',
      email: 'caballito@cocheras.com.ar'
    }
  },
  {
    id: 7,
    slug: 'cochera-en-nunez',
    titulo: 'Cochera Amplia en Nuñez',
    zona: 'Nuñez',
    ciudad: 'CABA',
    direccion: 'Av. del Libertador 7200, Nuñez, CABA',
    precio: 50000,
    moneda: 'ARS',
    periodo: 'mes',
    tipo: 'cubierta',
    tipoAcceso: 'Llavero magnético + Remoto',
    features: ['Cubierta', 'Seguridad 24hs', 'Doble rampa'],
    destacada: false,
    disponible: true,
    imagenDestacada: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
    imagenes: [
      {
        url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
        alt: 'Cochera sobre Libertador en Nuñez',
        width: 1200,
        height: 900
      }
    ],
    descripcion: 'Espacioso garaje cubierto en torre sobre Av. Libertador. Seguridad las 24 horas y rápida salida hacia la Av. General Paz y Acceso Norte.',
    ambientes: 1,
    banos: 1,
    superficie: 16,
    lat: -34.5468,
    lng: -58.4611,
    contacto: {
      telefono: '+54 11 4589-2026',
      whatsapp: '5491145892026',
      email: 'nunez@cocheras.com.ar'
    }
  },
  {
    id: 8,
    slug: 'cochera-en-san-telmo',
    titulo: 'Cochera en San Telmo',
    zona: 'San Telmo',
    ciudad: 'CABA',
    direccion: 'Defensa 800, San Telmo, CABA',
    precio: 39000,
    moneda: 'ARS',
    periodo: 'mes',
    tipo: 'descubierta',
    tipoAcceso: 'Portón con control',
    features: ['Descubierta', 'Económica', 'Portón automático'],
    destacada: false,
    disponible: true,
    imagenDestacada: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
    imagenes: [
      {
        url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
        alt: 'Cochera descubierta en San Telmo',
        width: 1200,
        height: 900
      }
    ],
    descripcion: 'Cochera a metros de Plaza Dorrego. Muy económica y conveniente para residentes o comerciantes de la zona histórica.',
    ambientes: 1,
    banos: 0,
    superficie: 12,
    lat: -34.6189,
    lng: -58.3721,
    contacto: {
      telefono: '+54 11 4589-2027',
      whatsapp: '5491145892027',
      email: 'santelmo@cocheras.com.ar'
    }
  }
];
