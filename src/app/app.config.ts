import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { NgxSpinnerConfig } from 'ngx-spinner/lib/config';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { ServerErrorsInterceptor } from './core/interceptors/server-error.interceptor';

const spinnerConfig: NgxSpinnerConfig = {
  type: 'ball-spin-clockwise'
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    provideRouter(
      routes,
      withViewTransitions(),
    ),
    provideHttpClient(),
    importProvidersFrom(
      HttpClientModule,
      NgxSpinnerModule.forRoot(spinnerConfig)
    ),
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: ServerErrorsInterceptor, multi: true
    }
  ]
};
