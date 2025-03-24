import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../material-module';

@Component({
  selector: 'app-modal-confirm-dialog',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './modal-confirm-dialog.component.html',
  styleUrl: './modal-confirm-dialog.component.scss'
})
export class ModalConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  fechar(resposta: boolean): void {
    this.dialogRef.close(resposta);
  }
}
