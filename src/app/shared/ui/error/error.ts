import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <div class="error" role="alert">
      <div class="error__icon">!</div>
      <div class="error__message">{{ message() }}</div>
      <button class="error__retry" (click)="onRetry()">Try Again</button>
    </div>
  `,
  styles: [
    `
      @use 'variables' as *;

      .error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 48px;
        color: $text-primary;
      }

      .error__icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba($rust, 0.2);
        border: 2px solid $rust;
        border-radius: 50%;
        font-size: 24px;
        font-weight: 700;
        color: $rust;
      }

      .error__message {
        font-size: 14px;
        color: $text-secondary;
        text-align: center;
        max-width: 300px;
      }

      .error__retry {
        margin-top: 8px;
        padding: 8px 16px;
        background: $btn-bg;
        border: 1px solid $border-dim;
        border-radius: 4px;
        color: $text-primary;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.15s;

        &:hover {
          background: $btn-hover;
          border-color: $border-gold;
        }
      }
    `,
  ],
})
export class ErrorComponent {
  message = input.required<string>();
  retry = input<(() => void) | undefined>(undefined);

  onRetry(): void {
    const callback = this.retry();
    if (callback) {
      callback();
    } else {
      window.location.reload();
    }
  }
}
