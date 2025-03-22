import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private dialog: MatDialog) {}

  presentAlert(header: string, message: string, okCallback?: () => void, duration: number = 5000) {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '350px',
      data: { header, message },
    });

    // Fechar o alerta automaticamente após o tempo definido
    setTimeout(() => {
      dialogRef.close();
    }, duration);

    dialogRef.afterClosed().subscribe(() => {
      console.log('das');

      if (okCallback) {
        okCallback(); // Executa o callback após fechar
      }
    });
  }

}
