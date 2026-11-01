import { Injectable, signal } from '@angular/core';

/** UI state shared by the frame: the phone file menu and the finder. */
@Injectable({ providedIn: 'root' })
export class ShellState {
  readonly menuOpen = signal(false);
  readonly finderOpen = signal(false);
}
