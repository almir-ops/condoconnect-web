import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../material-module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categoria-dialog',
  templateUrl: './categoria-dialog.component.html',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule],
  styleUrls: ['./categoria-dialog.component.scss']
})
export class CategoriaDialogComponent {
  nomeCategorias: string = '';
  descricaoCategorias: string = '';
  caracteresRestantes: number = 150;
  editMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CategoriaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nomeCategorias = data.nomeCategorias || '';
    this.descricaoCategorias = data.descricaoCategorias || '';
    this.editMode = data.editMode;
  }

  fechar(): void {
    this.dialogRef.close();
  }

  atualizarContagem(): void {
    this.caracteresRestantes = 150 - this.descricaoCategorias.length;
  }

  salvar(): void {
    this.dialogRef.close({
      nomeCategorias: this.nomeCategorias,
      descricaoCategorias: this.descricaoCategorias,
      editMode: this.editMode
    });
  }
}
