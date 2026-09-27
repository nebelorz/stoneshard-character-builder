import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { OverlayModule } from '@angular/cdk/overlay';
import { AppErrorHandler } from '@shared/services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(OverlayModule),
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
};
