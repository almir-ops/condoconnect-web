import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material-module';
import { normalizePhone, validPhone, formatPhone, PHONE_ERROR } from '../../../utils/phone';
import { EmailLowercaseDirective } from '../../../directives/email-lowercase.directive';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule,EmailLowercaseDirective],
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.scss'
})
export class ModalUsuarioComponent {
  nome: string = '';
  tipo: string = '';
  email: string = '';
  status: string = '';
  telefone: string = '';
  phoneError = '';
  formatPhone = formatPhone;
  password: string = '';
  editMode: boolean = false;

  hiddenPassword: boolean = false;
  usuario:any;
  empresasDisponiveis: any[] = [];
  telefonesExistentes: { id: number; telefone: string | null }[] = [];
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
    this.email = String(this.usuario.email ?? '').toLowerCase();
    this.telefone = this.usuario.telefone ?? '';
    this.editMode = this.data.editMode ?? false;
    this.empresasDisponiveis = this.data.empresasDisponiveis ?? [];
    this.telefonesExistentes = this.data.telefonesExistentes ?? [];
  }

  fechar(): void {
    this.dialogRef.close();
  }
  viewPassword(): void {
    this.hiddenPassword = !this.hiddenPassword;
  }

  salvar(): void {
    this.validarTelefone();
    if (this.phoneError) return;
    this.dialogRef.close({
      nome: this.nome,
      tipo: this.tipo,
      email: this.email.trim().toLowerCase(),
      status: this.status,
      telefone: normalizePhone(this.telefone),
      senha: this.password,
      editMode: this.editMode
    });
  }

  update(): void {
    this.validarTelefone();
    if (this.phoneError) return;
    this.dialogRef.close({
      id: this.usuario.id,
      nome: this.nome,
      tipo: this.tipo,
      email: this.email.trim().toLowerCase(),
      status: this.status,
      telefone: this.telefone.trim() ? normalizePhone(this.telefone) : this.usuario.telefone ?? null,
      editMode: this.editMode,
      empresaId: this.empresaSelecionadaId,
    });
  }

  validarTelefone(): void {
    const original = normalizePhone(this.usuario.telefone);
    const current = normalizePhone(this.telefone);
    if (this.editMode && !this.telefone.trim() && !original) {
      this.phoneError = '';
      return;
    }
    if (!validPhone(this.telefone)) {
      this.phoneError = PHONE_ERROR;
      return;
    }
    this.phoneError = this.telefonesExistentes.some(user =>
      String(user.id) !== String(this.usuario.id) && normalizePhone(user.telefone) === current
    ) ? 'Este telefone já está em uso por outro usuário.' : '';
  }
}
