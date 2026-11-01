import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHead } from '../../shared/page-head';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, PageHead],
  templateUrl: './not-found.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
