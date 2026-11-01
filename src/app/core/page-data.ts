/** Route data every page provides to the frame (tab bar, status bar) and to SEO. */
export interface PageData {
  /** File name for the tab and status bar. Never translated. */
  file: string;
  /** Section name at the start of the status bar. Translated. */
  section: string;
  /** Encoding or type at the end of the status bar. */
  status: 'UTF-8' | 'PDF';
  /** Meta description and Open Graph text. Translated. */
  description: string;
  /** Keeps the page out of search results (the 404 page). */
  noindex?: boolean;
}
