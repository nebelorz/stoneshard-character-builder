import {
  Component,
  input,
  model,
  output,
  signal,
  effect,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ConfirmPopupComponent } from '@shared/ui/confirm-popup/confirm-popup';
import { BuildNotes } from '@models';

@Component({
  selector: 'app-notes-modal',
  imports: [FormsModule, CdkTextareaAutosize, ConfirmPopupComponent],
  template: `
    @if (isOpen()) {
      <div class="notes-modal-overlay" (mousedown)="onBackdropMouseDown($event)">
        <div class="notes-modal font-ui" role="dialog" aria-label="Edit build notes">
          <div class="notes-modal__fields">
            <input
              class="notes-modal__input"
              type="text"
              placeholder="Build Name"
              [maxlength]="50"
              [ngModel]="buildNameValue()"
              (ngModelChange)="buildNameValue.set($event)"
              (input)="onInput()"
            />
            <input
              class="notes-modal__input"
              type="text"
              placeholder="Author"
              [maxlength]="50"
              [ngModel]="authorValue()"
              (ngModelChange)="authorValue.set($event)"
              (input)="onInput()"
            />
          </div>
          <textarea
            class="notes-modal__textarea"
            placeholder="Write your notes here..."
            [maxlength]="1000"
            cdkTextareaAutosize
            [ngModel]="contentValue()"
            (ngModelChange)="contentValue.set($event)"
            (input)="onInput()"
          ></textarea>
          <div class="notes-modal__footer">
            <span class="notes-modal__counter">{{ contentValue().length }} / 1000</span>
            <div class="notes-modal__actions">
              <button class="notes-modal__btn notes-modal__btn--save" (click)="onSave()">
                Save
              </button>
              <button
                class="notes-modal__btn notes-modal__btn--close"
                #closeBtn
                (click)="onClose()"
              >
                Close
              </button>
              <app-confirm-popup
                [(isOpen)]="confirmOpen"
                [triggerElement]="closeBtn"
                [message]="'Unsaved changes will be lost'"
                (confirm)="onConfirmDiscard()"
                (cancel)="onCancelConfirm()"
              />
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    @use 'variables' as *;

    :host {
      display: contents;
    }

    .notes-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.6);
    }

    .notes-modal {
      background: $bg-panel;
      border: 1px solid $border-dim;
      border-radius: $radius-sm;
      box-shadow: $shadow-dropdown;
      padding: 16px;
      width: 480px;
      max-width: 90vw;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .notes-modal__fields {
      display: flex;
      gap: 8px;
    }

    .notes-modal__input {
      flex: 1;
      padding: 8px 10px;
      background: $bg-deepest;
      border: 1px solid $border-dim;
      border-radius: $radius-sm;
      color: $text-primary;
      font-size: $font-size-base;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s;

      &::placeholder {
        color: $text-secondary;
      }

      &:focus {
        border-color: $border-gold;
      }
    }

    .notes-modal__textarea {
      width: 100%;
      min-height: 120px;
      padding: 8px 10px;
      background: $bg-deepest;
      border: 1px solid $border-dim;
      border-radius: $radius-sm;
      color: $text-primary;
      font-size: $font-size-base;
      font-family: inherit;
      resize: none;
      outline: none;
      transition: border-color 0.15s;
      box-sizing: border-box;

      &::placeholder {
        color: $text-secondary;
      }

      &:focus {
        border-color: $border-gold;
      }
    }

    .notes-modal__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .notes-modal__counter {
      color: $text-secondary;
      font-size: $font-size-sm;
    }

    .notes-modal__actions {
      display: flex;
      gap: 8px;
      position: relative;
    }

    .notes-modal__btn {
      border: none;
      border-radius: 4px;
      padding: 6px 14px;
      font-size: $font-size-sm;
      font-family: $font-ui;
      font-weight: $font-weight-semibold;
      cursor: pointer;
      transition: background 0.15s ease;

      &:focus-visible {
        @include focus-ring;
      }
    }

    .notes-modal__btn--save {
      background: $button-purple;
      color: $text-primary;

      &:hover {
        background: $button-purple-hover;
      }
    }

    .notes-modal__btn--close {
      background: $button-red;
      color: $text-primary;

      &:hover {
        background: $button-red-hover;
      }
    }
  `,
})
export class NotesModalComponent {
  readonly isOpen = model(false);
  readonly initialBuildName = input<string>('');
  readonly initialAuthor = input<string>('');
  readonly initialContent = input<string>('');
  readonly save = output<BuildNotes>();
  readonly close = output<void>();

  @ViewChild('closeBtn') closeBtnRef!: ElementRef<HTMLElement>;

  buildNameValue = signal('');
  authorValue = signal('');
  contentValue = signal('');
  dirty = signal(false);
  confirmOpen = signal(false);

  private readonly syncInputs = effect(() => {
    const bn = this.initialBuildName();
    const au = this.initialAuthor();
    const co = this.initialContent();
    this.buildNameValue.set(bn);
    this.authorValue.set(au);
    this.contentValue.set(co);
    this.dirty.set(false);
  });

  onInput(): void {
    this.dirty.set(true);
  }

  onSave(): void {
    this.save.emit({
      buildName: this.buildNameValue(),
      author: this.authorValue(),
      content: this.contentValue(),
    });
    this.dirty.set(false);
    this.isOpen.set(false);
  }

  onClose(): void {
    if (this.dirty()) {
      this.confirmOpen.set(true);
    } else {
      this.close.emit();
      this.isOpen.set(false);
    }
  }

  onConfirmDiscard(): void {
    this.buildNameValue.set(this.initialBuildName());
    this.authorValue.set(this.initialAuthor());
    this.contentValue.set(this.initialContent());
    this.dirty.set(false);
    this.close.emit();
    this.isOpen.set(false);
  }

  onCancelConfirm(): void {
    this.confirmOpen.set(false);
  }

  onBackdropMouseDown(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('notes-modal-overlay')) {
      this.onClose();
    }
  }
}
