# Rutas GPX — Club Esportiu Castelldans

## Cómo correrlo en local

Este proyecto hace `fetch()` de archivos locales, así que **no lo abras con doble clic** (file://) — el navegador bloquea esas peticiones. Sírvelo con Node:

```
npx serve .
```

Luego abre la URL que imprime en consola (normalmente `http://localhost:3000`).

Alternativa sin instalar nada aparte de Node:

```
node -e "require('http').createServer(async (req,res)=>{const fs=require('fs'),path=require('path');let f=path.join(process.cwd(),decodeURIComponent(req.url==='/'?'/index.html':req.url));try{res.end(fs.readFileSync(f))}catch{res.writeHead(404);res.end('404')}}).listen(8000,()=>console.log('http://localhost:8000'))"
```

## PWA — instal·lable al mòbil

El projecte és una PWA: icona, `manifest.webmanifest` i un service worker que guarda en caché l'app i les rutes visitades per funcionar offline.

- **Android/Chrome**: obre la URL servida, menú ⋮ → "Instal·la l'aplicació".
- **iOS/Safari**: obre la URL, botó compartir → "Afegeix a la pantalla d'inici".

El service worker només funciona servit per http(s) (no amb file://), i cada ruta que s'obri online un cop queda disponible offline automàticament.

## Agregar tus propias rutas

1. Copia tu archivo `.gpx` dentro de `rutas/<TIPO>/`, donde `<TIPO>` es una de: `MTB`, `ROAD`, `GRAVEL`, `TRAIL`, `BIKEPACKING`.
2. Haz `git push`. Nada más — `rutas/manifest.json` se regenera solo en cada despliegue (ver más abajo), no lo edites a mano.
3. El nombre y ubicación de la ruta se toman del tag `<name>` del GPX, en formato `Nombre, Ubicación`. Distancia, desnivel, duración y dificultad se calculan automáticamente a partir de los puntos del track.

Si quieres comprobar en local qué manifest se generaría antes de hacer push:

```
node scripts/build-manifest.js
```

## Configurar la pantalla de inicio (`rutas/config.json`)

- `siteTitle` — título mostrado en la cabecera.
- `contactEmail` — se muestra como `mailto:` en el footer.
- `copyrightText` — línea de copyright del footer (si no se define, se usa `© {año actual} {siteTitle}`).
- `sections` — bloques tipo `banner` (imagen/título + subtítulo + texto + enlace, se muestra arriba) o `link` (aparece como enlace rápido en el footer).
  - El banner admite `image` (nombre de archivo dentro de `imgs/`, p.ej. `"image": "club.avif"`); si no se define o falla al cargar, se muestra `title` en texto.
- `social` — redes sociales, cada una `{ "network": "instagram" | "x" | "facebook" | "strava" | "youtube", "url": "..." }`. Se muestran como iconos circulares en el footer; una red no reconocida cae a un icono genérico.
- `sponsors` — cada uno `{ "name": "...", "url": "...", "logo": "archivo.png" }`. El campo `logo` es opcional: si lo pones, coloca la imagen en `imgs/`; si no existe o falla al cargar, se muestra el nombre en texto automáticamente.

Todas las imágenes (logo del club, logos de patrocinadores) se guardan en la carpeta `imgs/` en la raíz del proyecto, y se referencian en `config.json` solo por nombre de archivo.

## Despliegue en GitHub Pages

El workflow `.github/workflows/deploy.yml` se dispara en cada push a `main`: regenera `rutas/manifest.json` a partir de las carpetas de `rutas/` y publica todo el sitio en GitHub Pages.

Configuración inicial (una sola vez, manual):
1. Crea el repositorio en GitHub y sube este proyecto (`git push`).
2. En el repo, ve a **Settings → Pages** y en "Source" elige **GitHub Actions**.
3. El siguiente push a `main` desplegará el sitio automáticamente.

## Archivos

- `index.html` — toda la app (HTML + CSS + JS, sin dependencias ni build step)
- `manifest.webmanifest` / `service-worker.js` / `icons/` — soporte PWA
- `imgs/` — logo del club y logos de patrocinadores, referenciados desde `rutas/config.json`
- `rutas/config.json` — título del sitio, banner del club, patrocinadores, enlaces, redes sociales (se muestran en la pantalla de inicio y el footer)
- `rutas/manifest.json` — generado automáticamente, no editar a mano
- `rutas/<TIPO>/*.gpx` — tracks, organizados por tipo
- `scripts/build-manifest.js` — genera `rutas/manifest.json` recorriendo las carpetas de `rutas/`
- `.github/workflows/deploy.yml` — build + despliegue automático a GitHub Pages
