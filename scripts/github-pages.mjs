// Temporary. GitHub Pages serves a repository site under /<repository>/, but the sources link to
// /fonts, /resume.pdf and /ms as if the site sat at the domain root. `rebase` rewrites those links in
// the CI checkout (the rewrite is never committed) before the build, and `verify` fails the deploy if
// a root link or a wrong <base> survived in the output. Delete this file and
// .github/workflows/pages.yml when moving to Cloudflare Pages, which serves from the root.
//
// The base path is last and optional: a site at the domain root (a repository named
// <owner>.github.io) has none.
//
//   node scripts/github-pages.mjs rebase <origin> [base path, e.g. /PortfolioWebsite]
//   node scripts/github-pages.mjs verify [base path]
import { readFile, readdir, writeFile } from 'node:fs/promises';

const output = 'dist/portfolio/browser';
const languages = ['', 'ms', 'kel'];

const [command, ...rest] = process.argv.slice(2);
const [origin, basePath] = command === 'rebase' ? rest : ['', rest[0]];
const base = (basePath ?? '').replace(/\/+$/, '');

async function files(folder, extensions) {
  const names = await readdir(folder, { recursive: true });
  return names
    .filter((name) => extensions.some((extension) => name.endsWith(extension)))
    .map((name) => `${folder}/${name}`);
}

/** Replaces every match of a global pattern; `expected` makes a different number of matches fatal. */
async function edit(file, pattern, replacement, expected) {
  const text = await readFile(file, 'utf8');
  const found = [...text.matchAll(pattern)].length;
  if (expected !== undefined && found !== expected) {
    throw new Error(`${file}: expected ${expected} match(es) of ${pattern}, found ${found}`);
  }
  await writeFile(file, text.replace(pattern, replacement));
}

async function rebase() {
  if (base && !base.startsWith('/')) {
    throw new Error(`The base path must start with a slash, got "${basePath}".`);
  }
  if (!/^https?:\/\/[^/]+$/.test(origin)) {
    throw new Error(`The origin must look like https://name.github.io, got "${origin}".`);
  }

  // The <base> tag is skipped: `ng build --base-href` sets it for every language.
  const htmlLinks = /(<base\b[^>]*>)|\b(href|src)="\/(?!\/)/g;
  const htmlFiles = ['src/index.html', ...(await files('src/app', ['.html']))];
  for (const file of htmlFiles) {
    await edit(file, htmlLinks, (match, baseTag, attribute) => baseTag ?? `${attribute}="${base}/`);
  }
  for (const file of await files('src', ['.css'])) {
    await edit(file, /url\((['"]?)\/(?!\/)/g, `url($1${base}/`);
  }

  // One prefix per language (English, Malay, Kelantan): the switcher and the canonical links use them.
  await edit('src/app/core/language.ts', /prefix: '(\/?[a-z]*)'/g, `prefix: '${base}$1'`, 3);
  await edit('src/app/core/site.ts', /origin: '[^']*'/g, `origin: '${origin}'`, 1);
}

async function verify() {
  const problems = [];
  const attributeLink = /\b(?:href|src)="(\/(?!\/)[^"]*)"/g;
  const styleLink = /url\(['"]?(\/(?!\/)[^)'"]*)/g;

  const built = await files(output, ['.html', '.css']);
  for (const file of built) {
    const text = await readFile(file, 'utf8');
    for (const [, path] of [...text.matchAll(attributeLink), ...text.matchAll(styleLink)]) {
      if (!path.startsWith(`${base}/`)) {
        problems.push(`${file}: ${path} is outside ${base}/`);
      }
    }
  }

  for (const language of languages) {
    const folder = language ? `${output}/${language}` : output;
    const tag = `<base href="${base}${language ? `/${language}` : ''}/">`;
    if (!(await readFile(`${folder}/index.html`, 'utf8')).includes(tag)) {
      problems.push(`${folder}/index.html: missing ${tag}`);
    }
  }

  if (problems.length > 0) {
    console.error(problems.slice(0, 20).join('\n'));
    console.error(`${problems.length} problem(s). Root-relative links break under ${base}/.`);
    process.exitCode = 1;
    return;
  }
  console.log(`${built.length} files checked, every link and <base> sits under ${base}/`);
}

const commands = { rebase, verify };
if (!(command in commands)) {
  console.error('Usage: node scripts/github-pages.mjs rebase <origin> [base path]');
  console.error('       node scripts/github-pages.mjs verify [base path]');
  process.exit(1);
}
await commands[command]();
