import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../../shared/services/auth/auth.service';

@Injectable()
export class TokenProviderInterceptor implements HttpInterceptor {

  domain: string;

  constructor(private authService: AuthService) {
    this.domain = window.location.hostname;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const accessToken = this.authService.getToken()

    if (accessToken) {
      let authReq = request;
      authReq = request.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}`,
      },
      });
      return next.handle(authReq);
    }


    return next.handle(request).pipe(catchError(this.handleError));

  }

  private handleError(error: HttpErrorResponse) {


    if (error.error instanceof ErrorEvent) {

      console.error('Ocorreu um erro: ', error.error.message);

    } else {

      console.error(
        `Código do erro ${error.status}, ` +
        `Erro: ${JSON.stringify(error.error)}`);
    }

    return throwError(JSON.stringify(`${error.status}`));

  }
}
