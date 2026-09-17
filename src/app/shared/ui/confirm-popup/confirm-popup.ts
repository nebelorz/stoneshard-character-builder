import { Component, input, model, output } from '@angular/core';
import { PopoverComponent } from '@shared/ui/popover/popover';

@Component({
  selector: 'app-confirm-popup',
  imports: [PopoverComponent],
  template: `
    <app-popover
      [(isOpen)]="isOpen"
      [triggerElement]="triggerElement()"
      [role]="'alertdialog'"
      [ariaLabelledby]="'confirm-popup-message'"
    >
      <p class="confirm-popup__message" id="confirm-popup-message">{{ message() }}</p>
      <div class="confirm-popup__actions">
        <button class="confirm-popup__btn confirm-popup__btn--confirm" (click)="onConfirm()">
          Confirm
        </button>
        <button class="confirm-popup__btn confirm-popup__btn--cancel" (click)="onCancel()">
          Cancel
        </button>
      </div>
    </app-popover>
  `,
  styles: `
    @use 'variables' as *;
    @use 'components' as *;

    :host {
      display: contents;
    }

    .confirm-popup__message {
      margin: 0 0 16px;
      color: $text-primary;
      font-size: 14px;
      line-height: 1.5;
    }

    .confirm-popup__actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .confirm-popup__btn {
      border: none;
      border-radius: 4px;
      padding: 6px 14px;
      font-size: 13px;
      font-family: $font-ui;
      font-weight: $font-weight-semibold;
      cursor: pointer;
      transition: background 0.15s ease;

      &:focus-visible {
        @include focus-ring;
      }
    }

    .confirm-popup__btn--confirm {
      background: $rust;
      color: $text-primary;

      &:hover {
        background: $rust-hover;
      }
    }

    .confirm-popup__btn--cancel {
      background: $btn-bg;
      color: $text-primary;

      &:hover {
        background: $btn-hover;
      }
    }
  `,
})
export class ConfirmPopupComponent {
  readonly message = input<string>('Are you sure?');
  readonly isOpen = model(false);
  readonly confirm = output<void>();
  readonly triggerElement = input<HTMLElement | null>(null);

  onConfirm(): void {
    this.confirm.emit();
    this.isOpen.set(false);
  }

  onCancel(): void {
    this.isOpen.set(false);
  }
}
