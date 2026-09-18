import { Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { AnimationBuilder, AnimationPlayer, style, animate, keyframes } from '@angular/animations';

@Directive({
  selector: '[appIconHover]',
})
export class IconHoverDirective implements OnDestroy {
  private readonly hostRef = inject(ElementRef);
  private readonly animationBuilder = inject(AnimationBuilder);
  private activeAnimation: AnimationPlayer | null = null;

  constructor() {
    const el = this.hostRef.nativeElement;
    el.addEventListener('mouseenter', this.onMouseEnter);
    el.addEventListener('mouseleave', this.onMouseLeave);
  }

  private onMouseEnter = (): void => {
    this.activeAnimation?.destroy();

    const factory = this.animationBuilder.build(
      animate(
        '300ms ease-out',
        keyframes([
          style({ transform: 'scale(1) rotate(0deg)', offset: 0 }),
          style({ transform: 'scale(1.1) rotate(-3deg)', offset: 0.3 }),
          style({ transform: 'scale(1.1) rotate(3deg)', offset: 0.6 }),
          style({ transform: 'scale(1.1) rotate(0deg)', offset: 1 }),
        ]),
      ),
    );

    this.activeAnimation = factory.create(this.hostRef.nativeElement);
    this.activeAnimation.play();
  };

  private onMouseLeave = (): void => {
    this.activeAnimation?.destroy();

    const factory = this.animationBuilder.build(
      animate('200ms ease-in', style({ transform: 'scale(1) rotate(0deg)' })),
    );

    this.activeAnimation = factory.create(this.hostRef.nativeElement);
    this.activeAnimation.play();
  };

  ngOnDestroy(): void {
    this.activeAnimation?.destroy();
    const el = this.hostRef.nativeElement;
    el.removeEventListener('mouseenter', this.onMouseEnter);
    el.removeEventListener('mouseleave', this.onMouseLeave);
  }
}
