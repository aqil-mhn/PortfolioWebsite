import { describe, expect, it } from 'vitest';
import { LANGUAGES, languageFor, languageHref } from './language';

describe('languageFor', () => {
  it('maps each build locale to its language', () => {
    expect(languageFor('en').code).toBe('en');
    expect(languageFor('ms').code).toBe('ms');
    expect(languageFor('ms-x-kel').code).toBe('kel');
  });

  it('falls back to English for the default dev-server locale and unknown ids', () => {
    expect(languageFor('en-US').code).toBe('en');
    expect(languageFor('fr').code).toBe('en');
  });

  it('treats a regional Malay id as Malay, not Kelantan', () => {
    expect(languageFor('ms-MY').code).toBe('ms');
  });
});

describe('languageHref', () => {
  const [en, ms, kel] = LANGUAGES;

  it('keeps English at the root', () => {
    expect(languageHref(en, '/')).toBe('/');
    expect(languageHref(en, '/stack')).toBe('/stack');
  });

  it('prefixes the other languages and keeps the same page', () => {
    expect(languageHref(ms, '/')).toBe('/ms/');
    expect(languageHref(ms, '/projects/moneytracker')).toBe('/ms/projects/moneytracker');
    expect(languageHref(kel, '/contact')).toBe('/kel/contact');
  });

  it('ignores a trailing slash', () => {
    expect(languageHref(ms, '/stack/')).toBe('/ms/stack');
  });
});
