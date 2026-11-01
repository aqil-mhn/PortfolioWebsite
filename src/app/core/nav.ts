/** The file tree. File names are part of the visual idea and are never translated. */
export interface TreeFile {
  name: string;
  /** Route path, or null for a placeholder that has no page yet. */
  path: string | null;
  /** Short description shown next to the name in the finder. Translated. */
  hint: string;
}

export const ROOT_NAME = 'nikaqil.com';
export const PROJECTS_FOLDER = 'projects';

export const HOME_FILE: TreeFile = {
  name: 'home.md',
  path: '/',
  hint: $localize`:Finder description for home.md@@hint.home:Start here`,
};

export const PROJECT_FILES: readonly TreeFile[] = [
  {
    name: 'moneytracker.md',
    path: '/projects/moneytracker',
    hint: $localize`:Finder description for moneytracker.md@@hint.moneytracker:Case study`,
  },
  { name: '[project-2].md', path: null, hint: '' },
  { name: '[project-3].md', path: null, hint: '' },
];

export const TOP_FILES: readonly TreeFile[] = [
  {
    name: 'stack.json',
    path: '/stack',
    hint: $localize`:Finder description for stack.json@@hint.stack:Tools and the projects that show them`,
  },
  {
    name: 'referrals.md',
    path: '/referrals',
    hint: $localize`:Finder description for referrals.md@@hint.referrals:What people say about the work`,
  },
  {
    name: 'about.md',
    path: '/about',
    hint: $localize`:Finder description for about.md@@hint.about:Experience and education`,
  },
  {
    name: 'resume.pdf',
    path: '/resume',
    hint: $localize`:Finder description for resume.pdf@@hint.resume:One-page resume`,
  },
  {
    name: 'contact.md',
    path: '/contact',
    hint: $localize`:Finder description for contact.md@@hint.contact:Say hello`,
  },
];

/** Files that have a page, in tree order. The finder searches these. */
export const SEARCHABLE_FILES: readonly TreeFile[] = [
  HOME_FILE,
  ...PROJECT_FILES,
  ...TOP_FILES,
].filter((file) => file.path !== null);

export function matchFiles(files: readonly TreeFile[], query: string): TreeFile[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [...files];
  }
  return files.filter(
    (file) => file.name.toLowerCase().includes(needle) || file.hint.toLowerCase().includes(needle),
  );
}
