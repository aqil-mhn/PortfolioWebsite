import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * Page-enter motion. Content is complete without it: the hidden state is added from here,
 * only after a client-side navigation, and only when the visitor allows motion.
 */
@Injectable({ providedIn: 'root' })
export class Motion {
  private readonly document = inject(DOCUMENT);
  private mediaQuery?: { revert(): void };

  async enter(page: HTMLElement): Promise<void> {
    const targets = Array.from(page.children);
    if (targets.length === 0) {
      return;
    }

    const [{ gsap }, { CustomEase }] = await Promise.all([
      import('gsap'),
      import('gsap/CustomEase'),
    ]);
    gsap.registerPlugin(CustomEase);

    const style = getComputedStyle(this.document.documentElement);
    const duration = parseFloat(style.getPropertyValue('--dur')) / 1000;
    const shift = parseFloat(style.getPropertyValue('--shift'));
    const bezier = style
      .getPropertyValue('--ease')
      .match(/-?\d*\.?\d+/g)
      ?.join(',');
    const ease = bezier ? CustomEase.create('site', bezier) : 'power2.out';

    this.mediaQuery?.revert();
    const mediaQuery = gsap.matchMedia();
    mediaQuery.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(targets, {
        opacity: 0,
        y: shift,
        duration,
        ease,
        stagger: duration / 6,
        clearProps: 'opacity,transform',
      });
    });
    this.mediaQuery = mediaQuery;
  }
}
