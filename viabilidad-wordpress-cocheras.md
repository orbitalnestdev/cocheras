# ¿Se puede llevar el diseño a `cocheras.adamastest.com.ar`?

**Veredicto: sí, se puede.** El sitio es una copia de staging del cocheras.com.ar real, con 244 propiedades cargadas y toda la infraestructura necesaria ya instalada. No hay que migrar datos ni cambiar de theme.

Pero hay **un bloqueante de producto** (no técnico) que hay que resolver antes de escribir código: el mockup vende *alquiler* y el inventario es 99% *venta*. Detalle en §4.

---

## 1. Qué encontré en el WordPress destino

Auditado el 20/08/2026 desde la REST API pública y el HTML del sitio.

### Theme

| | |
|---|---|
| Theme padre | **RealHomes 4.5.0** — InspiryThemes (ThemeForest) |
| Theme hijo | **RealHomes Child Theme 1.4.2** — ✅ **ya existe** |
| Text domain | `framework` |

Que el child theme ya esté creado es la mejor noticia del análisis: es el lugar exacto donde va el diseño nuevo, sin tocar el theme padre ni perder nada al actualizar.

### Plugins detectados (vía namespaces de la REST API)

Elementor · **Elementor Pro** · Elementor AI · Slider Revolution 6.7.40 · **Contact Form 7** · **Wordfence** · **LiteSpeed Cache** · Code Snippets · String Locator · WP Rollback · MailChimp for WP · TrustIndex

Relevancia:
- **Elementor Pro** → Theme Builder disponible (headers, footers, templates de single y archive sin código).
- **Contact Form 7** → los formularios del mockup (contacto, consulta, publicar) tienen backend real sin instalar nada.
- **Wordfence** → puede bloquear la edición de archivos desde el admin. Probablemente haga falta SFTP.
- **LiteSpeed Cache** → hay que purgar en cada deploy y excluir rutas dinámicas.

### Datos: el CPT `property`

```
CPT:  property   →  REST: /wp-json/wp/v2/propiedad   (público y legible ✅)
Total: 244 propiedades
```

**Taxonomías** (ojo: los `rest_base` están en español)

| Taxonomía | REST base | Términos | Contenido |
|---|---|---|---|
| `property-type` | `tipo-propiedad` | 8 | Cocheras particulares (215) · Cocheras (20) · Departamentos (7) · Emprendimiento (7) · Oportunidades (7) · Cocheras con Pool de Renta (6) · Garages y playas (3) · Oficina (2) |
| `property-city` | `ciudad-propiedad` | 60, jerárquica | CABA (139) → San Nicolás (33) · Palermo (33) · Belgrano (30) · Balvanera (26) · Recoleta (20) · Monserrat (17) · Caballito (9) · Almagro (9) · Núñez (7)… |
| `property-status` | `estado-propiedad` | 2 | **Venta: 238 · Alquiler: 2** |
| `property-feature` | `prestación-propiedad` | por confirmar | El `rest_base` tiene tilde y no respondió desde afuera |

**Meta relevante** (prefijo `REAL_HOMES_`, expuesto en `property_meta`):

`property_price` · `property_price_prefix` / `_postfix` · `property_size` · `property_id` · `featured` · `property_address` · `property_location` (lat/lng) · `property_images` · `property_agents` · `inspiry_video_group` · `additional_details_list`

Ejemplo real (id 12871): precio `1960000`, postfix vacío, address *"Marcelo Torcuato de Alvear 1200"*, `featured: 0`, `property_id: RH-12871-property`, size vacío.

### Lo que RealHomes ya resuelve (y que pediste como "todo funcional")

Elegiste alcance completo. Buena parte ya viene de fábrica con el theme:

- Registro, login y **login por OTP**
- Panel de usuario, favoritos, **comparador de propiedades**
- Buscador avanzado con filtros: palabra clave, ubicación, venta/alquiler, tipo, rango de precio separado para venta y alquiler
- Agentes y agencias (CPTs `agent` / `agency`), galería, video tour, tour 360°, planos, mapa
- Agendar visita (`ere_property_schedule_tour`)

**Construir esto desde cero sería tirar meses de trabajo ya hecho.** Es el argumento más fuerte para quedarse en RealHomes y sólo reemplazar la piel.

---

## 2. Las tres rutas posibles

### 🟢 A — Child theme override *(recomendada)*

Se sobreescriben las plantillas de RealHomes desde `realhomes-child`: `front-page.php`, `header.php`, `footer.php`, el partial de la card de propiedad, `single-property.php` y el archive. Tailwind se compila a un CSS estático y se encola desde el child.

- ✅ Fidelidad total al mockup, control del markup → Lighthouse alcanzable
- ✅ Se conservan las 244 propiedades, el buscador, cuentas, favoritos y comparador
- ✅ Cero migración de datos
- ⚠️ Requiere SFTP y disciplina con la jerarquía de plantillas del theme
- ⚠️ Al actualizar RealHomes hay que revisar los overrides

### 🟡 B — Elementor Pro Theme Builder

Se arma el diseño con widgets de Elementor, sin tocar archivos.

- ✅ Editable por vos después, sin código
- ✅ Ya hay templates de Property Listing armados en el sitio
- ⚠️ Pixel-perfect contra el mockup es lento y frágil
- ⚠️ Markup pesado → el objetivo de Lighthouse ≥90 del brief se complica
- ⚠️ El gradiente del H1, la card flotante del hero y el mockup de teléfono necesitan CSS custom igual

### 🔴 C — Theme propio desde cero

Máximo control y performance, pero se pierden buscador avanzado, cuentas, OTP, favoritos, comparador, agentes y galería. Con alcance "todo funcional", **no lo recomiendo**.

### ⭐ Mi recomendación: A con toques de B

Child theme para la piel (home, header, footer, card, single, archive) + se conservan los módulos funcionales de RealHomes reestilizados + Elementor queda disponible para las páginas de contenido (Nosotros, Prensa, legales) que vas a querer editar sin llamarme.

---

## 3. Cómo mapea el mockup contra los datos reales

| Elemento del mockup | Fuente en WP | Estado |
|---|---|---|
| Card: imagen 4:3 | featured image / `REAL_HOMES_property_images` | ✅ |
| Card: título | `post_title` | ✅ |
| Card: ubicación con pin | taxonomía `ciudad-propiedad` | ✅ |
| Card: precio `$55.000 /mes` | `REAL_HOMES_property_price` | ⚠️ está en **USD** y es precio de **venta** |
| Card: badge DESTACADA | `REAL_HOMES_featured` | ⚠️ hay que ver cuántas lo tienen en `1` |
| Card: chips de features | `prestación-propiedad` | ⚠️ verificar si está poblada |
| Card: corazón favoritos | favoritos nativos de RealHomes | ✅ |
| Hero: buscador ubicación + fecha | buscador avanzado de RealHomes | ⚠️ tiene precio y tipo, **no tiene fecha** |
| Hero: "+2.500 cocheras" | — | ❌ el número real es **244** |
| Destacadas: carrusel | query por `featured` | ✅ una vez marcadas |
| Testimonios | TrustIndex (ya instalado) o CPT nuevo | ⚠️ hacen falta testimonios reales |
| Cómo funciona / Beneficios / CTA | estático en el theme | ✅ |
| Footer 4 columnas | menús de WP | ✅ |
| Iniciar Sesión / Registrarse | login + OTP de RealHomes | ✅ |

---

## 4. Bloqueantes — resolver antes de codear

### 🔴 1. El mockup vende alquiler; el inventario es venta

El diseño dice *"#1 EN ALQUILER DE COCHERAS"*, *"Alquilá cocheras en minutos"*, *"$55.000 **/mes**"*. Los datos dicen **238 en venta, 2 en alquiler**, en dólares, con precios de u$s16.500 a u$s1.960.000.

Tres salidas posibles:

- **(a)** Adaptar el copy del mockup a venta+alquiler y mostrar el precio real en USD. Es lo honesto y lo rápido.
- **(b)** Cargar inventario real de alquiler en el WordPress antes de lanzar, y dejar el mockup como está.
- **(c)** Construir el diseño con precio "Consultar" y sin `/mes`, como hace el React actual — pero entonces se pierde el dato que más pesa en la decisión del usuario.

**Necesito que elijas.** Sin esto, cualquier home que construya va a mentir.

### 🟠 2. Moneda

Precios en **USD** (u$s). El mockup los muestra en pesos. Hay que definir si se muestra USD, ARS, o ambos con cotización.

### 🟠 3. "+2.500 cocheras disponibles"

El número real es 244. O se ajusta el copy, o se saca la card flotante del hero.

### 🟠 4. Datos incompletos para las cards

En la propiedad de muestra, `REAL_HOMES_property_size` está **vacío** y `featured` en **0**. Si eso se repite en las 244, la fila de chips y el carrusel de destacadas quedan sin contenido. Hay que auditar campo por campo desde el admin y completar lo que falte.

### 🟡 5. Identidad de marca contradictoria

El sitio real dice **"Alberto"**, *Mat. CUCICBA 6610*, marca **"ECOCHERAS Y EINVERSIONES"**, tel. *11 4997-3559*.
El proyecto React dice **"Esteban Sucari"**, *CUCICBA 6610 / CMPCSI 6068*, marca *"Cocheras.com.ar"*.
El mockup dice simplemente **"COCHERAS"**.

Tres identidades distintas. Decime cuál es la buena.

### 🟡 6. Restos del demo import

Hay contenido en francés (`liste-des-proprietes-pleine-largeur`, "Liste des Propriétés Pleine Largeur"). Limpieza pendiente.

---

## 5. Plan de implementación

**Fase 0 — Acceso y relevamiento interno (medio día)**
Entrar al admin, confirmar que el child theme está activo, listar plugins reales, auditar cuántas propiedades tienen `featured`, `size` y features cargados, y hacer backup.

**Fase 1 — Base del child theme (1–2 días)**
Compilar Tailwind con los tokens del brief a un CSS estático · encolar desde el child · self-hostear Plus Jakarta Sans · desregistrar los estilos de RealHomes que estorben.

**Fase 2 — Header y footer (1 día)**
Nav de 6 items del mockup · botones Iniciar Sesión / Registrarse cableados al login+OTP de RealHomes · footer de 4 columnas con menús de WP.

**Fase 3 — Home, las 9 secciones en orden (3–4 días)**
Hero con buscador de RealHomes reestilizado · franja de beneficios · carrusel de destacadas desde el CPT · cómo funciona · por qué elegirnos · testimonios · CTA gradiente.

**Fase 4 — Card, archive y single (2–3 días)**
Card del mockup como partial reutilizable · listado con los filtros de RealHomes · ficha de propiedad con galería, features, mapa y formulario CF7.

**Fase 5 — Funcional (2 días)**
Formularios reales con CF7 → email + registro del lead · favoritos y comparador reestilizados · publicar cochera.

**Fase 6 — Calidad y salida (1–2 días)**
Accesibilidad · SEO (el sitio ya tiene estructura, falta OG y JSON-LD) · purga de LiteSpeed · pasada de Lighthouse · limpieza del contenido en francés.

---

## 6. Qué necesito de vos para arrancar

1. **Usuario admin** de `cocheras.adamastest.com.ar` (o Application Password).
2. **SFTP/FTP o panel de hosting** — es lo que habilita la ruta A. Sin esto sólo queda Elementor.
3. **Decisión sobre venta vs alquiler** (§4.1) y sobre la moneda (§4.2).
4. **Identidad correcta**: nombre del titular, marca y matrícula (§4.5).
5. **Confirmación** de que puedo tocar el ambiente de test libremente (hago backup igual).
