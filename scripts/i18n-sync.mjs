// Run after `ng extract-i18n` (npm run i18n:extract does both). Sorts the three translation
// files by message id so each page's text sits together, and lists what a translator still
// has to add or delete. The production build also fails on a missing translation.
import { readFile, writeFile } from 'node:fs/promises';

const folder = 'src/locale';
const files = { source: 'messages.json', ms: 'messages.ms.json', kel: 'messages.kel.json' };

const read = async (name) => JSON.parse(await readFile(`${folder}/${name}`, 'utf8'));
const sorted = (translations) =>
  Object.fromEntries(Object.entries(translations).sort(([a], [b]) => a.localeCompare(b)));
const write = (name, file) => writeFile(`${folder}/${name}`, JSON.stringify(file, null, 2) + '\n');

const source = await read(files.source);
await write(files.source, { ...source, translations: sorted(source.translations) });

let problems = 0;
for (const name of [files.ms, files.kel]) {
  const file = await read(name);
  await write(name, { ...file, translations: sorted(file.translations) });

  const missing = Object.keys(source.translations).filter((id) => !(id in file.translations));
  const obsolete = Object.keys(file.translations).filter((id) => !(id in source.translations));
  for (const id of missing) console.log(`${name}: add "${id}"`);
  for (const id of obsolete) console.log(`${name}: delete "${id}"`);
  problems += missing.length + obsolete.length;
}

console.log(problems ? `${problems} translation(s) to fix.` : 'Translations are in sync.');
