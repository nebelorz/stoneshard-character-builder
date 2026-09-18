import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-4px)' }),
    animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-4px)' })),
  ]),
]);

export const fadeInOutFast = trigger('fadeInOutFast', [
  transition(':enter', [style({ opacity: 0 }), animate('150ms ease-out', style({ opacity: 1 }))]),
  transition(':leave', [animate('100ms ease-in', style({ opacity: 0 }))]),
]);

export const expandCollapse = trigger('expandCollapse', [
  transition(':enter', [
    style({ height: 0, opacity: 0, overflow: 'hidden' }),
    animate('200ms ease-out', style({ height: '*', opacity: 1, overflow: 'hidden' })),
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ height: 0, opacity: 0, overflow: 'hidden' })),
  ]),
]);

export const cardReflow = trigger('cardReflow', [
  transition(':leave', [
    query(
      '.pin-area__card',
      [
        stagger(80, [
          style({ transform: 'translateX(-10px)' }),
          animate('120ms ease-out', style({ transform: 'translateX(0)' })),
        ]),
      ],
      { optional: true },
    ),
  ]),
]);
