import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material-module';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule],
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.scss'
})
export class ModalUsuarioComponent {
  nome: string = '';
  tipo: string = '';
  email: string = '';
  status: string = '';
  telefone: string = '';
  password: string = '';
  editMode: boolean = false;

  hiddenPassword: boolean = false;
  usuario:any;
  empresasDisponiveis: any[] = [];
  empresaSelecionadaId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.data = data || {}; // Garante que data nunca seja null ou undefined
    this.usuario = this.data.usuario || {}; // Garante que plano sempre tenha um objeto válido

    this.nome = this.usuario.nome ?? ''; // Usa ?? para tratar valores null e undefined
    this.tipo = this.usuario.tipo ?? 'cliente';
    this.status = this.usuario.status ?? 'ativo';
    this.email = this.usuario.email ?? '';
    this.telefone = this.usuario.telefone ?? '';
    this.editMode = this.data.editMode ?? false;
    this.empresasDisponiveis = this.data.empresasDisponiveis ?? [];
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
      email: this.email,
      status: this.status,
      telefone: this.telefone,
      editMode: this.editMode
    });
  }

  update(): void {
    this.dialogRef.close({
      id: this.usuario.id,
      nome: this.nome,
      tipo: this.tipo,
      email: this.email,
      status: this.status,
      telefone: this.telefone,
      editMode: this.editMode,
      empresaId: this.empresaSelecionadaId,
    });
  }
}
