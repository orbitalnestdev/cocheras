# Auditoría del proyecto Cocheras

**Fecha:** 20 de agosto de 2026 · **Repo:** `~/Documentos/Workspace/cocheras` · **Rama:** `main`

---

## 1. Resumen ejecutivo

El repositorio contiene un frontend **React 18 + Vite + TypeScript + Tailwind**, con 10 páginas, 5 componentes y un servicio que consume la REST API de WordPress de `cocheras.com.ar`. Funciona y trae datos reales.

Pero hay una brecha grande entre **lo que pide el brief/mockup** y **lo que está construido**. No es un problema de acabado: son dos productos distintos.

| Dimensión | Brief / mockup | Repo actual |
|---|---|---|
| Producto | Marketplace de alquiler de cocheras (búsqueda, reserva, publicar, login) | Sitio institucional de una inmobiliaria (Esteban Sucari, CUCICBA 6610) |
| Stack | Astro + islas React, SSR/SSG | SPA React + Vite, sin SSR |
| Secciones de la home | 9 exactas | 5, con 2 bloques inventados y 4 faltantes |
| Datos | Contrato tipado + Zod en el borde | Mapper ad-hoc, Zod instalado y **sin usar** |
| Fallback si WP cae | Snapshot obligatorio | Snapshot **vacío** → sitio sin cocheras |
| SEO | Lighthouse ≥90/95, OG, sitemap, JSON-LD | Un solo `<title>` global, nada más |

**Veredicto:** la capa de datos es aprovechable con retoques. La capa de presentación hay que rehacerla contra el mockup. Y hay **3 riesgos que no pueden llegar a producción** (ver §6).

---

## 2. Arquitectura actual

```
cocheras/
├── index.html                     ← único punto de SEO
├── src/
│   ├── App.tsx                    ← 17 rutas, 7 apuntan al mismo ListadoPage
│   ├── main.tsx
│   ├── index.css                  ← utilidades de gradiente/glass sueltas
│   ├── types/cochera.ts           ← contrato + esquema Zod (definido, nunca invocado)
│   ├── data/cocherasSnapshot.ts   ← array vacío
│   ├── services/wordpressService.ts  ← 600 líneas, clase estática
│   ├── components/
│   │   ├── layout/     Header · Footer
│   │   └── cocheras/   CocheraCard · InteractiveMap · WpStatusModal
│   └── pages/          Home · Listado · Single · Publicar · ComoFunciona
│                       Beneficios · Nosotros · Contacto · Prensa · Videos
├── wp-cocheras-api.php            ← mu-plugin (CPT 'cochera' + /cocheras/v1/listings)
└── public/data/cocheras.snapshot.json  ← 4 cocheras demo, no lo consume nadie
```

### Flujo de datos

```
WP REST /wp/v2/propiedad?per_page=100&_embed&page=N
        │  (paginación paralela por X-WP-TotalPages)
        ▼
mapRealHomesProperty()   ← mapper del theme RealHomes (meta REAL_HOMES_*)
        │  + geocoding por diccionario de 47 barrios/calles de CABA
        ▼
memoryCache (10 min) ⇄ sessionStorage 'cocheras_api_cache_v2'  [stale-while-revalidate]
        ▼
applyLocalFilters()  → componentes
```

Lo bueno: paginación dinámica sin tope, deduplicación de fetch concurrente, SWR real, `AbortController` con timeout de 25 s.

Lo malo:
- **Dos backends contradictorios.** El servicio habla con el CPT `propiedad` del theme RealHomes; el `wp-cocheras-api.php` registra un CPT `cochera` con meta plano y expone `/cocheras/v1/listings`. Nada consume ese endpoint. Hay que elegir uno.
- **Zod nunca corre.** El esquema existe en `types/cochera.ts:75-105` y no se importa en ningún lado. Un ítem sucio de WP entra crudo al render.
- **Snapshot vacío.** `cocherasSnapshot.ts:4` devuelve `[]`, y el JSON de `public/data/` no lo lee nadie. Si WP no responde, el catálogo desaparece.
- **`localStorage` como configuración de infraestructura.** La URL base de la API se lee de `localStorage` (`wordpressService.ts:7`). Ver §6.
- **Precio siempre oculto.** `consultarPrecio = true` está fijo (`wordpressService.ts:255`), así que ninguna propiedad muestra precio nunca, aunque el dato exista. El mockup muestra `$55.000 /mes` como elemento central de la card.

---

## 3. Sistema de diseño: definido pero no adoptado

`tailwind.config.js` traduce el brief con fidelidad — y luego **casi nadie lo usa**.

| Token | Definido | Usos reales |
|---|---|---|
| `ink-950 / 900` | ✅ | Solo Footer y WpStatusModal |
| `paper-*` | ✅ | **0 usos** en componentes |
| `violet-500` | ✅ | **0 usos** |
| `star` (#FBBF24) | ✅ | **0 usos** (se usa `amber-400` a mano) |
| `muted-light` | ✅ | **0 usos** |
| `rounded-card / floating / banner` | ✅ | **0 usos** (se usa `rounded-xl/2xl/3xl`) |
| `shadow-card-soft / card-hover / glow-brand` | ✅ | **0 usos** |

En su lugar aparecen `slate-*` de Tailwind por defecto y **hex crudos**: `InteractiveMap.tsx:15-16, 134, 141-144` escribe `#2563EB` a mano — que *es* `brand-600` — y `#0F172A` como si fuera `ink-950` (que en realidad es `#070A18`). Dos fuentes de verdad para el color de marca.

Además hay **clases que no existen** y por lo tanto no pintan nada:
- `text-brand-400` → Header 113/131/253, CocheraCard 67, WpStatusModal 96
- `animate-fadeIn` → Header 118/236, WpStatusModal 34 (no está ni en config ni en CSS)

**Tipografía:** el brief pide Plus Jakarta Sans **self-hosted**; `index.html:11` la carga desde el CDN de Google Fonts. Afecta LCP y suma un tercero.

---

## 4. Fidelidad al mockup

El brief es explícito: *"El diseño no está a discusión: es la especificación."*

### Home — 9 secciones pedidas

| # | Sección | Estado |
|---|---|---|
| 1 | Header sticky con nav de 6 items + Iniciar Sesión / Registrarse | ⚠️ **Nav completamente distinto** |
| 2 | Hero: pill "#1", H1 en 3 líneas, barra ubicación+fecha+Buscar, 3 accesos, card flotante "+2.500" | ⚠️ Parcial: falta pill, selector de fecha, card flotante |
| 3 | Franja de beneficios, 4 columnas | ❌ **Falta** |
| 4 | Cocheras destacadas — carrusel con dots | ⚠️ Es una grilla estática de 6 |
| 5 | Cómo funciona — bloque oscuro, 3 cards numeradas | ⚠️ Existe, pero en fondo claro |
| 6 | Por qué elegirnos — split, foto + mockup de teléfono + badge "+98%" + card "Zona Segura" | ❌ **Falta por completo** |
| 7 | Testimonios — 3 cards con estrellas + dots | ❌ **Falta por completo** |
| 8 | CTA final con gradiente azul→violeta | ✅ |
| 9 | Footer, 4 columnas | ⚠️ Tiene 5 |

### Bloques inventados (el brief los prohíbe: *"No inventar secciones nuevas"*)

- **Mapa Leaflet** en la home (`HomePage.tsx:211-229`)
- **Card de agente verificado** en el hero (`HomePage.tsx:172-202`)

### Header: la divergencia más profunda

| Mockup | Código |
|---|---|
| Inicio | ausente (solo el logo linkea) |
| Buscar Cocheras | ausente → dropdown "Propiedades" |
| Publicar Cochera | **eliminado a propósito** (comentario en `Header.tsx:199`) |
| Cómo Funciona | ausente |
| Beneficios | ausente |
| Contacto | como CTA, no como item |
| Iniciar Sesión / Registrarse | **no existe ningún flujo de auth** |

Y `/beneficios` **no está ruteada en `App.tsx`**: `BeneficiosPage.tsx` es código muerto, con una ruta que el brief exige.

### Card de cochera

El mockup pide: imagen 4:3 · badge DESTACADA · corazón · título · ubicación · **precio grande + `/mes` en gris** · chips de features.
El código: imagen 16:10, chips OK, y **el precio no se muestra nunca** (§2). Es el dato que más pesa en la decisión de compra.

---

## 5. Contenido: el problema más serio

El repositorio afirma seguir una *"strict zero fake data policy"* (`cocherasSnapshot.ts:3`). En la práctica hay contenido inventado presentado como hecho:

- **`PrensaPage.tsx:6-47`** — 4 notas con titular, fecha y bajada específicos **atribuidas a La Nación, Infobae, El Cronista y Clarín**. Los `url` apuntan a la home de cada medio, mientras el CTA dice "Leer nota completa en {medio}". Riesgo legal y reputacional directo.
- **`SingleCocheraPage.tsx:227`** — `{cochera.superficie || 14} m²`: inventa 14 m² cuando WP no trae el dato. Y `:219` inventa "Portón Automático".
- **`SingleCocheraPage.tsx:358`** — "Expensas y gastos incluidos", hardcodeado para toda propiedad.
- **`PrensaPage.tsx:32`** — "más de 1.8 millones de vehículos en circulación en Capital Federal", sin fuente.
- **`VideosPage.tsx:21,24,54`** — "Renta Mensual Asegurada", "renta garantizada desde el día 1", "renta anual constante": promesas financieras sin respaldo.
- **`NosotrosPage.tsx:19`** — "la única inmobiliaria que ofrece…": claim absoluto no verificable.

**Contradicciones internas:**

| Dato | Versión A | Versión B |
|---|---|---|
| Fundador | **Esteban** Sucari (Home, Nosotros, Videos) | **Alberto** Sucari (`PrensaPage.tsx:12`) |
| Marca | Cocheras.com.ar | **ECOCHERAS** (`NosotrosPage.tsx:13,19,97`) |
| WhatsApp | 5491136920920 (Footer) | 5491149973559 (`InteractiveMap.tsx:295`) |

**Formularios que mienten:** los 3 formularios (contacto, consulta de propiedad, publicar) solo hacen `setState(true)` y muestran "¡Consulta Recibida! Te responderemos a la brevedad". **Ningún lead se envía a ningún lado.** El de publicar además promete que "se sincronizará automáticamente en la plataforma".

Y `ComoFuncionaPage.tsx:77` le dice al visitante que las propiedades "son administradas desde el WordPress oficial" — implementación filtrada al usuario final, justo lo contrario de headless.

---

## 6. Riesgos bloqueantes

### 🔴 1 — XSS en el mapa
`InteractiveMap.tsx:138-149` construye el popup con `innerHTML` interpolando `titulo`, `direccion` e `imagenDestacada` **sin escapar**. Cualquier editor de WordPress (o un WP comprometido) puede inyectar script en todos los visitantes. Es la vulnerabilidad más seria del repo.

### 🔴 2 — Panel de debug reconfigurable en producción
`WpStatusModal` está montado sin guarda de entorno desde `Header.tsx:325`, con su botón visible en la barra superior. Permite a **cualquier visitante**:
- Cambiar la URL base de la API (`WpStatusModal.tsx:23` llama a `setBaseUrl` **antes** de validar la conexión) y persistirla en `localStorage` → el catálogo pasa a servirse desde un origen arbitrario, de forma persistente entre sesiones.
- Ver la URL real del WordPress, confirmar el uso de REST API y leer el nombre y ruta del mu-plugin.

### 🔴 3 — Sin fallback: si WP cae, el sitio queda vacío
`useFallbackIfError: false` + snapshot `[]`. El brief lo marca como *"fallback obligatorio"*.

### 🟠 Otros

- **Fuga de memoria + loop de render en el mapa.** `InteractiveMap.tsx:167`: el efecto depende de `selectedCochera` y llama `setSelectedCochera` dentro; destruye y recrea todos los marcadores en cada click, cerrando el popup recién abierto. Y no hay cleanup con `map.remove()` → la instancia sobrevive al desmontaje.
- **Tiles de Google no oficiales.** `InteractiveMap.tsx:93` usa `mt1.google.com/vt` sin API key: fuera de términos de servicio, se puede cortar sin aviso.
- **Bug de paginación.** `ListadoPage.tsx:107-117` no resetea `currentPage` al cambiar de ruta; las 7 rutas comparten el componente → pantalla vacía sin mensaje.
- **Filtros de precio no van a la URL** (`ListadoPage.tsx:160-165`) → búsquedas no compartibles, se pierden al recargar.
- **Filtro por sección por texto libre.** `/oficinas` filtra buscando la palabra "Oficina" en el título del post, en vez de usar taxonomía.
- **Sin `try/catch`** en `ListadoPage` ni `SingleCocheraPage`: si el fetch rechaza, spinner infinito.
- **Autoplay forzado** en `VideosPage.tsx:84` al entrar a `/videos`.
- **Leaflet importado estáticamente** (~150 KB en el chunk inicial aunque la ruta no use mapa).
- **Enlaces legales rotos:** `Footer.tsx:103,106` → `href="#terminos"` y `#privacidad`, sin destino. Contenido legalmente exigible.

---

## 7. Accesibilidad y SEO

**Accesibilidad** — 5 atributos `aria-*` en todo `src/`. Ningún `<label htmlFor>` en ningún formulario.

- Dropdown "Propiedades" **solo abre con hover** → inalcanzable por teclado y en touch.
- Menú móvil sin focus trap, sin `Escape`, sin devolver el foco.
- `WpStatusModal` sin `role="dialog"`, sin `aria-modal`, sin focus trap, sin `Escape`, sin cierre por backdrop.
- Cards de video: `onClick` sobre `<div>`, sin `role`/`tabIndex` → grilla inoperable sin mouse.
- Marcadores del mapa sin nombre accesible ni alternativa en lista.
- Botón de favorito sin `aria-pressed`; el estado no persiste.
- `text-slate-400` sobre blanco (`CocheraCard.tsx:104`) ≈ 2.9:1 → **falla AA**. Abundan `text-[10px]` y `text-[11px]`.
- `focus:outline-none` sin reemplazo de `focus-visible` en varios sitios.

**SEO** — el brief pide Lighthouse ≥95. Estado real:

- Un único `<title>` y `<meta description>`, en `index.html`. Ninguna ruta setea meta propio.
- Sin Open Graph, sin canonical, sin `sitemap.xml`, sin `robots.txt`.
- Sin JSON-LD `Product`/`Offer` en el detalle — es la página que más lo necesita.
- SPA sin prerender: los crawlers ven un `<div id="root">` vacío.
- Imágenes sin `width`/`height` ni `srcset` → CLS. El hero (LCP) sin `fetchpriority="high"`.

---

## 8. Qué se salva y qué se rehace

**Se salva (con retoques):**
- `wordpressService.ts` — la paginación paralela, el SWR y el mapper de RealHomes valen. Falta cablear Zod, arreglar el precio y sacar la config de `localStorage`.
- `types/cochera.ts` — el contrato está bien pensado.
- `tailwind.config.js` — traduce el brief con fidelidad, solo hay que **usarlo**.
- `Footer.tsx` — el componente más limpio.
- `wp-cocheras-api.php` — buena base, pero hay que decidir si el CPT es `cochera` o `propiedad`.

**Se rehace:**
- Home completa, contra el mockup, sección por sección.
- Header (nav + auth).
- `CocheraCard` (4:3, precio visible, tokens del DS).
- `InteractiveMap` — o se elimina de la home (el brief no lo pide) y se conserva solo en el listado, reescrito.
- Toda la capa de contenido inventado: Prensa, Videos, claims de Beneficios/Nosotros.
- Los 3 formularios: necesitan backend real.

---

## 9. Plan sugerido

**Fase 0 — Frenar los riesgos (1 día)**
Escapar el popup del mapa · `WpStatusModal` detrás de `import.meta.env.DEV` · snapshot real en disco · cleanup del mapa · `try/catch` en los fetch.

**Fase 1 — Decidir la arquitectura**
Headless (Astro/React contra WP REST) vs. theme nativo de WordPress. Ver §10.

**Fase 2 — Datos**
Un solo CPT y un solo endpoint. Zod en el borde. Precio real. Taxonomías en vez de filtros por texto. Zonas derivadas del dataset.

**Fase 3 — UI contra el mockup**
Las 9 secciones en orden, con los tokens del DS. Sin secciones inventadas.

**Fase 4 — Contenido**
Sacar lo inventado. Unificar fundador, marca y teléfono. Prensa y Videos desde el CMS. Términos y Privacidad reales.

**Fase 5 — Calidad**
A11y (labels, focus trap, teclado, contraste) · SEO (meta por ruta, OG, sitemap, JSON-LD) · imágenes con dimensiones y `srcset` · Lighthouse.

**Fase 6 — Deploy**
Hosting + dominio + SSL + variables de entorno + webhook de invalidación.

---

## 10. La decisión que hay que tomar antes de seguir

Dijiste que lo vamos a desarrollar **en WordPress**. Eso admite dos caminos muy distintos, y conviene fijarlo antes de escribir una línea:

**A — WordPress headless (lo que pide el brief).** WP queda como panel de carga; el front es React/Astro y consume la REST API. Se aprovecha casi todo el repo actual. Requiere dos deploys (WP + front) y un webhook de invalidación.

**B — Theme nativo de WordPress.** Se traduce el mockup a un theme (bloques o PHP clásico), con CPT + ACF. Un solo hosting, editable desde el admin, SEO resuelto de fábrica con Yoast/RankMath. Se descarta el código React actual y se reescribe la UI en PHP/Twig.

**C — Híbrido:** theme de WP para las páginas de contenido (Nosotros, Prensa, Videos, legales) y una isla React embebida solo para el buscador y el listado.

Para arrancar necesito de tu lado:

1. **URL del WordPress** y si es el `cocheras.com.ar` actual o una instalación nueva.
2. **Acceso**: usuario admin o Application Password, y si puedo subir un mu-plugin.
3. **CPT real** y cómo están guardados hoy zona, precio, features y "destacada" (¿ACF, RealHomes, meta plano?).
4. **Hosting para publicar**: ¿ya hay VPS/Dokploy, o lo levantamos?
5. **Alcance del marketplace**: ¿login, registro y reserva son reales en esta etapa, o los botones son placeholders?
6. **Contenido**: ¿tenés las notas de prensa reales, los testimonios reales y los datos verificados de la empresa? Sin eso, esas secciones salen con placeholders declarados como tales.
