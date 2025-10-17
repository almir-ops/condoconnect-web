// pages/assinaturas/assinaturas.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ModalPagamentosComponent } from '../../../shared/components/modais/modal-pagamentos/modal-pagamentos.component';
import { InscricaoService } from '../../../shared/services/inscricao/plano.service';

@Component({
  selector: 'app-assinaturas',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, MatDialogModule],
  template: `
    <div class="px-[70px] pt-5 text-gray-700 w-full">
      <div class="w-full">
        <div>
          <div class="text-xl text-gray-700">Assinaturas</div>
          <div>Gerencie as inscrições/assinaturas das empresas</div>
        </div>

        <div class="mt-4">
          <app-table
            class="w-full"
            [columns]="columns"
            [data]="rows"
            [onCustomAction]="verPagamentos"
          ></app-table>
        </div>
      </div>
    </div>
  `,
})
export class AssinaturasComponent {
  // Nomes das colunas em PT-BR (MESMAS chaves usadas no mapRow)
  columns = [
    'ID',
    'Empresa',
    'Plano',
    'Situação do pagamento',
    'Status da assinatura',
    'Período de teste',
    'Término do ciclo',
  ];

  rows: any[] = [];

  constructor(private api: InscricaoService, private dialog: MatDialog) {}

  ngOnInit() {
    this.load();
  }

  private mapRow = (r: any) => ({
    // chaves em PT-BR para casar com "columns"
    ID: r.id,
    Empresa: r.empresa?.nome ?? `#${r.empresa_id}`,
    Plano: r.plano?.nome ?? `#${r.plano_id}`,
    'Situação do pagamento': r.isPaid ? 'Pago no ciclo' : 'Pendente',
    'Status da assinatura': r.is_active ? 'Ativa' : 'Inativa',
    'Período de teste': r.is_trial ? 'Sim' : 'Não',
    'Término do ciclo': r.end_date
      ? new Date(r.end_date).toISOString().slice(0, 10)
      : '—',

    // mantém o original para ações (ex.: Ver pagamentos)
    _orig: r,
  });

  load() {
    this.api.listar().subscribe({
      next: (subs) => (this.rows = (subs || []).map(this.mapRow)),
    });
  }

  verPagamentos = (row: any) => {
    const sub = row._orig;
    this.dialog.open(ModalPagamentosComponent, {
      width: '720px',
      data: {
        subId: sub.id,
        empresa: sub.empresa?.nome,
        plano: sub.plano?.nome,
      },
    });
  };
}
