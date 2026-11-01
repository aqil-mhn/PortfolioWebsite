import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site';
import { PageHead } from '../../shared/page-head';

/**
 * The project that shows a tool. A route path links inside the site, an href links out,
 * and neither means the case study is not written yet.
 */
interface ProjectRef {
  label: string;
  path: string | null;
  href?: string | null;
}

interface Tool {
  name: string;
  project: ProjectRef;
}

interface ToolGroup {
  id: string;
  label: string;
  tools: Tool[];
}

const MONEYTRACKER: ProjectRef = { label: 'MoneyTracker', path: '/projects/moneytracker' };
const THIS_SITE: ProjectRef = { label: 'nikaqil.com', path: '/' };
const PROJECT_2: ProjectRef = { label: '[Project 2]', path: null };
const PROJECT_3: ProjectRef = { label: '[Project 3]', path: null };
const GITHUB: ProjectRef = { label: 'GitHub', path: null, href: SITE.github };

@Component({
  selector: 'app-stack',
  imports: [RouterLink, PageHead],
  templateUrl: './stack.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stack {
  protected readonly groups: readonly ToolGroup[] = [
    {
      id: 'frontend',
      label: $localize`:Stack card label@@stack.group.frontend:frontend`,
      tools: [
        { name: 'Angular', project: MONEYTRACKER },
        { name: 'TypeScript', project: MONEYTRACKER },
        { name: 'GSAP', project: THIS_SITE },
        { name: 'HTML and CSS', project: THIS_SITE },
      ],
    },
    {
      id: 'backend',
      label: $localize`:Stack card label@@stack.group.backend:backend`,
      tools: [
        { name: 'Spring Boot', project: PROJECT_2 },
        { name: 'REST APIs', project: PROJECT_2 },
        { name: '[Database]', project: PROJECT_2 },
        { name: '[Language]', project: PROJECT_2 },
      ],
    },
    {
      id: 'data',
      label: $localize`:Stack card label@@stack.group.data:data and tools`,
      tools: [
        { name: '[SQL]', project: PROJECT_3 },
        { name: '[Data tool]', project: PROJECT_3 },
        { name: 'Git and GitHub', project: GITHUB },
        { name: 'Cloudflare', project: THIS_SITE },
      ],
    },
  ];
}
