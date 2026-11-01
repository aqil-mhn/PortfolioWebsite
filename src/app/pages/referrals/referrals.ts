import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHead } from '../../shared/page-head';

@Component({
  selector: 'app-referrals',
  imports: [RouterLink, PageHead],
  templateUrl: './referrals.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Referrals {
  /** Three placeholder cards until Nik has quotes with permission. */
  protected readonly placeholders = [1, 2, 3];
}
