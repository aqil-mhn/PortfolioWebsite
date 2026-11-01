/**
 * One URL path per language: English at the root, then /ms and /kel.
 * Names are written in their own language and are never translated.
 */
export interface Language {
  code: 'en' | 'ms' | 'kel';
  /** Label in the status bar. */
  short: string;
  name: string;
  /** BCP 47 tag for `lang` and `hreflang`. Kelantan has no registered subtag, so it uses private use. */
  tag: string;
  /** URL prefix without a trailing slash. */
  prefix: string;
}

export const LANGUAGES: readonly Language[] = [
  { code: 'en', short: 'EN', name: 'English', tag: 'en', prefix: '' },
  { code: 'ms', short: 'BM', name: 'Bahasa Melayu', tag: 'ms', prefix: '/ms' },
  { code: 'kel', short: 'KEL', name: 'Kelantan', tag: 'ms-x-kel', prefix: '/kel' },
];

/** The language a build was made for, from Angular's LOCALE_ID. Unknown ids fall back to English. */
export function languageFor(localeId: string): Language {
  const id = localeId.toLowerCase();
  return (
    LANGUAGES.find((language) => language.tag === id) ??
    LANGUAGES.find((language) => language.tag === id.split('-')[0]) ??
    LANGUAGES[0]
  );
}

/** The same page in another language. `path` is the router path without the language prefix. */
export function languageHref(language: Language, path: string): string {
  const clean = path === '/' ? '/' : path.replace(/\/$/, '');
  return language.prefix + clean;
}
