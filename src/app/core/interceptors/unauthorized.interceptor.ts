import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalAlertComponent } from '../../shared/componentes/modais/modal-alert/modal-alert.component';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

  constructor(
    private router:Router,
    public dialog: MatDialog,

  ) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.dialog.closeAll();
          this.router.navigate(['/admin/login']);
          this.dialog.open(ModalAlertComponent, {
            data: { message: 'Acesso expirado! faça login novamente para continuar.', found: false},
          });
        }
        return throwError(error);
      })
    );
  }
}
