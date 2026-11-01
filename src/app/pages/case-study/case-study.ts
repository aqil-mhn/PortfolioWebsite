import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHead } from '../../shared/page-head';

@Component({
  selector: 'app-case-study',
  imports: [RouterLink, PageHead],
  templateUrl: './case-study.html',
  host: { class: 'cols case' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseStudy {}
