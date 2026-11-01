import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS_FOLDER, PROJECT_FILES, ROOT_NAME, TOP_FILES, HOME_FILE } from '../core/nav';
import { PageContext } from '../core/page-context';

@Component({
  selector: 'app-file-tree',
  imports: [RouterLink],
  templateUrl: './file-tree.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileTree {
  protected readonly url = inject(PageContext).url;
  protected readonly rootName = ROOT_NAME;
  protected readonly folderName = PROJECTS_FOLDER;
  protected readonly home = HOME_FILE;
  protected readonly projects = PROJECT_FILES;
  protected readonly files = TOP_FILES;

  protected readonly projectsOpen = signal(true);
}
