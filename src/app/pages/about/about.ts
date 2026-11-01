import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site';
import { PageHead } from '../../shared/page-head';

@Component({
  selector: 'app-about',
  imports: [RouterLink, PageHead],
  templateUrl: './about.html',
  host: { class: 'cols' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly email = SITE.email;
}
