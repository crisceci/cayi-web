# Cayi Studio — Web

Sitio web público de Cayi Studio (fotografía y video para eventos corporativos, estudio, publicidad y contenido de marca). Es un sitio estático — no necesita build ni instalar nada — con un **panel de administrador** para editar todo el contenido (textos, colores, imágenes, videos) sin tocar código.

Está inspirado en la estructura de [maiafilms.pe](https://maiafilms.pe/) (productora audiovisual), pero con identidad propia de **Cayi Studio**: paleta ink/naranja, tipografía Lexend, iconos de línea dibujados a mano y animaciones reales (no plantilla genérica).

### Pasada de rediseño (auditoría anti-genérico)

Se auditó el diseño con la skill `redesign-skill` (más `soft-skill` e `impeccable` como referencia) para identificar patrones que se ven "hechos por IA". Cambios concretos que salieron de esa auditoría:

- **Las 4 secciones de tarjetas seguidas (Servicios, Portafolio, Testimonios, Clientes) usaban la misma caja con borde+sombra** — el patrón más genérico de todos. Ahora Servicios y Testimonios ya no tienen caja (un filete superior y una comilla grande los diferencian); Portafolio y Clientes sí mantienen tarjeta porque enmarcan una imagen/logo.
- **Textura de grano de película sutil** sobre toda la página (`.grain-overlay` en `css/style.css`) — rompe la planitud total, sin necesitar ninguna imagen.
- **Un solo acento dominante**: las etiquetas pequeñas ("kicker") pasaron de rosa a naranja oscuro; el rosa fucsia queda solo en los 2 botones donde el cliente pidió variedad, en vez de repetirse en cada sección.
- **Accesibilidad**: el foco del teclado en el formulario se había quedado sin indicador visible (`outline:none` sin reemplazo) — ahora tiene un anillo de foco visible en todo el sitio.
- **Rendimiento de animación**: el brillo del splash animaba `left` (fuerza reflow); ahora anima `transform` (acelerado por GPU).
- **Menú con sección activa resaltada** al hacer scroll (antes no había ninguna indicación de en qué sección estabas).
- **Meta tags Open Graph/Twitter** para que el link se vea bien al compartirlo en WhatsApp/redes.
- **Página de política de privacidad** creada y enlazada (el checkbox del formulario la mencionaba pero no existía).
- Títulos con Title Case inconsistente pasados a minúscula natural en español; nombres de testimonios variados en vez de "Nombre Apellido" repetido 3 veces.

Quedaron **27 skills de diseño instaladas globalmente** en `~/.claude/skills/` (de los repos `emilkowalski/skills`, `leonxlnx/taste-skill` y `pbakaus/impeccable`) para futuras rondas de pulido — cubren animación, tipografía, layout, y auditorías de "taste" en general.

### Animaciones instaladas

El sitio usa dos librerías gratuitas por CDN (no requieren instalación local, ya están enlazadas en `index.html`):

- **[AOS](https://michalsnik.github.io/aos/)** (Animate On Scroll) — las secciones aparecen con fade al hacer scroll (`data-aos="fade-up"`, etc. en el HTML).
- **[GSAP](https://gsap.com/)** — anima la entrada del texto del héroe (aparece en cascada), el video destacado (fade + zoom suave), y la pantalla de bienvenida en `js/main.js`.

Si quieres más movimiento (parallax, transiciones entre secciones, texto que se divide en letras), GSAP ya está cargado — solo hay que agregar más animaciones en `js/main.js`; no hace falta instalar nada nuevo.

### Pantalla de bienvenida ("Cayi Studio")

Cada vez que alguien carga o recarga la web, aparece primero una pantalla negra de pantalla completa con "Cayi Studio" armándose letra por letra desde los costados, más un pequeño acorde ascendente (do-mi-sol) — y recién después se revela la página. Todo vive en:

- HTML: bloque `#splash` al inicio de `index.html`.
- CSS: sección "splash de bienvenida" en `css/style.css`.
- JS: función `splash()` en `js/main.js` (usa GSAP para animar las letras y Web Audio API para generar el sonido — no hay ningún archivo de audio de por medio, el sonido se sintetiza en el navegador).

Detalles a tener en cuenta:
- **El sonido puede no sonar la primera vez**: los navegadores bloquean el audio automático hasta que la persona interactúa con la página (política estándar de Chrome/Safari/Firefox, no es un bug). La animación visual siempre se ve igual, con o sin sonido.
- Respeta la preferencia de "reducir movimiento" del sistema operativo — si alguien la tiene activada, el splash se salta la animación y muestra la web directo.
- Si quieres cambiar el texto, el color de "yi", la duración, o quitar el sonido, todo está comentado en los tres archivos de arriba.

## Panel de administrador (`admin.html`)

Todo el contenido editable de la web (textos, colores, el video del héroe, y las imágenes de portafolio, servicios, nosotros, testimonios, clientes y contacto) se edita desde `admin.html` — un panel con contraseña, igual al [Panel Cayi Studio](../CAYI%20STUDIO) que ya usas, así que la mecánica te va a resultar familiar. Los cambios se guardan en Supabase (gratis) y se reflejan **al instante** en la web pública, sin necesidad de volver a publicar nada.

### 1. Configurar Supabase (una sola vez)

Puedes **reutilizar el mismo proyecto de Supabase** que ya tienes para Cayi Studio (recomendado, todo en un solo lugar) o crear uno nuevo:

1. Entra a [supabase.com](https://supabase.com) → tu proyecto existente de Cayi Studio, o crea uno nuevo gratis.
2. Ve a **SQL Editor** → **New query**, pega todo el contenido de [`supabase-schema.sql`](./supabase-schema.sql) de esta carpeta y dale **Run**. Esto crea la tabla `cayi_web_content` (el contenido de la web) y un bucket `cayi-web-assets` (para las fotos/videos que subas desde el panel) — no toca las tablas `clients`/`projects` de Cayi Studio si usas el mismo proyecto.
3. Ve a **Project Settings** → **API**. Copia el **Project URL** y la **anon public** key.
4. Abre [`supabase-config.js`](./supabase-config.js) de esta carpeta y pega esos dos valores:
   ```js
   window.SUPABASE_URL = "https://tu-proyecto.supabase.co";
   window.SUPABASE_ANON_KEY = "tu-anon-key-aqui";
   ```
5. Guarda y sube el cambio a GitHub (`git add supabase-config.js && git commit -m "Configurar Supabase" && git push`).

### 2. Cambiar la contraseña del panel

Dentro de [`admin.html`](./admin.html), busca esta línea cerca del inicio del `<script>`:

```js
var PASSCODE = "CayiWeb2026";
```

Cámbiala por la que quieras usar, guarda, y sube el cambio a GitHub.

### 3. Usar el panel

1. Abre `admin.html` en el navegador (o `tusitio.netlify.app/admin.html` una vez publicado) e ingresa la contraseña.
2. Vas a ver secciones desplegables: Héroe, Portafolio, Servicios, Nosotros, Testimonios, Clientes, Contacto y Colores.
3. En los campos de imagen/video puedes **pegar una URL** o darle a "Subir archivo" para subir la foto/video directo desde tu computadora o celular (se guarda en el bucket de Supabase). El campo "Video del héroe" dentro de **Héroe** es tu reel principal: sube ahí tu video ya editado (recopilando tus mejores trabajos) y se reproduce automático, sin sonido, en loop, apenas alguien entra a la web.
4. Dale a **Guardar cambios** (arriba). Los cambios se aplican al instante en la web pública — no hace falta volver a publicar en Netlify/GitHub.
5. `admin.html` tiene `<meta name="robots" content="noindex, nofollow">` para que no aparezca en buscadores, pero la contraseña es la única protección real — no compartas el link ni la contraseña.

### Cómo funciona la seguridad

Igual que en Cayi Studio: la contraseña es una capa simple para uso del equipo, no cifrado de nivel bancario. La llave `anon` de Supabase es pública por diseño — la protección depende de la contraseña del panel, no de las políticas de la base de datos (que dejan lectura/escritura abiertas a quien tenga esa llave).

## Cómo editarlo sin el panel (opcional)

Si prefieres editar directamente en el código en vez de usar `admin.html`: todo el texto de respaldo está en `index.html` (Ctrl+F / Cmd+F para buscar), y ese es el contenido que se ve si Supabase no está configurado. Los estilos están en `css/style.css`. Ten en cuenta que si editas `index.html` directamente **y** ya guardaste algo desde el panel, gana lo que esté guardado en Supabase (el panel sobrescribe el HTML en tiempo real).

### Colores de marca (en `css/style.css`, arriba de todo — y también editables desde el panel)

```css
--bg:#FFFFFF;     /* fondo base de toda la web — blanco, para que se vea limpio y profesional */
--ink:#221812;    /* header, footer y CTAs de contraste */
--orange:#EF8B3C; /* acento principal (botones, iconos) */
--pink:#C81760;   /* acento secundario (solo en etiquetas pequeñas "kicker") */
--teal:#1C8C7C;   /* acento terciario (solo en el botón "Ver Portafolio") */
```

El diseño usa **blanco + ink + naranja** como base (como el header negro y los botones mostaza de referencias tipo Maia Films) y reserva el rosa/teal para detalles puntuales — evita que se vea "arcoíris" o genérico.

### Tipografía

`Lexend` en todo el sitio (titulares en negrita/extra-negrita, texto de cuerpo en regular/medio) — una sola familia tipográfica, cargada gratis desde Google Fonts. Se eligió por ser moderna, muy legible (está diseñada específicamente para maximizar la fluidez de lectura) y menos común en plantillas genéricas que Inter/Roboto/Manrope. No tiene cursiva real, así que el acento "yi" del logo se distingue solo por color, no por itálica. Si quieres probar otra tipografía, cámbiala en la línea `<link href="https://fonts.googleapis.com/css2?family=...">` de `index.html`, `admin.html` y `politica-de-privacidad.html`, y en `--font-display`/`--font-body` de `css/style.css` (y en `admin.html`, que tiene sus propias variables).

### Fotos de referencia

El héroe, "Nosotros", las 6 tarjetas de Portafolio y los avatares de Testimonios usan fotos de [picsum.photos](https://picsum.photos) (con una URL fija por `seed`, así no cambian entre recargas) para que puedas ver cómo se ve la web con fotos reales en vez de placeholders vacíos. Tienen un filtro CSS de "duotono" (`--ink` → `--orange`, ver sección "Tratamiento de marca para fotos de referencia" en `css/style.css`) para que fotos de stock random se sientan parte del mismo sistema visual en vez de imágenes sueltas — el filtro se aplica a cualquier imagen automáticamente, así que tus fotos reales también lo van a tener a menos que lo quites. Reemplaza estas URLs por tus fotos reales desde el panel de administrador (o directamente en el HTML) en cuanto las tengas — son de un banco de imágenes genérico, no fotos reales de Cayi Studio.

### El formulario de contacto (funciona en cualquier hosting)

El `<form>` de la sección "Contáctanos" usa **[FormSubmit](https://formsubmit.co)** — gratis, sin necesidad de crear cuenta ni backend, y funciona igual en Vercel, Netlify o GitHub Pages. Antes de publicar:

1. Abre `index.html`, busca `action="https://formsubmit.co/hola@cayistudio.pe"` (dentro de la sección Contacto) y cambia `hola@cayistudio.pe` por tu email real.
2. La primera vez que alguien envíe el formulario en producción, FormSubmit te manda un correo de confirmación — ábrelo y confirma para activar el buzón (mensajes antes de confirmar no llegan).
3. Opcional: agrega `<input type="hidden" name="_next" value="https://tusitio.vercel.app/gracias.html">` si quieres redirigir a una página propia después de enviar; si no, FormSubmit muestra su propia pantalla genérica de "mensaje enviado".

## Cómo publicarlo gratis

### Opción recomendada: Vercel (igual que Cayi Studio)

1. Sube esta carpeta a un repositorio de GitHub (por ejemplo `cayi-web`, igual que hiciste con `cayi-studio`).
2. Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
3. **Add New... → Project**, elige el repositorio `cayi-web`. No necesitas cambiar ninguna configuración de build — es un sitio estático, Vercel lo detecta solo. Dale **Deploy**.
4. En un par de minutos te da un link (algo como `cayi-web.vercel.app`). Cada vez que subas un cambio a la rama principal de GitHub, Vercel lo publica automáticamente. Puedes conectar tu propio dominio gratis desde Project Settings → Domains.
5. `admin.html` queda disponible en `tusitio.vercel.app/admin.html`.

### Alternativas

- **Netlify**: mismos pasos que Vercel pero en [netlify.com](https://netlify.com) — también gratis, también detecta el sitio estático solo.
- **GitHub Pages**: en el repositorio, ve a **Settings → Pages**, elige la rama `main` y guarda. Tu sitio queda en `https://tuusuario.github.io/cayi-web/`.

El panel de administrador y el formulario de contacto funcionan igual en cualquiera de las tres, porque guardan en Supabase y FormSubmit respectivamente — ninguno depende de Vercel/Netlify.

## Estructura del proyecto

- `index.html` — el sitio público (Inicio con el video destacado, Portafolio, Servicios, Nosotros, Testimonios, Clientes, Contacto).
- `admin.html` — panel de administrador para editar todo el contenido (ver arriba).
- `css/style.css` — estilos y colores de marca.
- `js/main.js` — menú móvil, animaciones (AOS/GSAP), y la sincronización con Supabase que aplica el contenido guardado desde el panel.
- `js/content-defaults.js` — el contenido de ejemplo/por defecto, compartido entre `index.html` y `admin.html`.
- `supabase-config.js` — tus credenciales de Supabase (edítalo, no lo borres).
- `supabase-schema.sql` — el script que crea la tabla y el bucket en Supabase (solo se usa una vez).
- `images/` — solo el favicon local; las fotos de referencia se cargan desde picsum.photos (ver arriba) hasta que subas las tuyas.
- `politica-de-privacidad.html` — página legal básica enlazada desde el footer y el checkbox del formulario (texto de partida, revísalo antes de publicar).
