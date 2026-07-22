# Rutas GPX — Club Esportiu Castelldans

## Documentación

| Documento                                     | Qué explica                                                                                                                                                      | Dónde verlo                                                                                                                                                 |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                   | Correr en local, estructura del proyecto, cómo configurar `rutas/config.json`, despliegue                                                                        | Este mismo archivo                                                                                                                                          |
| Guía de gestión (paso a paso, solo navegador) | Cómo añadir/eliminar rutas, corregir datos, cambiar textos, patrocinadores, redes sociales y colores — todo desde github.com, explicado para quien no conoce Git | [vgonzcam.github.io/ownGpxRutasApp/guia-gestion-rutas.html](https://vgonzcam.github.io/ownGpxRutasApp/guia-gestion-rutas.html) (tras el próximo deploy)     |
| Manual de referencia de configuración         | Campo a campo de `rutas/config.json` y `rutas/theme.json`, con miniaturas de la app señalando dónde aparece cada valor                                           | [vgonzcam.github.io/ownGpxRutasApp/manual-configuracion.html](https://vgonzcam.github.io/ownGpxRutasApp/manual-configuracion.html) (tras el próximo deploy) |
| [MANUAL-NUEVA-RUTA.md](MANUAL-NUEVA-RUTA.md)  | Redirige a la guía de gestión — por si navegas el repo sin tener la web desplegada                                                                               | [MANUAL-NUEVA-RUTA.md](MANUAL-NUEVA-RUTA.md) en este repo                                                                                                   |
| La app                                        | La web de rutas en sí                                                                                                                                            | [vgonzcam.github.io/ownGpxRutasApp](https://vgonzcam.github.io/ownGpxRutasApp/)                                                                             |

Las dos últimas filas son páginas del propio sitio (GitHub Pages), no archivos que se abran desde el repositorio.

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

1. Copia tu archivo `.gpx` dentro de `rutas/<TIPO>/`. `<TIPO>` no es una lista cerrada en el código — es, literalmente, el nombre de cada carpeta que hay dentro de `rutas/` (hoy: `MTB`, `ROAD`, `GRAVEL`, `TRAIL`, `BIKEPACKING`, `CASTELLBIKE`). Crear una carpeta nueva y subir un `.gpx` dentro basta para que aparezca como tipo nuevo, sin tocar nada más.
2. Haz `git push`. Nada más — `rutas/manifest.json` se regenera solo en cada despliegue (ver más abajo), no lo edites a mano.
3. El nombre y ubicación de la ruta se toman del tag `<name>` del GPX, en formato `Nombre, Ubicación`. Distancia, desnivel, duración y dificultad se calculan automáticamente a partir de los puntos del track.

### Corregir los datos de una ruta a mano

Distancia, desnivell, duración, dificultad, etc. se calculan por fórmula a partir de los puntos del GPX, así que a veces no aciertan (no tienen en cuenta terreno técnico, paradas, etc.). Para fijar a mano cualquiera de estos valores en una ruta concreta, añade una entrada en `rutas/config.json` → `routeOverrides`, usando la misma ruta de archivo que aparece en `manifest.json`. Solo hace falta incluir los campos que quieras sobrescribir:

```json
"routeOverrides": {
  "ROAD/rc23-road-llarga-150k.gpx": {
    "name": "RC23 Road Llarga",
    "location": "Juncosa",
    "difficulty": "dificil",
    "duration": "5h 30m",
    "distanceKm": 152,
    "elevGain": 3900,
    "elevLoss": 3900,
    "maxAlt": 790,
    "minAlt": 85,
    "trailRank": 95,
    "routeShape": "Circular"
  }
}
```

Explicación campo a campo (cómo se calcula cada uno y qué pasa si lo sobrescribes) en el [manual de referencia de configuración](https://vgonzcam.github.io/ownGpxRutasApp/manual-configuracion.html), o el flujo paso a paso en la [guía de gestión](https://vgonzcam.github.io/ownGpxRutasApp/guia-gestion-rutas.html#corregir-datos).

Todos los campos son opcionales — pon solo los que quieras corregir. `difficulty` acepta `"facil"`, `"dificil"` o `"moltDificil"`; `routeShape` acepta `"Circular"` o `"Lineal"`. Esta clave tiene que coincidir con el `"file"` de `manifest.json`. El archivo `config.json` **no** se regenera automáticamente (a diferencia de `manifest.json`), así que los cambios se quedan aunque hagas push de nuevas rutas.

Si quieres comprobar en local qué manifest se generaría antes de hacer push:

```
node scripts/build-manifest.js
```

## Configurar la pantalla de inicio (`rutas/config.json`)

- `siteTitle` — título del listado de rutas (no aparece en la pantalla de inicio; la cabecera de inicio ahora es solo el logo y el botón de tema).
- `orgName` — nombre del club. No se muestra como texto en pantalla: es el `alt` del logo de la cabecera y el respaldo de `copyrightText`.
- `orgTagline` — eslogan del club. Se usa como subtítulo del banner de inicio si ese banner no define su propio `subtitle`.
- `contactEmail` — se muestra como `mailto:` en la caja "En vols dir alguna cosa?" (solo en inicio).
- `copyrightText` — línea de copyright, en una barra propia al final de las tres pantallas (si no se define, se usa `© {año actual} {orgName}`).
- `sections` — bloques tipo `banner` (imagen/título/subtítulo/texto/enlace, arriba de la pantalla de inicio) o `link` (enlace rápido en "Enllaços").
  - El banner admite `image` (nombre de archivo dentro de `imgs/`, p.ej. `"image": "club.avif"`); si no se define o falla al cargar, se muestra `title` en texto.
- `showSponsors` — `true`/`false` (por defecto `true`). Ponlo en `false` para ocultar del todo la sección de patrocinadores sin tener que borrar la lista de `sponsors`.
- `social` — redes sociales, cada una `{ "network": "instagram" | "x" | "facebook" | "strava" | "youtube", "url": "...", "label": "..." (opcional) }`. Aparecen en su propia caja "Segueix-nos" (solo en inicio, encima de "En vols dir alguna cosa?"), como icono + usuario; el usuario se detecta del final de la URL, o usa `label` para forzarlo. Una red no reconocida cae a un icono genérico.
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
