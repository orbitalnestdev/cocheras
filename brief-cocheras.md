# Brief de desarrollo — Cocheras

> Marketplace de alquiler de cocheras. Replicar el mockup adjunto **tal cual** (layout, jerarquía, paleta y copy) y alimentar las cocheras desde un WordPress existente vía REST API.

---

## 1. Objetivo

Construir el sitio público de Cocheras siguiendo el mockup de referencia al pie de la letra. El diseño no está a discusión: es la especificación. Las cocheras que hoy se muestran hardcodeadas en el mockup deben venir del WordPress donde ya están cargadas, consumidas por API, con una capa de mapeo propia (nada de acoplar los componentes al shape crudo de WP).

**No inventar secciones nuevas, no reordenar, no "mejorar" la paleta.** Si algo del mockup es ambiguo (espaciados, breakpoints intermedios), resolverlo con criterio y dejarlo anotado en el README.

---

## 2. Stack

- **Astro** con islas de React solo donde haga falta interactividad (buscador, carruseles, favoritos, filtros).
- **Tailwind CSS** con los tokens del punto 3 definidos en `tailwind.config`. Nada de valores mágicos sueltos en las clases.
- **TypeScript** estricto en toda la capa de datos.
- **Zod** para validar la respuesta de WordPress antes de mapearla.
- Iconos: **Lucide** (los del mockup son lineales, stroke ~1.5–2px).
- Deploy: contenedor en el VPS vía **Dokploy**.

Si el proyecto necesita SSR real (filtros server-side, muchas cocheras), usar el adapter de Node en Astro; si el catálogo es chico, SSG + revalidación por webhook (ver 5.5).

---

## 3. Sistema de diseño (extraído del mockup)

### Color

| Token | Hex aprox. | Uso |
|---|---|---|
| `ink-950` | `#070A18` | Fondo de secciones oscuras, footer |
| `ink-900` | `#0D1230` | Cards oscuras (pasos "Cómo funciona"), franja de beneficios |
| `paper-50` | `#F5F6F8` | Fondo de secciones claras |
| `white` | `#FFFFFF` | Cards de cocheras y testimonios |
| `brand-600` | `#2563EB` | Azul primario: botones, eyebrows, links, badge "DESTACADA" |
| `violet-500` | `#A855F7` | Violeta de acento y final del gradiente |
| `star` | `#FBBF24` | Estrellas de testimonios |
| `muted-dark` | `#9AA3BE` | Texto secundario sobre fondo oscuro |
| `muted-light` | `#6B7280` | Texto secundario sobre fondo claro |

Gradiente de marca: `linear-gradient(90deg, #2563EB 0%, #A855F7 100%)`. Se usa en dos lugares y solo dos: la línea "sin vueltas." del H1 y la banda del CTA final.

### Tipografía

- Una sola familia sans, geométrica y de amplio rango de pesos: **Plus Jakarta Sans** (fallback: Inter). Servirla self-hosted con `font-display: swap`, no desde Google Fonts CDN.
- Escala: H1 ~56/60px bold con `tracking-tight` y `leading-[1.05]`; H2 ~40px bold; H3 ~18px semibold; body 15–16px; eyebrow 12px uppercase, `tracking-[0.14em]`, peso 600, en `brand-600`.

### Formas y superficies

- Radius: `12px` en cards e inputs, `16px` en la card flotante del hero, `24px` en la banda del CTA final, `full` en pills y badges.
- Sombra de cards claras: suave y baja, tipo `0 4px 20px rgba(15,23,42,.06)`. Sin sombras duras.
- Grid: contenedor máximo `1200px`, gutter 24px, 12 columnas.
- Ritmo vertical: secciones con `py-20` en desktop, `py-14` en mobile.

### Movimiento

Discreto. Reveal on scroll suave (fade + 12px de subida) por sección, hover en cards (elevación mínima + zoom 1.03 de la imagen), transición del corazón de favoritos. Respetar `prefers-reduced-motion`.

---

## 4. Estructura de secciones

Orden exacto del mockup:

1. **Header** — sticky, fondo oscuro translúcido con blur al scrollear. Logo "COCHERAS" + isotipo. Nav: Inicio · Buscar Cocheras · Publicar Cochera · Cómo Funciona · Beneficios · Contacto. Botón fantasma "Iniciar Sesión" + botón azul "Registrarse". Menú hamburguesa en mobile.
2. **Hero** — imagen de cochera subterránea de fondo con overlay oscuro y viñeta. Pill "#1 EN ALQUILER DE COCHERAS". H1 en tres líneas, la tercera con el gradiente. Bajada. **Barra de búsqueda**: input de ubicación (con autocompletado por zona), selector de fecha, botón "Buscar". Debajo, tres accesos con icono: Búsqueda rápida · Sin comisión · Pago seguro. A la derecha, card flotante blanca "+2.500 Cocheras disponibles" con stack de avatares.
3. **Franja de beneficios** — 4 columnas con icono lineal, título y descripción corta.
4. **Cocheras destacadas** — eyebrow, H2 en dos líneas, bajada, botón "Ver todas las cocheras" alineado a la derecha. Carrusel de cards con dots de paginación. **Esta sección se alimenta de WordPress** (ver punto 5).
5. **Cómo funciona** — bloque oscuro. Columna izquierda con eyebrow, H2, bajada y botón "Comenzar ahora"; derecha, 3 cards numeradas (Buscá / Reservá / Disfrutá) con número en círculo e icono.
6. **Por qué elegirnos** — split. Izquierda: eyebrow, H2 "Más que cocheras, soluciones.", bajada y lista de 4 checks. Derecha: composición con foto, mockup de teléfono superpuesto, badge circular "+98% Clientes satisfechos" y card flotante "Zona Segura".
7. **Testimonios** — bloque oscuro. Izquierda: H2 + botón "Ver más testimonios". Derecha: 3 cards con 5 estrellas, comentario, avatar, nombre y zona. Dots.
8. **CTA final** — banda con gradiente azul→violeta, radius grande, título a la izquierda y botón blanco "Buscar cocheras ahora →".
9. **Footer** — oscuro, 4 columnas (Navegación / Legal / Soporte / Contacto) + bloque de marca con descripción y redes en círculos. Línea legal centrada abajo.

### Card de cochera (componente clave)

Imagen 4:3 · badge "DESTACADA" arriba a la izquierda (solo si corresponde) · botón corazón arriba a la derecha · título · ubicación con pin · precio grande + sufijo `/mes` en gris · fila de chips con features (icono + texto). Debe soportar 1, 2 o 3 chips sin romper el alto de la card.

---

## 5. Integración con WordPress

### 5.1 Fuente

Las cocheras ya están cargadas en un WordPress. El sitio nuevo es **headless**: no se toca el theme, no se renderiza nada desde WP.

### 5.2 Endpoint recomendado

Preferir un endpoint propio antes que consumir `/wp-json/wp/v2/<cpt>` en crudo. Crear un **mu-plugin** en WP:

```php
add_action('rest_api_init', function () {
  register_rest_route('cocheras/v1', '/listings', [
    'methods'  => 'GET',
    'permission_callback' => '__return_true',
    'callback' => 'cocheras_get_listings',
    'args' => [
      'per_page' => ['default' => 24],
      'page'     => ['default' => 1],
      'zona'     => [],
      'tipo'     => [],
      'destacada'=> [],
      'precio_min' => [],
      'precio_max' => [],
    ],
  ]);
});
```

Ventajas: un solo request por listado, sin N+1 de media, payload chico y estable, y control total de qué campos salen. Si no hay acceso para instalar el mu-plugin, caer a `/wp-json/wp/v2/<cpt>?_embed&per_page=100` y resolver imágenes desde `_embedded['wp:featuredmedia']`.

> Si los campos son de ACF y se usa la ruta estándar, hay que exponerlos: `show_in_rest` en el field group (ACF 5.11+) o el plugin *ACF to REST API*. Verificar antes de asumir.

### 5.3 Contrato de datos

Payload esperado por ítem:

```ts
type Cochera = {
  id: number;
  slug: string;
  titulo: string;
  zona: string;              // "Recoleta", "Palermo"...
  ciudad: string;            // "CABA"
  direccion?: string;
  precio: number;            // 55000
  moneda: 'ARS' | 'USD';
  periodo: 'mes';
  tipo: 'cubierta' | 'descubierta';
  features: string[];        // ["Seguridad 24hs", "Portón automático", "Cámaras"]
  destacada: boolean;
  disponible: boolean;
  imagenes: { url: string; alt: string; width: number; height: number }[];
  lat?: number;
  lng?: number;
};
```

Reglas:

- Mapper **whitelist**: campo que no está en el contrato, no entra. Nada de spread del objeto de WP.
- Validar con Zod en el borde. Si un ítem no valida, se descarta y se loguea; **nunca** romper el render de la grilla completa por un dato sucio.
- Formatear precio en el front con `Intl.NumberFormat('es-AR')` → `$55.000`. El sufijo `/mes` es presentación, no dato.
- Imágenes: usar las URLs de WP tal cual (sin descargar ni resubir), con `srcset` a partir de `media_details.sizes`, `loading="lazy"` salvo las dos primeras cards, y `width`/`height` siempre presentes para evitar CLS.

### 5.4 Autenticación

Si el CPT es público, no hace falta nada. Si hay campos o posts privados, usar **Application Passwords** con Basic Auth desde el server (Astro endpoint o build), **nunca** desde el cliente. Credenciales en variables de entorno de Dokploy:

```
WP_API_BASE=https://<dominio-wp>/wp-json
WP_APP_USER=
WP_APP_PASSWORD=
```

### 5.5 Caché e invalidación

- Build estático + `fetch` en build time para la home y el listado.
- Hook en WP (`save_post_<cpt>`, `deleted_post`) que dispare el **deploy hook de Dokploy** para regenerar. Con debounce para no encadenar builds al editar en tanda.
- Si se va a SSR: caché en memoria/Redis con TTL de 5–10 minutos y `stale-while-revalidate`.
- **Fallback obligatorio**: si WP no responde o devuelve error, servir el último snapshot cacheado en disco (`/data/cocheras.snapshot.json`). El sitio nunca queda sin cocheras porque se cayó el WordPress.

### 5.6 Paginación y filtros

- Respetar los headers `X-WP-Total` y `X-WP-TotalPages` si se usa la ruta estándar.
- Filtros del buscador (zona, fecha, tipo, rango de precio) por query params en la URL, para que las búsquedas sean compartibles e indexables.
- Con menos de ~300 cocheras, filtrar en cliente sobre el dataset cargado es aceptable y más rápido; por encima de eso, filtrar server-side.

---

## 6. Rutas

| Ruta | Contenido |
|---|---|
| `/` | Home del mockup |
| `/cocheras` | Listado completo con filtros y paginación |
| `/cocheras/[slug]` | Detalle: galería, features, precio, mapa, formulario de consulta |
| `/publicar` | Alta de cochera (formulario, sin backend en esta etapa) |
| `/como-funciona`, `/beneficios`, `/contacto` | Estáticas |

---

## 7. Calidad — no negociable

- Responsive real: 360 / 768 / 1024 / 1440. El hero y el split de "Por qué elegirnos" son los dos puntos que más se rompen; probarlos primero.
- Lighthouse ≥ 90 en Performance y ≥ 95 en Accesibilidad y SEO en la home.
- Foco de teclado visible en todos los interactivos; carrusel navegable con flechas y con teclado; `aria-label` en el botón de favorito.
- Contraste AA sobre los fondos oscuros (ojo con el texto gris sobre `ink-950`).
- Metadatos Open Graph, `sitemap.xml`, `robots.txt` y JSON-LD `Product`/`Offer` en el detalle de cochera.
- Imágenes del hero en formato moderno y con `fetchpriority="high"` la del LCP.

---

## 8. Entregables

1. Repo con el sitio, `.env.example` y README con: cómo correrlo, cómo se mapean los campos de WP y qué se asumió donde el mockup era ambiguo.
2. El mu-plugin de WordPress (si se toma esa ruta) como archivo aparte, listo para subir.
3. Deploy funcionando en el VPS vía Dokploy, con las variables de entorno cargadas.

---

## 9. A confirmar antes de arrancar

- URL del WordPress y nombre exacto del CPT de cocheras.
- Si los campos son ACF, Pods, JetEngine o meta plano, y si ya están expuestos en REST.
- Si hay acceso para instalar un mu-plugin o solo se puede leer la API estándar.
- Cómo están guardados hoy: zona (taxonomía o texto), precio (número o string), features (checkbox, taxonomía o texto libre), destacada (campo booleano o algún flag).
- Si el flujo de reserva/login es real en esta etapa o los botones son placeholders.
