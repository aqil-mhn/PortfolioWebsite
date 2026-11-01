import { DOCUMENT } from '@angular/common';
import { Injectable, afterNextRender, computed, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/**
 * Follows the system until the visitor uses the toggle. The choice is stored in
 * localStorage; an inline script in index.html applies it before first paint.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  /** The visitor's choice, or null while the system decides. */
  readonly choice = signal<Theme | null>(null);
  private readonly systemDark = signal(false);

  readonly theme = computed<Theme>(() => this.choice() ?? (this.systemDark() ? 'dark' : 'light'));

  constructor() {
    afterNextRender(() => {
      const applied = this.document.documentElement.getAttribute('data-theme');
      if (applied === 'light' || applied === 'dark') {
        this.choice.set(applied);
      }
      const query = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemDark.set(query.matches);
      query.addEventListener('change', (event) => this.systemDark.set(event.matches));
    });
  }

  set(theme: Theme): void {
    this.choice.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage blocked: the choice lasts for this visit */
    }
  }
}
