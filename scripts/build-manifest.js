// Genera rutas/manifest.json a partir de las carpetas rutas/<TIPO>/*.gpx.
// No hace falta ejecutarlo a mano: corre en local con `node scripts/build-manifest.js`
// y también en el workflow de despliegue antes de publicar el sitio.
const fs = require('fs');
const path = require('path');

const trackTypes = ['MTB', 'ROAD', 'GRAVEL', 'TRAIL', 'BIKEPACKING', 'CASTELLBIKE'];
const rutasDir = path.join(__dirname, '..', 'rutas');

const entries = [];
for (const type of trackTypes) {
  const typeDir = path.join(rutasDir, type);
  if (!fs.existsSync(typeDir) || !fs.statSync(typeDir).isDirectory()) continue;
  const files = fs.readdirSync(typeDir)
    .filter((f) => f.toLowerCase().endsWith('.gpx'))
    .sort();
  for (const file of files) {
    entries.push({ file: `${type}/${file}`, type });
  }
}

fs.writeFileSync(path.join(rutasDir, 'manifest.json'), JSON.stringify(entries, null, 2) + '\n');
console.log(`manifest.json generado con ${entries.length} ruta(s).`);
