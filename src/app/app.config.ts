import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { ValidationInterceptor } from './core/interceptors/validation.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([loadingInterceptor]), withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: ValidationInterceptor, multi:true},
    provideAnimationsAsync(), provideAnimationsAsync(),

  ],
};
