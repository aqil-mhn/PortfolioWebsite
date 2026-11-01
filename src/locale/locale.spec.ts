import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface TranslationFile {
  locale: string;
  review?: { status: string; note: string };
  translations: Record<string, string>;
}

const load = (name: string): TranslationFile =>
  JSON.parse(readFileSync(`src/locale/${name}`, 'utf8')) as TranslationFile;

/** The `{$NAME}` markers in a message, which stand for links and other elements. */
const placeholders = (text: string): string[] =>
  [...text.matchAll(/\{\$([A-Z_0-9]+)\}/g)].map((match) => match[1]).sort();

const source = load('messages.json');
const translated: [string, string][] = [
  ['messages.ms.json', 'ms'],
  ['messages.kel.json', 'ms-x-kel'],
];

describe('translation files', () => {
  it('has English as the source locale', () => {
    expect(source.locale).toBe('en');
  });

  describe.each(translated)('%s', (name, locale) => {
    const file = load(name);

    it(`is for the ${locale} build`, () => {
      expect(file.locale).toBe(locale);
    });

    it('translates every message and nothing else', () => {
      expect(Object.keys(file.translations).sort()).toEqual(
        Object.keys(source.translations).sort(),
      );
    });

    it('keeps every link and element placeholder', () => {
      const broken = Object.keys(source.translations).filter(
        (id) =>
          placeholders(file.translations[id] ?? '').join() !==
          placeholders(source.translations[id]).join(),
      );
      expect(broken).toEqual([]);
    });

    it('has no empty translation', () => {
      const empty = Object.entries(file.translations).filter(([, text]) => text.trim() === '');
      expect(empty).toEqual([]);
    });

    it('declares its review status', () => {
      expect(['draft', 'not-reviewed', 'reviewed']).toContain(file.review?.status);
    });
  });
});
