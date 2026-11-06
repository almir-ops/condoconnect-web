import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { validationProfile, validatePayload, validationError } from '../../shared/utils/validation';
import { ValidationNotice } from '../../shared/validation-notice';
import { environment } from '../../../environments/environment';

@Injectable()
export class ValidationInterceptor implements HttpInterceptor {
  constructor(private notice: ValidationNotice) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const base = new URL(environment.apiUrl, window.location.origin);
    const target = new URL(req.url, window.location.origin);
    const prefix = base.pathname.replace(/\/?$/, '/');
    if (target.origin !== base.origin || !target.pathname.startsWith(prefix)) return next.handle(req);
    const profile = validationProfile(req.method, target.pathname.slice(prefix.length));
    if (!profile) return next.handle(req);
    this.notice.message.set('');
    const result = validatePayload(profile, req.body);
    if (Object.keys(result.errors).length) {
      const error = validationError(result.errors);
      this.notice.message.set(error.message);
      return throwError(() => new HttpErrorResponse({status:400,error,url:req.url}));
    }
    return next.handle(req.clone({body:result.data})).pipe(catchError((err: HttpErrorResponse) => {
      const payload = err.error;
      if (err.status === 400 || err.status === 409 || err.status === 422) {
        const message = typeof payload?.message === 'string' ? payload.message
          : typeof payload?.error === 'string' ? payload.error : 'Revise os dados informados.';
        this.notice.message.set(message);
      }
      return throwError(() => err);
    }));
  }
}
