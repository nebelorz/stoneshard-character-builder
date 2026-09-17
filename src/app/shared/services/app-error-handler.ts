import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from '@shared/services/toast.service';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private readonly toastService = inject(ToastService);

  handleError(error: unknown): void {
    console.error(error);
    this.toastService.show('An unexpected error occurred', 'error');
  }
}
