import { Injectable, signal } from '@angular/core';

type ToastType = 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;

  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'error', duration = 3000): void {
    const toast: Toast = { id: this.nextId++, message, type, duration };
    this.toasts.update((current) => [...current, toast]);

    setTimeout(() => {
      this.toasts.update((current) => current.filter((t) => t.id !== toast.id));
    }, duration);
  }
}
