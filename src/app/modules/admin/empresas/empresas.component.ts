import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompaniesService } from '../../../shared/services/companies/companies.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CondominiosService } from '../../../shared/services/condominios/condominios.service';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss',
})
export class EmpresasComponent {
  columns = [
    'nome',
    'telefone',
    'condominios',
    'email',
    'usuario',
    'ativo',
    'trocar_condominio',
  ];

  data: any[] = [];
  condominios: any[] = [];

  dialogTrocarCondominioAberto = false;
  empresaSelecionada: any = null;
  condominioSelecionadoId: number | null = null;

  salvandoTroca = false;

  constructor(
    private empresaService: CompaniesService,
    private condominioService: CondominiosService,
  ) {}

  ngOnInit(): void {
    this.getEmpresas();
    this.getCondominios();
  }

  getEmpresas() {
    this.empresaService.getAll().subscribe({
      next: (value: any) => {
        console.log(value);
        this.data = Array.isArray(value) ? value : [];
      },
      error: (err) => {
        console.error('Erro ao buscar empresas:', err);
      },
    });
  }

  getCondominios() {
    this.condominioService.getAllEstablishments().subscribe({
      next: (value: any) => {
        console.log('Condomínios:', value);
        this.condominios = Array.isArray(value) ? value : [];
      },
      error: (err) => {
        console.error('Erro ao buscar condomínios:', err);
      },
    });
  }

  abrirDialogTrocarCondominio(empresa: any) {
    this.empresaSelecionada = empresa;

    const condominioAtual = empresa?.condominios?.length
      ? empresa.condominios[0]
      : null;

    this.condominioSelecionadoId = condominioAtual?.id || null;

    this.dialogTrocarCondominioAberto = true;
  }

  fecharDialogTrocarCondominio() {
    this.dialogTrocarCondominioAberto = false;
    this.empresaSelecionada = null;
    this.condominioSelecionadoId = null;
    this.salvandoTroca = false;
  }

  salvarTrocaCondominio() {
    if (!this.empresaSelecionada?.id || !this.condominioSelecionadoId) {
      alert('Selecione um condomínio.');
      return;
    }

    this.salvandoTroca = true;

    this.empresaService
      .trocarCondominioEmpresa(
        Number(this.empresaSelecionada.id),
        Number(this.condominioSelecionadoId),
      )
      .subscribe({
        next: () => {
          alert('Condomínio alterado com sucesso.');

          this.fecharDialogTrocarCondominio();
          this.getEmpresas();
        },
        error: (err) => {
          console.error('Erro ao trocar condomínio:', err);
          alert('Erro ao trocar condomínio da empresa.');
          this.salvandoTroca = false;
        },
      });
  }

  handleButtonClick() {
    console.log('Botão clicado! Executando ação externa...');
  }

  toggleEmpresaStatus(item: any) {
    const payload = {
      ...item,
      ativo: !item.ativo,
    };

    this.empresaService.update(item.id, payload).subscribe({
      next: () => {
        item.ativo = payload.ativo;
      },
      error: (err) => {
        console.error('Erro ao alterar status da empresa:', err);
        alert('Erro ao alterar status da empresa.');
      },
    });
  }

  getStatusLabel(ativo: boolean): string {
    return ativo ? 'Ativa' : 'Inativa';
  }
}
