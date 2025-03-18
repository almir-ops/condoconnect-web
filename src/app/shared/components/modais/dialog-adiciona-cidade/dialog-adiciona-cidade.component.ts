import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../material-module';

@Component({
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule],
  selector: 'app-dialog-adiciona-cidade',
  templateUrl: './dialog-adiciona-cidade.component.html',
  styleUrl: './dialog-adiciona-cidade.component.scss'

})
export class DialogAdicionaCidadeComponent {
  nomeCidade: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogAdicionaCidadeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  fecharDialog(): void {
    this.dialogRef.close();
  }

  adicionarCidade(): void {
    if (this.nomeCidade.trim() === '') {
      alert('Preencha um nome de cidade');
      return;
    }
    this.dialogRef.close(this.nomeCidade);
  }
}
