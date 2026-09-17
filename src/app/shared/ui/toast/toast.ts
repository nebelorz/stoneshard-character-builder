import { Component, inject } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-container" role="status" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}">
          <span class="toast__message">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @use 'variables' as *;

      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 10000;
        pointer-events: none;
      }

      .toast {
        padding: 10px 16px;
        border-radius: 4px;
        font-size: 13px;
        color: $text-primary;
        pointer-events: auto;
        animation: slide-in 0.2s ease-out;

        &--error {
          background: rgba($button-red, 0.9);
          border: 1px solid $button-red;
        }

        &--warning {
          background: rgba($gold-dim, 0.9);
          border: 1px solid $gold-dim;
        }

        &--info {
          background: rgba($button-purple, 0.9);
          border: 1px solid $button-purple-hover;
        }
      }

      @keyframes slide-in {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
