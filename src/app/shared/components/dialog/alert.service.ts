import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private dialog: MatDialog) {}

  presentAlert(header: string, message: string, okCallback?: () => void) {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '350px',
      data: { header, message },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (okCallback) {
        okCallback(); // Executa o callback após fechar
      }
    });
  }
}
