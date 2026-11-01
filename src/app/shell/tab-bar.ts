import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageContext } from '../core/page-context';
import { ShellState } from '../core/shell-state';

@Component({
  selector: 'app-tab-bar',
  imports: [RouterLink],
  templateUrl: './tab-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabBar {
  private readonly context = inject(PageContext);
  private readonly location = inject(Location);
  protected readonly shell = inject(ShellState);

  protected readonly page = this.context.page;
  protected readonly url = this.context.url;
  protected readonly isHome = computed(() => this.url() === '/');

  /** Works without JavaScript: the fragment targets the file tree on phones. */
  protected readonly menuHref = computed(
    () => this.location.prepareExternalUrl(this.url()) + (this.shell.menuOpen() ? '' : '#files'),
  );

  protected toggleMenu(event: Event): void {
    event.preventDefault();
    this.shell.menuOpen.update((open) => !open);
  }
}
