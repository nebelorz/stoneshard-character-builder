import { Injectable, signal } from '@angular/core';

type PopupType = 'share' | 'ai-prompt' | 'reset' | null;

@Injectable({ providedIn: 'root' })
export class PopupService {
  private readonly _isOpen = signal(false);
  private readonly _type = signal<PopupType>(null);
  private readonly _trigger = signal<HTMLElement | null>(null);

  readonly isOpen = this._isOpen.asReadonly();
  readonly type = this._type.asReadonly();
  readonly trigger = this._trigger.asReadonly();

  open(type: PopupType, triggerElement: HTMLElement): void {
    this._type.set(type);
    this._trigger.set(triggerElement);
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
    this._type.set(null);
    this._trigger.set(null);
  }
}
