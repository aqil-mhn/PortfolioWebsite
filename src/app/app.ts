import { DOCUMENT, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Motion } from './core/motion';
import { PageContext } from './core/page-context';
import { ShellState } from './core/shell-state';
import { ThemeService } from './core/theme';
import { Finder } from './shell/finder';
import { FileTree } from './shell/file-tree';
import { StatusBar } from './shell/status-bar';
import { TabBar } from './shell/tab-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TabBar, FileTree, StatusBar, Finder],
  templateUrl: './app.html',
  host: { '(document:keydown)': 'onKeydown($event)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly injector = inject(Injector);
  private readonly motion = inject(Motion);
  private readonly context = inject(PageContext);
  protected readonly shell = inject(ShellState);

  protected readonly skipHref = computed(
    () => this.location.prepareExternalUrl(this.context.url()) + '#content',
  );

  constructor() {
    // Start following the system theme and the saved choice.
    inject(ThemeService);

    let first = true;
    inject(Router)
      .events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.shell.menuOpen.set(false);
        if (first) {
          first = false;
          return;
        }
        // After a client-side navigation: move focus to the page, then ease it in.
        afterNextRender(
          () => {
            const main = this.document.getElementById('content');
            main?.focus({ preventScroll: true });
            const page = main?.querySelector<HTMLElement>(':scope > :not(router-outlet)');
            if (page) {
              void this.motion.enter(page);
            }
          },
          { injector: this.injector },
        );
      });
  }

  protected skip(event: Event): void {
    event.preventDefault();
    this.document.getElementById('content')?.focus();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.shell.finderOpen.set(true);
    }
  }
}
