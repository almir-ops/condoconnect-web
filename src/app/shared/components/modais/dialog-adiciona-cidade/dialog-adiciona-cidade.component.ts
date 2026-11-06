import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../material-module';

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

@Component({
  standalone: true,
  imports: [MaterialModule,CommonModule,FormsModule],
  selector: 'app-dialog-adiciona-cidade',
  templateUrl: './dialog-adiciona-cidade.component.html',
  styleUrl: './dialog-adiciona-cidade.component.scss'

})
export class DialogAdicionaCidadeComponent implements OnInit {
  readonly estados = UFS;
  estado = 'SP';
  nomeCidade = '';
  municipios: string[] = [];
  carregando = false;
  erroLista = false;

  private existentes = new Set<string>();

  constructor(
    public dialogRef: MatDialogRef<DialogAdicionaCidadeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { existentes?: string[] } | null
  ) {
    (data?.existentes ?? []).forEach(nome => this.existentes.add(normalize(nome)));
  }

  ngOnInit(): void {
    void this.carregarMunicipios();
  }

  get jaCadastrada(): boolean {
    return !!this.nomeCidade && this.existentes.has(normalize(this.nomeCidade));
  }

  jaExiste(nome: string): boolean {
    return this.existentes.has(normalize(nome));
  }

  // fetch (e não HttpClient) para o interceptor não mandar o token do usuário ao IBGE
  async carregarMunicipios(): Promise<void> {
    const uf = this.estado;
    this.nomeCidade = '';
    this.municipios = [];
    this.erroLista = false;
    this.carregando = true;
    try {
      const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
      if (!res.ok) throw new Error(String(res.status));
      const lista: { nome: string }[] = await res.json();
      if (uf === this.estado) this.municipios = lista.map(m => m.nome);
    } catch {
      if (uf === this.estado) this.erroLista = true;
    } finally {
      if (uf === this.estado) this.carregando = false;
    }
  }

  fecharDialog(): void {
    this.dialogRef.close();
  }

  adicionarCidade(): void {
    if (!this.nomeCidade) {
      alert('Selecione uma cidade');
      return;
    }
    if (this.jaCadastrada) {
      alert(`A cidade ${this.nomeCidade} já está cadastrada.`);
      return;
    }
    this.dialogRef.close(this.nomeCidade);
  }
}
