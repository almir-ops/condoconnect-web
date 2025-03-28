import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CepService } from '../../../services/cep/cep.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-modal-condominio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-condominio.component.html',
  styleUrl: './modal-condominio.component.scss'
})
export class ModalCondominioComponent {

  nome: string = '';
  email: string = '';
  telefone: string = '';
  endereco: string = '';
  numero: string = '';
  cidade: string = '';
  estado: string = '';
  cep: string = '';
  bairro: string = '';
  editMode: boolean = false;

  hiddenPassword: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ModalCondominioComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cepService: CepService,
    private ngZone: NgZone // Adiciona o NgZone

  ) {
    this.data = data || {}; // Garante que data nunca seja null ou undefined
    this.nome = this.data.nome ?? ''; // Usa ?? para tratar valores null e undefined
    this.email = this.data.email ?? '';
    this.editMode = this.data.editMode ?? false;
    console.log('Modal aberto!');

    this.dialogRef.afterClosed().subscribe(() => {
      console.log('Modal fechado!');
    });
  }

  fechar(): void {
    //this.dialogRef.close();
  }
  viewPassword(): void {
    this.hiddenPassword = !this.hiddenPassword;
  }

  salvar(): void {
    if (!this.nome || !this.endereco || !this.numero || !this.bairro || !this.cidade || !this.estado || !this.cep) {
      this._snackBar.open('Preencha todos os campos obrigatórios para prosseguir', '', {
        duration: 3000,
        panelClass:['error-snackbar']
      });
      return;
    }

    this.dialogRef.close({
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      endereco: this.endereco,
      numero: this.numero,
      bairro: this.bairro,
      cidade: this.cidade,
      estado: this.estado,
      cep: this.cep,
      editMode: this.editMode
    });
  }

  buscarEndereco(): void {
    console.log('🔍 Iniciando busca de endereço para CEP:', this.cep);

    try {
      if (this.cep.length === 8 || this.cep.length === 9) {
        this.cep = this.cep.replace('-', '');

        this.cepService.buscarCep(this.cep).subscribe({
          next: (dados: any) => {
            console.log('✅ Endereço encontrado:', dados);
            this.ngZone.run(() => {
              this.endereco = dados.logradouro;
              this.bairro = dados.bairro;
              this.cidade = dados.localidade;
              this.estado = dados.uf;
            });
          },
          error: (erro: any) => {
            console.error('❌ Erro ao buscar CEP:', erro);
            this.ngZone.run(() => {
              this._snackBar.open('Erro ao buscar o endereço!', '', { duration: 3000, panelClass: ['error-snackbar'] });
            });
          }
        });
      }
    } catch (error) {
      console.error('⚠️ Erro inesperado no buscarEndereco:', error);
      this._snackBar.open('Erro inesperado ao buscar endereço!', '', { duration: 3000, panelClass: ['error-snackbar'] });
    }
  }

}
