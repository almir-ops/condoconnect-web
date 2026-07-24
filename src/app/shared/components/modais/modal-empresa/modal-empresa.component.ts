import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material-module';

@Component({
  selector: 'app-modal-empresa',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './modal-empresa.component.html',
  styleUrl: './modal-empresa.component.scss'
})
export class ModalEmpresaComponent {

  nome: string = '';
  email: string = '';
  cnpj: string = '';
  telefone: string = '';
  celular: string = '';
  endereco: string = '';
  bairro: string = '';
  cidade: string = '';
  estado: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.data = data || {};
  }

  fechar(): void {
    this.dialogRef.close();
  }

  salvar(): void {
    this.dialogRef.close({
      nome: this.nome,
      email: this.email,
      cnpj: this.cnpj,
      telefone: this.telefone,
      celular: this.celular,
      endereco: this.endereco,
      bairro: this.bairro,
      cidade: this.cidade,
      estado: this.estado,
    });
  }
}
