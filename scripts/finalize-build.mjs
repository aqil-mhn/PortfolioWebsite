// Static hosts serve /404.html (per language folder) for unknown URLs. Angular prerenders the
// not-found page at /404/index.html, so move it up one level and drop the folder, which makes
// /404 itself answer "not found" like any other missing page.
import { access, rename, rm } from 'node:fs/promises';

const output = 'dist/portfolio/browser';
const languages = ['', 'ms', 'kel'];

for (const language of languages) {
  const folder = `${output}/${language}/404`.replace('//', '/');
  const page = `${folder}/index.html`;
  await access(page);
  await rename(page, `${folder}.html`);
  await rm(folder, { recursive: true });
  console.log(`${folder}.html`);
}
