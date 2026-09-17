import { Signal } from '@angular/core';
import { ToastService } from '@shared/services';

export async function copyWithFeedback(
  copiedSignal: Signal<boolean> & { set(value: boolean): void },
  asyncFn: () => Promise<boolean>,
  toastService: ToastService,
): Promise<void> {
  const success = await asyncFn();
  if (success) {
    copiedSignal.set(true);
    setTimeout(() => {
      copiedSignal.set(false);
    }, 2000);
  } else {
    toastService.show('Failed to copy to clipboard', 'error');
  }
}
