import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { AppErrorHandler } from '@shared/services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(OverlayModule),
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
};
