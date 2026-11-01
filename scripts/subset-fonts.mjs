// Builds the self-hosted JetBrains Mono files in public/fonts from the full
// webfonts in the `jetbrains-mono` dev dependency, keeping only the characters
// the site uses. Run `npm run fonts` after adding a new symbol to the copy.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import subsetFont from 'subset-font';

const weights = { 400: 'Regular', 500: 'Medium', 700: 'Bold' };

const ranges = [
  [0x20, 0x7e], // Basic Latin
  [0xa0, 0xff], // Latin-1 Supplement (names, ·)
];
const singles = [
  0x2013,
  0x2014, // en and em dash
  0x2018,
  0x2019,
  0x201c,
  0x201d, // curly quotes
  0x2026, // ellipsis
  0x2192, // →
  0x2197, // ↗
  0x25be, // ▾
  0x25b8, // ▸
];

const text = String.fromCodePoint(
  ...ranges.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => a + i)),
  ...singles,
);

await mkdir('public/fonts', { recursive: true });
for (const [weight, name] of Object.entries(weights)) {
  const source = await readFile(
    `node_modules/jetbrains-mono/fonts/webfonts/JetBrainsMono-${name}.woff2`,
  );
  const out = await subsetFont(source, text, { targetFormat: 'woff2' });
  await writeFile(`public/fonts/jetbrains-mono-${weight}.woff2`, out);
  console.log(`jetbrains-mono-${weight}.woff2  ${(out.length / 1024).toFixed(1)} KB`);
}
