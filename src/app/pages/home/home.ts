import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHead } from '../../shared/page-head';

@Component({
  selector: 'app-home',
  imports: [RouterLink, PageHead],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
