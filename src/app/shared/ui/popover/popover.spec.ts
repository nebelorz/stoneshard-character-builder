import { Component, signal } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PopoverComponent } from './popover';

@Component({
  selector: 'app-popover-host',
  imports: [PopoverComponent],
  template: `
    <app-popover [triggerElement]="trigger" [isOpen]="open()">
      <button class="test-first-focusable">Confirm</button>
      <button class="test-second-focusable">Cancel</button>
    </app-popover>
  `,
})
class PopoverHostComponent {
  trigger!: HTMLElement;
  open = signal(false);
}

describe('PopoverComponent', () => {
  let fixture: ComponentFixture<PopoverHostComponent>;
  let trigger: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverHostComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    trigger = document.createElement('button');
    trigger.textContent = 'Trigger';
    document.body.appendChild(trigger);

    fixture = TestBed.createComponent(PopoverHostComponent);
    fixture.componentInstance.trigger = trigger;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    trigger.remove();
  });

  const open = () => {
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
  };

  it('opens the overlay panel with projected content in document.body when isOpen is set', () => {
    open();

    const panel = document.body.querySelector('.popover') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.textContent).toContain('Confirm');
  });

  it('renders the default dialog role and aria-label for the share/AI-prompt popovers', () => {
    open();

    const panel = document.body.querySelector('.popover') as HTMLElement;
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-label')).toBe('Popover');
    expect(panel.getAttribute('aria-modal')).toBe('true');
  });

  it('positions the overlay relative to the supplied trigger element', () => {
    const rect = {
      top: 100,
      left: 200,
      right: 300,
      bottom: 140,
      width: 100,
      height: 40,
    } as DOMRect;
    trigger.getBoundingClientRect = () => rect;
    open();

    const popoverDebug = fixture.debugElement.query(By.directive(PopoverComponent));
    const popover = popoverDebug.componentInstance as unknown as {
      overlayRef: {
        getConfig(): { positionStrategy: { _getOriginRect(): DOMRect } };
      };
    };
    const strategy = popover.overlayRef.getConfig().positionStrategy;
    const originRect = strategy._getOriginRect();

    expect(originRect.left).toBe(200);
    expect(originRect.top).toBe(100);
    expect(originRect.width).toBe(100);
    expect(originRect.height).toBe(40);
  });

  it('keeps the panel in-flow so the CDK can position it above the trigger', () => {
    open();

    const panel = document.body.querySelector('.popover') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(getComputedStyle(panel).position).toBe('relative');
  });

  it('always opens above the trigger, centered over it', () => {
    open();

    const popoverDebug = fixture.debugElement.query(By.directive(PopoverComponent));
    const popover = popoverDebug.componentInstance as unknown as {
      overlayRef: {
        getConfig(): {
          positionStrategy: {
            positions: { originX: string; originY: string; overlayX: string; overlayY: string }[];
          };
        };
      };
    };
    const positions = popover.overlayRef.getConfig().positionStrategy.positions;
    const [preferred] = positions;

    expect(positions.length).toBe(1);
    expect(preferred.originY).toBe('top');
    expect(preferred.overlayY).toBe('bottom');
    expect(preferred.originX).toBe('center');
    expect(preferred.overlayX).toBe('center');
  });

  it('closes and restores focus to the trigger when isOpen is set false', () => {
    open();
    expect(document.body.querySelector('.popover')).toBeTruthy();

    fixture.componentInstance.open.set(false);
    fixture.detectChanges();

    expect(document.body.querySelector('.popover')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('focuses the first real focusable element inside the overlay, not the focus-trap anchor', () => {
    open();

    const firstBtn = document.body.querySelector('.test-first-focusable') as HTMLElement;
    expect(firstBtn).toBeTruthy();
    expect(document.activeElement).toBe(firstBtn);
    expect(document.activeElement?.classList.contains('cdk-focus-trap-anchor')).toBe(false);
  });

  it('closes and restores focus to the trigger when Escape is pressed', () => {
    open();
    const panel = document.body.querySelector('.popover') as HTMLElement;
    expect(panel).toBeTruthy();

    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(document.body.querySelector('.popover')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
