import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ConfirmPopupComponent } from './confirm-popup';
import { PopoverComponent } from '@shared/ui/popover/popover';

describe('ConfirmPopupComponent', () => {
  let fixture: ComponentFixture<ConfirmPopupComponent>;
  let trigger: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmPopupComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    trigger = document.createElement('button');
    trigger.textContent = 'Reset trigger';
    document.body.appendChild(trigger);

    fixture = TestBed.createComponent(ConfirmPopupComponent);
    fixture.componentRef.setInput('triggerElement', trigger);
    fixture.componentRef.setInput('message', 'Reset your build to default?');
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    trigger.remove();
  });

  const open = () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  };

  it('renders the message and Confirm/Cancel buttons in an overlay panel', () => {
    open();

    const panel = document.body.querySelector('[role="alertdialog"]') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.textContent).toContain('Reset your build to default?');

    const confirmBtn = panel.querySelector('.confirm-popup__btn--confirm') as HTMLElement;
    const cancelBtn = panel.querySelector('.confirm-popup__btn--cancel') as HTMLElement;
    expect(confirmBtn.textContent).toContain('Confirm');
    expect(cancelBtn.textContent).toContain('Cancel');
  });

  it('preserves alertdialog, aria-modal, and aria-labelledby semantics', () => {
    open();

    const panel = document.body.querySelector('[role="alertdialog"]') as HTMLElement;
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.getAttribute('aria-labelledby')).toBe('confirm-popup-message');

    const message = document.body.querySelector('#confirm-popup-message') as HTMLElement;
    expect(message).toBeTruthy();
    expect(message.textContent).toContain('Reset your build to default?');
  });

  it('positions the overlay relative to the trigger element passed through the wrapper', () => {
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

  it('focuses the Confirm button on open', () => {
    open();

    const confirmBtn = document.body.querySelector('.confirm-popup__btn--confirm') as HTMLElement;
    expect(document.activeElement).toBe(confirmBtn);
    expect(document.activeElement?.classList.contains('cdk-focus-trap-anchor')).toBe(false);
  });

  it('emits confirm and closes when Confirm is clicked', () => {
    const confirmSpy = vi.spyOn(fixture.componentInstance.confirm, 'emit');
    open();

    const confirmBtn = document.body.querySelector(
      '.confirm-popup__btn--confirm',
    ) as HTMLButtonElement;
    confirmBtn.click();
    fixture.detectChanges();

    expect(confirmSpy).toHaveBeenCalled();
    expect(document.body.querySelector('[role="alertdialog"]')).toBeNull();
  });

  it('closes without emitting when Cancel is clicked', () => {
    const confirmSpy = vi.spyOn(fixture.componentInstance.confirm, 'emit');
    open();

    const cancelBtn = document.body.querySelector(
      '.confirm-popup__btn--cancel',
    ) as HTMLButtonElement;
    cancelBtn.click();
    fixture.detectChanges();

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(document.body.querySelector('[role="alertdialog"]')).toBeNull();
  });

  it('closes when Escape is pressed', () => {
    open();

    const panel = document.body.querySelector('[role="alertdialog"]') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(document.body.querySelector('[role="alertdialog"]')).toBeNull();
  });
});
