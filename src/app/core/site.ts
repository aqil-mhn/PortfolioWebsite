export interface Site {
  name: string;
  origin: string;
  /** Profile links. Null until Nik supplies the URL; templates then show a bracketed placeholder. */
  github: string | null;
  linkedin: string | null;
  /** Public address. Null until Nik supplies it. */
  email: string | null;
  /** Where the contact form posts JSON. Null until a form service is chosen. */
  contactEndpoint: string | null;
}

export const SITE: Site = {
  name: 'Nik Aqil',
  origin: 'https://nikaqil.com',
  github: 'https://github.com/aqil-mhn',
  linkedin: null,
  email: null,
  contactEndpoint: null,
};
