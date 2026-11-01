import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SEARCHABLE_FILES, matchFiles } from '../core/nav';
import { ShellState } from '../core/shell-state';

/** Opens with the Search button or Ctrl K. Arrow keys move between results. */
@Component({
  selector: 'app-finder',
  imports: [RouterLink],
  templateUrl: './finder.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Finder {
  protected readonly shell = inject(ShellState);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly query = signal('');
  protected readonly results = computed(() => matchFiles(SEARCHABLE_FILES, this.query()));

  constructor() {
    // The dialog's open state follows the shared signal.
    effect(() => {
      const dialog = this.dialog()?.nativeElement;
      if (!dialog) {
        return;
      }
      if (this.shell.finderOpen() && !dialog.open) {
        this.query.set('');
        dialog.showModal();
      } else if (!this.shell.finderOpen() && dialog.open) {
        dialog.close();
      }
    });
  }

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected openFirst(event: Event): void {
    event.preventDefault();
    this.stops()
      .find((stop) => stop instanceof HTMLAnchorElement)
      ?.click();
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }
    const stops = this.stops();
    const index = stops.indexOf(document.activeElement as HTMLElement);
    const next = event.key === 'ArrowDown' ? index + 1 : index - 1;
    event.preventDefault();
    stops[Math.min(Math.max(next, 0), stops.length - 1)]?.focus();
  }

  /** The search box, then each result, in tab order. */
  private stops(): HTMLElement[] {
    const dialog = this.dialog()?.nativeElement;
    return dialog ? Array.from(dialog.querySelectorAll<HTMLElement>('input, a')) : [];
  }
}
