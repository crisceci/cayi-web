# Video del héroe

Coloca aquí tu archivo de video real con el nombre exacto:

```
cayi-hero.mp4
```

El héroe de `index.html` ya está apuntando a `videos/cayi-hero.mp4` — en cuanto subas el archivo con ese nombre (por Git o arrastrándolo directo al repositorio de GitHub), se reproduce automático, sin sonido, en loop.

Recomendaciones para que cargue rápido:
- Clip corto (5–15 segundos), sin audio.
- Resolución 1920×1080 está bien — no hace falta más para un fondo.
- Comprímelo (H.264, bitrate moderado) para que no pese demasiado — herramientas gratuitas como [HandBrake](https://handbrake.fr) sirven para esto.

Mientras no exista `cayi-hero.mp4`, el héroe se ve igual de bien: muestra `images/hero-placeholder.svg` como fondo fijo (el atributo `poster` del video).

**Alternativa sin tocar código**: también puedes subir el video directo desde el panel de administrador (`admin.html` → sección Héroe → campo "Video del héroe") — ahí queda guardado en Supabase y no necesitas commitear ningún archivo.
