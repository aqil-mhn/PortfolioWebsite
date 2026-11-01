import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { About } from './about/about';
import { CaseStudy } from './case-study/case-study';
import { Contact } from './contact/contact';
import { Home } from './home/home';
import { NotFound } from './not-found/not-found';
import { Referrals } from './referrals/referrals';
import { Resume } from './resume/resume';
import { Stack } from './stack/stack';

const pages: [string, Type<unknown>][] = [
  ['Home', Home],
  ['CaseStudy', CaseStudy],
  ['Stack', Stack],
  ['Referrals', Referrals],
  ['About', About],
  ['Contact', Contact],
  ['Resume', Resume],
  ['NotFound', NotFound],
];

describe('pages', () => {
  it.each(pages)('%s renders one h1 and starts with the breadcrumb', async (_name, page) => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(page);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('.page-head')?.textContent).toContain('nikaqil.com /');
  });
});
