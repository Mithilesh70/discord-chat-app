import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './core/interceptor/loader.interceptor';
import { errorHandlerInterceptor } from './core/interceptor/error-handler.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DialogModule } from '@angular/cdk/dialog';
import { apiBaseUrlInterceptor } from './core/interceptor/api-base-url.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    provideHttpClient(
      withInterceptors([
        apiBaseUrlInterceptor,
        loaderInterceptor,
        errorHandlerInterceptor,
      ])
    ),
    provideToastr({
      timeOut: 3000,
      easeTime: 300,
      easing: 'easing',
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideAnimations(),
    importProvidersFrom(DialogModule),
  ],
};
