import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHead } from '../../shared/page-head';

@Component({
  selector: 'app-resume',
  imports: [PageHead],
  templateUrl: './resume.html',
  host: { class: 'cols' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Resume {}
