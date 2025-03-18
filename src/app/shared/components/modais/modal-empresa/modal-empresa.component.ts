import { Component, Inject } from '@angular/core';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material-module';

@Component({
  selector: 'app-modal-empresa',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule],
  templateUrl: './modal-empresa.component.html',
  styleUrl: './modal-empresa.component.scss'
})
export class ModalEmpresaComponent {

  nome: string = '';
  tipo: string = '';
  email: string = '';
  status: string = '';
  telefone: string = '';
  password: string = '';
  editMode: boolean = false;

  hiddenPassword: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.data = data || {}; // Garante que data nunca seja null ou undefined
    this.nome = this.data.nome ?? ''; // Usa ?? para tratar valores null e undefined
    this.tipo = this.data.tipo ?? 'cliente';
    this.status = this.data.status ?? 'ativo';
    this.email = this.data.email ?? '';
    this.editMode = this.data.editMode ?? false;
  }

  fechar(): void {
    this.dialogRef.close();
  }
  viewPassword(): void {
    this.hiddenPassword = !this.hiddenPassword;
  }

  salvar(): void {
    this.dialogRef.close({
      nome: this.nome,
      tipo: this.tipo,
      editMode: this.editMode
    });
  }
}
