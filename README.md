# Cayi Studio — Web

Sitio web público de Cayi Studio (fotografía y video para eventos corporativos, estudio, publicidad y contenido de marca). Es un sitio estático — no necesita build ni instalar nada — con un **panel de administrador** para editar todo el contenido (textos, colores, imágenes, videos) sin tocar código.

Está inspirado en la estructura de [maiafilms.pe](https://maiafilms.pe/) (productora audiovisual), pero con identidad propia de **Cayi Studio**: paleta ink/naranja, tipografía Bricolage Grotesque + Manrope, iconos de línea dibujados a mano y animaciones reales (no plantilla genérica).

### Animaciones instaladas

El sitio usa dos librerías gratuitas por CDN (no requieren instalación local, ya están enlazadas en `index.html`):

- **[AOS](https://michalsnik.github.io/aos/)** (Animate On Scroll) — las secciones aparecen con fade al hacer scroll (`data-aos="fade-up"`, etc. en el HTML).
- **[GSAP](https://gsap.com/)** — anima la entrada del texto del héroe (aparece en cascada) y el video destacado (fade + zoom suave) en `js/main.js`.

Si quieres más movimiento (parallax, transiciones entre secciones, texto que se divide en letras), GSAP ya está cargado — solo hay que agregar más animaciones en `js/main.js`; no hace falta instalar nada nuevo.

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

`Bricolage Grotesque` (titulares, con carácter editorial) + `Manrope` (texto de cuerpo), cargadas gratis desde Google Fonts. Si quieres probar otra combinación, cámbiala en la línea `<link href="https://fonts.googleapis.com/css2?family=...">` de `index.html` y en `--font-display`/`--font-body` de `css/style.css`.

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
- `images/` — imágenes placeholder (reemplázalas desde el panel o directamente en la carpeta).
