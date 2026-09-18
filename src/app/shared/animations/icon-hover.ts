import { trigger, transition, state, style, animate, keyframes } from '@angular/animations';

export const iconHover = trigger('iconHover', [
  state('active', style({ transform: 'scale(1.1)' })),
  state('idle', style({ transform: 'scale(1) rotate(0deg)' })),
  transition('idle => active', [
    animate(
      '300ms ease-out',
      keyframes([
        style({ transform: 'scale(1) rotate(0deg)', offset: 0 }),
        style({ transform: 'scale(1.1) rotate(-3deg)', offset: 0.3 }),
        style({ transform: 'scale(1.1) rotate(3deg)', offset: 0.6 }),
        style({ transform: 'scale(1.1) rotate(0deg)', offset: 1 }),
      ]),
    ),
  ]),
  transition('active => idle', [
    animate('200ms ease-in', style({ transform: 'scale(1) rotate(0deg)' })),
  ]),
]);
