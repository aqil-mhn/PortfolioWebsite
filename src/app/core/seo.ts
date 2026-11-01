import { DOCUMENT } from '@angular/common';
import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { LANGUAGES, languageFor, languageHref } from './language';
import { PageData } from './page-data';
import { SITE } from './site';

const MANAGED = 'data-managed';

/** Sets the title, description, Open Graph text, canonical URL and language alternates per page. */
@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly language = languageFor(inject(LOCALE_ID));

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    const title = pageTitle ? `${pageTitle} · ${SITE.name}` : SITE.name;
    this.title.setTitle(title);

    let route = snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const page = route.data['page'] as PageData | undefined;
    const description = page?.description;
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
    }
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE.name });
    this.meta.updateTag({ property: 'og:locale', content: this.language.tag });

    this.meta.updateTag({ name: 'robots', content: page?.noindex ? 'noindex' : 'index, follow' });
    this.updateLinks(page?.noindex ? null : snapshot.url.split(/[?#]/)[0]);
  }

  /** Replaces the canonical URL and language alternates; a null path leaves the page without them. */
  private updateLinks(path: string | null): void {
    this.document.head.querySelectorAll(`link[${MANAGED}]`).forEach((link) => link.remove());
    if (path === null) {
      return;
    }

    this.addLink('canonical', SITE.origin + languageHref(this.language, path));
    for (const language of LANGUAGES) {
      this.addLink('alternate', SITE.origin + languageHref(language, path), language.tag);
    }
    this.addLink('alternate', SITE.origin + languageHref(LANGUAGES[0], path), 'x-default');
  }

  private addLink(rel: string, href: string, hreflang?: string): void {
    const link = this.document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('href', href);
    if (hreflang) {
      link.setAttribute('hreflang', hreflang);
    }
    link.setAttribute(MANAGED, '');
    this.document.head.appendChild(link);
  }
}
