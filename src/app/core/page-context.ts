import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { PageData } from './page-data';

/** The page the router last activated: its path and the data the frame shows. */
@Injectable({ providedIn: 'root' })
export class PageContext {
  private readonly router = inject(Router);

  /** Router path without query, fragment or language prefix. */
  readonly url = signal('/');
  readonly page = signal<PageData | null>(null);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        this.url.set(this.router.url.split(/[?#]/)[0]);
        this.page.set((route.data['page'] as PageData | undefined) ?? null);
      });
  }
}
