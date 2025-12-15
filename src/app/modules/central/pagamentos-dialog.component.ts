import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { InscricaoService } from '../../shared/services/inscricao/plano.service';

@Component({
  selector: 'app-pagamentos-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  template: `
    <div class="p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-lg font-semibold text-gray-800">Pagamentos</div>
          <div class="text-sm text-gray-500">
            {{ data?.planoNome }} • {{ data?.empresaNome }}
          </div>
        </div>
        <button mat-icon-button (click)="ref.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider class="my-4"></mat-divider>

      <div *ngIf="loading" class="flex items-center gap-3 text-gray-600">
        <mat-progress-spinner
          diameter="22"
          mode="indeterminate"
        ></mat-progress-spinner>
        Carregando pagamentos...
      </div>

      <div *ngIf="!loading && !pagamentos.length" class="text-gray-600">
        Nenhum pagamento encontrado.
      </div>

      <div class="space-y-3" *ngIf="!loading && pagamentos.length">
        <div
          class="rounded-2xl border border-gray-200 p-4 flex items-center justify-between gap-3"
          *ngFor="let p of pagamentos"
        >
          <div>
            <div class="font-semibold text-gray-800">
              {{ p?.value || 0 | currency : 'BRL' : 'symbol' : '1.2-2' }}
              <span class="ml-2 text-sm" [ngClass]="statusClass(p?.status)">
                {{ p?.status }}
              </span>
            </div>
            <div class="text-sm text-gray-500">
              Vencimento: {{ p?.dueDate | date : 'dd/MM/yyyy' }}
            </div>
          </div>

          <button
            mat-raised-button
            color="primary"
            class="rounded-xl"
            *ngIf="p?.status === 'PENDING' || p?.status === 'OVERDUE'"
            (click)="pagar(p)"
          >
            <mat-icon class="mr-2">payments</mat-icon>
            Pagar
          </button>
        </div>
      </div>
    </div>
  `,
})
export class PagamentosDialogComponent {
  loading = true;
  pagamentos: any[] = [];

  constructor(
    public ref: MatDialogRef<PagamentosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private inscricao: InscricaoService
  ) {
    this.load();
  }

  load() {
    this.loading = true;
    this.inscricao
      .listarPagamentosPorAssinatura(this.data.assinaturaId)
      .subscribe({
        next: (v: any) => {
          this.pagamentos = Array.isArray(v) ? v : [];
          this.loading = false;
        },
        error: () => {
          this.pagamentos = [];
          this.loading = false;
        },
      });
  }

  pagar(p: any) {
    if (p?.paymentLink) window.open(p.paymentLink, '_blank');
  }

  statusClass(status: string) {
    if (status === 'CONFIRMED' || status === 'RECEIVED') return 'text-success';
    if (status === 'PENDING') return 'text-amber-600';
    if (status === 'OVERDUE') return 'text-orange-600';
    if (status === 'CANCELED') return 'text-red-600';
    return 'text-gray-600';
  }
}
