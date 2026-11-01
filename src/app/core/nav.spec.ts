import { describe, expect, it } from 'vitest';
import { PROJECT_FILES, SEARCHABLE_FILES, matchFiles } from './nav';

describe('file tree', () => {
  it('lists only files that have a page for the finder', () => {
    expect(SEARCHABLE_FILES.every((file) => file.path !== null)).toBe(true);
    expect(SEARCHABLE_FILES.map((file) => file.name)).toEqual([
      'home.md',
      'moneytracker.md',
      'stack.json',
      'referrals.md',
      'about.md',
      'resume.pdf',
      'contact.md',
    ]);
  });

  it('keeps placeholder projects out of the finder', () => {
    const placeholders = PROJECT_FILES.filter((file) => file.path === null);
    expect(placeholders.length).toBe(2);
    expect(SEARCHABLE_FILES).not.toContain(placeholders[0]);
  });
});

describe('matchFiles', () => {
  it('returns every file for an empty query', () => {
    expect(matchFiles(SEARCHABLE_FILES, '  ')).toHaveLength(SEARCHABLE_FILES.length);
  });

  it('matches names without regard to case', () => {
    expect(matchFiles(SEARCHABLE_FILES, 'CON').map((file) => file.name)).toEqual(['contact.md']);
  });

  it('matches the description too', () => {
    expect(matchFiles(SEARCHABLE_FILES, 'case study').map((file) => file.name)).toContain(
      'moneytracker.md',
    );
  });

  it('returns nothing when no file matches', () => {
    expect(matchFiles(SEARCHABLE_FILES, 'zzz')).toEqual([]);
  });
});
