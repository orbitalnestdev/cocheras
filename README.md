# 🚗 Cocheras.com.ar — Marketplace & Plataforma Headless Real Estate

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.11-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![WordPress REST API](https://img.shields.io/badge/WordPress_API-Headless-21759B?logo=wordpress&logoColor=white)](https://developer.wordpress.org/rest-api/)

Sitio público y plataforma *Headless Real Estate* para **Cocheras.com.ar** (Esteban Sucari - Matrícula CUCICBA 6610 / CMPCSI 6068), la plataforma #1 de comercialización, alquiler e inversión en cocheras, garajes, superficies comerciales y oficinas en la Ciudad Autónoma de Buenos Aires (CABA) y GBA.

---

> [!IMPORTANT]
> **Integración en Vivo con WordPress REST API**: El proyecto consume las **243 publicaciones en vivo** de `https://www.cocheras.com.ar/wp-json/wp/v2/propiedad`, con paginación paralela multipágina, geolocalización real en barrios de CABA, reproducción de tours en video y podcasts de entrevistas radiales.

---

## ✨ Características Principales

- 🚙 **Catálogo Completo de 243 Propiedades**: Conexión a la API REST de WordPress con peticiones paralelas (`page=1, 2, 3`) y caché relámpago a **0ms** (*Stale-While-Revalidate*).
- 📄 **Paginación Inteligente**: Filtro y paginación fluida de **30 propiedades por página** con desplazamiento suave.
- 🗺️ **Mapa Interactivo de CABA (Leaflet)**: Pines geolocalizados en Recoleta, Palermo, Belgrano, Monserrat, Microcentro, Puerto Madero, Caballito, Núñez, San Telmo, Almagro y más.
- 💰 **Manejo Riguroso de Precios y Moneda**: Formateo en **`$ ARS`**, **`U$S USD`** y etiqueta especial **`Consultar Precio`** para emprendimientos sin precio fijo.
- 📹 **Tours Virtuales en Video**: Integración de reproductores de YouTube embebidos para recorridos y proyectos en pozo.
- 📻 **Entrevistas Radiales y Podcasts (Audio HTML5)**: Detección y limpieza automática de shortcodes de WordPress para reproducir entrevistas (*Radio Milenium*, *A24*, etc.).
- 🖼️ **Logo Original & Marca Auténtica**: Isotipo oficial de Esteban Sucari (`Ec`), datos de contacto verified (CUCICBA 6610) y WhatsApp directo.
- 🎯 **Navegación Alada a la Web Original**: Menú optimizado de 8 secciones principales (`Cocheras particulares`, `Garages y playas`, `Emprendimientos`, `Oficinas`, `Oportunidades`, `Quienes somos`, `En los medios`, `Contactanos`).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología / Librería | Descripción |
|---|---|---|
| **Core** | `React 18` + `TypeScript` | Arquitectura modular con tipado estricto (`strict: true`). |
| **Build Tool** | `Vite 5` | HMR instantáneo y empaquetado optimizado en producción. |
| **Estilos** | `Tailwind CSS 3` | Tokenización visual, gradientes dinámicos y diseño responsivo. |
| **Mapas** | `Leaflet 1.9` | Mapas vectoriales con CartoDB Positron y pines interactivos. |
| **Iconos** | `Lucide React` | Iconografía vectorizada de alta legibilidad. |
| **Validación** | `Zod 3` | Sanitización de datos en tiempo de ejecución. |
| **Rutas** | `React Router DOM 6` | Navegación SPA con soporte de parámetros de búsqueda (`useSearchParams`). |

---

## 📂 Estructura del Proyecto

```text
cocheras/
├── public/
│   ├── img/
│   │   └── logo.png              # Logo oficial original (Ec)
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── cocheras/
│   │   │   ├── CocheraCard.tsx   # Tarjeta de propiedad espaciosa y legible
│   │   │   └── InteractiveMap.tsx# Mapa Leaflet interactivo de CABA
│   │   └── layout/
│   │       ├── Header.tsx        # Menú superior con las 8 secciones oficiales
│   │       └── Footer.tsx        # Pie de página con matrícula CUCICBA 6610
│   ├── pages/
│   │   ├── HomePage.tsx          # Portada principal con buscador y destacados
│   │   ├── ListadoPage.tsx       # Listado de propiedades con paginación a 30
│   │   ├── SingleCocheraPage.tsx # Ficha técnica, galería, video tour y audio player
│   │   ├── PrensaPage.tsx        # Artículos de prensa (La Nación, Infobae, Clarín)
│   │   ├── VideosPage.tsx        # Sala de videos de informes de mercado
│   │   ├── NosotrosPage.tsx      # Quiénes Somos y trayectoria
│   │   └── ContactoPage.tsx      # Formulario y ubicación de oficina en Núñez
│   ├── services/
│   │   └── wordpressService.ts   # Servicio API multipágina y geocodificación CABA
│   ├── types/
│   │   └── cochera.ts            # Interfaces y esquemas Zod
│   ├── App.tsx                   # Enrutador principal
│   └── main.tsx                  # Punto de entrada Vite
├── wp-cocheras-api.php           # MU-Plugin opcional para WordPress
├── package.json
└── README.md
```

---

## 🚀 Instalación y Ejecución Local

### 1. Clonar e Instalar Dependencias
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/cocheras.git
cd cocheras

# Instalar paquetes
npm install
```

### 2. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Accedé a **`http://localhost:5173/`** en tu navegador.

### 3. Compilar para Producción
```bash
npm run build
```
Genera la carpeta `dist/` optimizada para producción.

---

## 🔌 Integración con WordPress REST API

El servicio `wordpressService.ts` se conecta directamente con los endpoints públicos de **Cocheras.com.ar**:

> [!TIP]
> **Endpoint WordPress Utilizado**: `https://www.cocheras.com.ar/wp-json/wp/v2/propiedad?per_page=100&_embed&page=1`

### Reglas de Fallback y Resiliencia:
1. **Caché en Memoria y SessionStorage**: Reutiliza datos descargados para respuesta en 0ms.
2. **Resiliencia Offline**: Si la conexión con el WordPress remoto falla o se interrumpe, el sistema activa automáticamente un *snapshot* seguro (`COCHERAS_SNAPSHOT`).

---

## 🎨 Sistema de Diseño (Color Tokens)

- **Fondo Oscuro / Header**: `#070A18` (`ink-950`), `#0D1230` (`ink-900`)
- **Fondo Claro**: `#F5F6F8` (`paper-50`)
- **Azul Primario de Marca**: `#2563EB` (`brand-600`)
- **Verde Éxito / WhatsApp**: `#059669` (`emerald-600`)
- **Pines & Acentos**: `#A855F7` (`violet-500`)

---

## 📞 Datos de Contacto e Inmobiliaria

- **Director**: Esteban Sucari — *Matrícula CUCICBA 6610 / CMPCSI 6068*
- **Dirección**: 11 de Septiembre 2957, Piso 2° «C», Núñez, CABA
- **WhatsApp Directo**: [+54 9 11 3692-0920](https://wa.me/5491136920920)
- **Teléfono Fijo**: +54 11 4997-3559
- **Email**: info@cocheras.com.ar
- **Web Oficial**: [https://www.cocheras.com.ar](https://www.cocheras.com.ar)
