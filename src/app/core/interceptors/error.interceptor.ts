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
import { ModalAlertComponent } from '../../shared/componentes/modais/modal-alert/modal-alert.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    public dialog: MatDialog
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Caso o erro seja 401, o UnauthorizedInterceptor deve tratá-lo
        if (error.status === 401) {
          return throwError(error); // Deixa o tratamento para o UnauthorizedInterceptor
        }

        // Tratamento de outros erros
        let errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

        switch (error.status) {
          case 400:
            errorMessage = 'Requisição inválida. Verifique os dados enviados.';
            break;
          case 403:
            errorMessage = 'Você não tem permissão para acessar este recurso.';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado.';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
            break;
          // Outros casos de erro podem ser adicionados aqui
          default:
            errorMessage = `Erro inesperado: ${error.message}`;
            break;
        }

        // Exibe o modal de alerta com a mensagem de erro apropriada
        this.dialog.closeAll();
        this.dialog.open(ModalAlertComponent, {
          data: { message: errorMessage, found: false }
        });

        return throwError(error);
      })
    );
  }
}
