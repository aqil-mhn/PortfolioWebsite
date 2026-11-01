import { ChangeDetectionStrategy, Component, LOCALE_ID, computed, inject } from '@angular/core';
import { LANGUAGES, languageFor, languageHref } from '../core/language';
import { PageContext } from '../core/page-context';
import { ThemeService } from '../core/theme';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBar {
  private readonly context = inject(PageContext);
  private readonly current = languageFor(inject(LOCALE_ID));
  protected readonly theme = inject(ThemeService);

  protected readonly page = this.context.page;

  /** Real links to the same page in each language. */
  protected readonly languages = computed(() =>
    LANGUAGES.map((language) => ({
      ...language,
      href: languageHref(language, this.context.url()),
      current: language.code === this.current.code,
    })),
  );
}
