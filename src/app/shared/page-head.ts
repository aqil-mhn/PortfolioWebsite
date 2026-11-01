import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Breadcrumb and `//` comment line that open every page. */
@Component({
  selector: 'app-page-head',
  template: `
    <p class="t-meta">nikaqil.com / {{ path() }}</p>
    <p class="t-meta mt1">// <ng-content /></p>
  `,
  host: { class: 'page-head' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHead {
  /** Path after the domain, for example `stack.json`. File names are never translated. */
  readonly path = input.required<string>();
}
