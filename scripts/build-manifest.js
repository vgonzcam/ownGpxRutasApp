// Genera rutas/manifest.json a partir de las carpetas rutas/<TIPO>/*.gpx.
// No hace falta ejecutarlo a mano: corre en local con `node scripts/build-manifest.js`
// y también en el workflow de despliegue antes de publicar el sitio.
//
// El tipo de ruta NO es una lista fija: cualquier carpeta que exista dentro de
// rutas/ se trata como un tipo válido. Crear una carpeta nueva (p. ej. rutas/XC/)
// y meter .gpx dentro es suficiente para que aparezca como tipo nuevo — no hace
// falta tocar este script.
const fs = require('fs');
const path = require('path');

const rutasDir = path.join(__dirname, '..', 'rutas');

const trackTypes = fs
  .readdirSync(rutasDir)
  .filter((name) => fs.statSync(path.join(rutasDir, name)).isDirectory())
  .sort();

const entries = [];
for (const type of trackTypes) {
  const typeDir = path.join(rutasDir, type);
  const files = fs.readdirSync(typeDir)
    .filter((f) => f.toLowerCase().endsWith('.gpx'))
    .sort();
  for (const file of files) {
    entries.push({ file: `${type}/${file}`, type });
  }
}

fs.writeFileSync(path.join(rutasDir, 'manifest.json'), JSON.stringify(entries, null, 2) + '\n');
console.log(`manifest.json generado con ${entries.length} ruta(s).`);
