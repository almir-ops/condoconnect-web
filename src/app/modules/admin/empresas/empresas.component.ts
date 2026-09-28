import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CompaniesService } from '../../../shared/services/companies/companies.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CondominiosService } from '../../../shared/services/condominios/condominios.service';
import { ModalEmpresaComponent } from '../../../shared/components/modais/modal-empresa/modal-empresa.component';
import { AlertService } from '../../../shared/components/dialog/alert.service';
import { CompanyCardEditorComponent } from '../company-card-editor/company-card-editor.component';

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
    private dialog: MatDialog,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.getEmpresas();
    this.getCondominios();
  }

  getEmpresas() {
    this.empresaService.getAll().subscribe({
      next: (value: any) => {
        console.log('[EmpresasAdmin] Empresas carregadas', {
          total: Array.isArray(value) ? value.length : 0,
        });
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
        console.log('[EmpresasAdmin] Condomínios carregados', {
          total: Array.isArray(value) ? value.length : 0,
        });
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

  handleButtonClick = () => {
    const dialogRef = this.dialog.open(ModalEmpresaComponent, {
      width: '480px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adicionarEmpresa(result);
      }
    });
  };

  editarCard = (empresa: any) => {
    this.dialog.open(CompanyCardEditorComponent, {
      data: { id: Number(empresa.id) },
      width: '1120px',
      maxWidth: '96vw',
      maxHeight: '96dvh',
      ariaLabelledBy: 'card-editor-title',
      autoFocus: 'first-heading',
      disableClose: true,
    }).afterClosed().subscribe(result => {
      if (result) {
        this.alertService.presentAlert('Card atualizado', 'As alterações foram salvas com sucesso.');
        this.getEmpresas();
      }
    });
  };

  adicionarEmpresa(empresa: any) {
    this.empresaService.create(empresa).subscribe({
      next: () => {
        this.alertService.presentAlert('Muito bem!', 'Empresa cadastrada com sucesso.');
        this.getEmpresas();
      },
      error: (err: any) => {
        console.error('Erro ao cadastrar empresa:', err);

        if (err.status === 409) {
          this.alertService.presentAlert('Atenção', err.error?.detail ?? err.error?.message ?? 'Empresa já cadastrada.');
        } else if (err.status === 400 || err.status === 422) {
          this.alertService.presentAlert('Atenção', err.error?.message ?? 'Dados inválidos.');
        } else {
          this.alertService.presentAlert('Erro de Comunicação', 'Não foi possível cadastrar a empresa, tente novamente.');
        }
      },
    });
  }

  toggleEmpresaStatus(item: any) {
    const novoStatus = !item.ativo;
    const payload = {
      ativo: novoStatus,
      manual_activation: novoStatus,
    };

    this.empresaService.update(item.id, payload).subscribe({
      next: (empresaAtualizada: any) => {
        item.ativo = payload.ativo;
        item.status = empresaAtualizada?.status ?? item.status;
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

  totalEmpresas(): number {
    return this.data.length;
  }

  totalEmpresasAtivas(): number {
    return this.data.filter((empresa) => empresa?.ativo === true).length;
  }
}
