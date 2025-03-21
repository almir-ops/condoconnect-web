import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../modal-usuario/modal-usuario.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material-module';

@Component({
  selector: 'app-modal-plano',
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule],
  templateUrl: './modal-plano.component.html',
  styleUrl: './modal-plano.component.scss'
})
export class ModalPlanoComponent {

  nome: string = '';
  pagamento_ciclo: string = '';
  descricao: string = '';
  valor: string = '';
  caracteresRestantes: number = 150;

  editMode: boolean = false;

  hiddenPassword: boolean = false;

  plano:any;

  constructor(
    public dialogRef: MatDialogRef<ModalPlanoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Dados recebidos no modal:', data);

    this.data = data || {}; // Garante que data nunca seja null ou undefined
    this.plano = this.data.plano || {}; // Garante que plano sempre tenha um objeto válido

    this.nome = this.plano.nome ?? ''; // Usa ?? para tratar valores null e undefined
    this.pagamento_ciclo = this.plano.pagamento_ciclo ?? 'WEEKLY';
    this.descricao = this.plano.descricao ?? '';
    this.valor = this.plano.valor ?? '';
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
      pagamento_ciclo: this.pagamento_ciclo,
      descricao: this.descricao,
      valor: this.valor,
      editMode: this.editMode
    });
  }

  update(): void {
    this.dialogRef.close({
      id:this.plano.id,
      nome: this.nome,
      pagamento_ciclo: this.pagamento_ciclo,
      descricao: this.descricao,
      valor: this.valor,
      editMode: this.editMode
    });
  }

  atualizarContagem(): void {
    this.caracteresRestantes = 150 - this.descricao.length;
  }
}
