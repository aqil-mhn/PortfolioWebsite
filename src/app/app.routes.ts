import { Route, Routes } from '@angular/router';
import { PageData } from './core/page-data';
import { About } from './pages/about/about';
import { CaseStudy } from './pages/case-study/case-study';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { Referrals } from './pages/referrals/referrals';
import { Resume } from './pages/resume/resume';
import { Stack } from './pages/stack/stack';

const page = (data: PageData) => ({ page: data });

const notFound: Route = {
  component: NotFound,
  title: $localize`:Browser tab title for the 404 page@@title.notfound:Page not found`,
  data: page({
    file: 'not-found.md',
    section: $localize`:Status bar section name for the 404 page@@section.error:Error`,
    status: 'UTF-8',
    description: $localize`:Meta description for the 404 page@@meta.notfound:This page does not exist. Go back to the home page, the case study or the contact page.`,
    noindex: true,
  }),
};

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: $localize`:Browser tab title for the home page@@title.home:Full Stack Developer`,
    data: page({
      file: 'home.md',
      section: $localize`:Status bar section name@@section.home:Home`,
      status: 'UTF-8',
      description: $localize`:Meta description for the home page@@meta.home:Nik is a full stack developer based in [City], Malaysia, building with Angular and Spring Boot. Read the MoneyTracker case study, the stack and the referrals.`,
    }),
  },
  {
    path: 'projects/moneytracker',
    component: CaseStudy,
    title: $localize`:Browser tab title for the MoneyTracker case study@@title.moneytracker:MoneyTracker case study`,
    data: page({
      file: 'moneytracker.md',
      section: $localize`:Status bar section name@@section.projects:Projects`,
      status: 'UTF-8',
      description: $localize`:Meta description for the MoneyTracker case study@@meta.moneytracker:How Nik built MoneyTracker with Angular: the problem, the decisions and the trade-offs, and what Nik would change.`,
    }),
  },
  {
    path: 'stack',
    component: Stack,
    title: $localize`:Browser tab title for the stack page@@title.stack:Stack`,
    data: page({
      file: 'stack.json',
      section: $localize`:Status bar section name@@section.stack:Stack`,
      status: 'UTF-8',
      description: $localize`:Meta description for the stack page@@meta.stack:The tools Nik uses for frontend, backend, and data work, each linked to the project that shows it.`,
    }),
  },
  {
    path: 'referrals',
    component: Referrals,
    title: $localize`:Browser tab title for the referrals page@@title.referrals:Referrals`,
    data: page({
      file: 'referrals.md',
      section: $localize`:Status bar section name@@section.referrals:Referrals`,
      status: 'UTF-8',
      description: $localize`:Meta description for the referrals page@@meta.referrals:What people who have worked with Nik say about the work, shared with their permission.`,
    }),
  },
  {
    path: 'about',
    component: About,
    title: $localize`:Browser tab title for the about page@@title.about:About`,
    data: page({
      file: 'about.md',
      section: $localize`:Status bar section name@@section.about:About`,
      status: 'UTF-8',
      description: $localize`:Meta description for the about page@@meta.about:Who Nik is, how Nik works, and Nik's experience and education.`,
    }),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
    title: $localize`:Browser tab title for the contact page@@title.contact:Contact`,
    data: page({
      file: 'contact.md',
      section: $localize`:Status bar section name@@section.contact:Contact`,
      status: 'UTF-8',
      description: $localize`:Meta description for the contact page@@meta.contact:Send Nik a message, or find Nik's email, resume, GitHub and LinkedIn.`,
    }),
  },
  {
    path: 'resume',
    component: Resume,
    title: $localize`:Browser tab title for the resume page@@title.resume:Resume`,
    data: page({
      file: 'resume.pdf',
      section: $localize`:Status bar section name@@section.resume:Resume`,
      status: 'PDF',
      description: $localize`:Meta description for the resume page@@meta.resume:Preview and download Nik's one-page resume as a PDF.`,
    }),
  },
  // /404 exists so the build can write 404.html for each language (see scripts/finalize-build.mjs).
  { ...notFound, path: '404' },
  { ...notFound, path: '**' },
];
