import { validDocument, validEmail } from '../../shared/utils/validation';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { InscricaoService } from '../../shared/services/inscricao/plano.service';
import { CentralAuthService } from '../../shared/services/auth/central-auth.service';
import { PagamentosDialogComponent } from './pagamentos-dialog.component';

import { CompaniesService } from '../../shared/services/companies/companies.service';
import { PlanoService } from '../../shared/services/planos/plano.service';

enum PagamentoCiclo {
  UNICO = 'UNIQUE',
  SEMANAL = 'WEEKLY',
  QUINZENAL = 'BIWEEKLY',
  MENSAL = 'MONTHLY',
  BIMESTRAL = 'BIMONTHLY',
  TRIMESTRAL = 'QUARTERLY',
  SEMESTRAL = 'SEMIANNUALLY',
  ANUAL = 'YEARLY',
}

@Component({
  selector: 'app-central-assinaturas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './central-assinaturas.component.html',
})
export class CentralAssinaturasComponent {
  @ViewChild('planScroller', { static: false })
  planScroller?: ElementRef<HTMLDivElement>;

  loading = true;
  creating = false;

  assinaturas: any[] = [];
  planos: any[] = [];
  empresas: any[] = [];

  user: any;

  // modal create
  createOpen = false;
  planoSelecionado: any = null;

  empresaSelecionadaId: any = '';
  empresaSelecionada: any = null;

  cpfCNPJ = '';

  constructor(
    private inscricao: InscricaoService,
    private planosService: PlanoService,
    private companyService: CompaniesService,
    private auth: CentralAuthService,
    private dialog: MatDialog,
  ) {
    this.user = this.auth.getUser();
    this.load();
  }

  /* =====================
     LOAD
     ===================== */
  load() {
    this.loading = true;
    this.getAssinaturas();
    this.getPlanos();
    this.getEmpresas();
  }

  getAssinaturas() {
    const query = '?usuario_id=' + (this.user?.id ?? '');
    this.inscricao.listarAssinaturas(query).subscribe({
      next: (value: any) => {
        this.assinaturas = Array.isArray(value) ? value : [];
        this.loading = false;
      },
      error: () => {
        this.assinaturas = [];
        this.loading = false;
      },
    });
  }

  getPlanos() {
    this.planosService.getAllPlanos().subscribe({
      next: (data: any) => (this.planos = Array.isArray(data) ? data : []),
      error: () => (this.planos = []),
    });
  }

  getEmpresas() {
    const query = '?user_id=' + (this.user?.id ?? '');
    this.companyService.getByFilter(query).subscribe({
      next: (value: any) => (this.empresas = Array.isArray(value) ? value : []),
      error: () => (this.empresas = []),
    });
  }

  /* =====================
     UI HELPERS
     ===================== */
  openCreateModal() {
    this.createOpen = true;
    this.planoSelecionado = null;
    this.empresaSelecionadaId = '';
    this.empresaSelecionada = null;
    this.cpfCNPJ = '';
  }

  closeCreateModal() {
    this.createOpen = false;
  }

  scrollPlans(dir: 1 | -1) {
    const el = this.planScroller?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: dir * 260, behavior: 'smooth' });
  }

  selectPlano(p: any) {
    this.planoSelecionado = p;

    if (this.isTrialDisponivel(this.planoSelecionado)) {
      this.cpfCNPJ = '';
    }
  }

  syncEmpresaSelecionada() {
    this.empresaSelecionada = this.empresas.find(
      (e: any) => String(e?.id) === String(this.empresaSelecionadaId),
    );
  }

  getCicloTexto(ciclo: string): string {
    const found = Object.entries(PagamentoCiclo).find(([, v]) => v === ciclo);
    return found ? found[0] : 'Desconhecido';
  }

  badgeText(a: any) {
    if (a?.status === 'INACTIVE') return 'Cancelada';
    if (a?.status === 'TRIAL') return 'Período de teste';
    if (a?.status === 'FREE') return 'Grátis';
    if (a?.status === 'DESCONHECIDO') return 'Cancelada';
    return a?.isPaid ? 'Pagamento em dia' : 'Pagamento pendente';
  }

  badgeClass(a: any) {
    if (a?.status === 'INACTIVE' || a?.status === 'DESCONHECIDO')
      return 'bg-red-100 text-red-700';
    if (a?.status === 'TRIAL') return 'bg-amber-100 text-amber-800';
    if (a?.status === 'FREE') return 'bg-emerald-100 text-emerald-800';
    return a?.isPaid
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-red-100 text-red-700';
  }

  /* =====================
     AÇÕES: PAGAMENTOS/CANCELAR
     ===================== */
  openPagamentos(assinatura: any) {
    this.dialog.open(PagamentosDialogComponent, {
      width: '720px',
      maxWidth: '95vw',
      data: {
        assinaturaId: assinatura?.id,
        empresaNome: assinatura?.empresa?.nome,
        planoNome: assinatura?.plano?.nome,
      },
    });
  }

  cancelar(assinatura: any) {
    const ok = confirm('Deseja realmente cancelar a assinatura?');
    if (!ok) return;

    this.inscricao.cancelarAssinatura(assinatura.id).subscribe({
      next: () => {
        alert('Assinatura cancelada com sucesso.');
        this.getAssinaturas();
      },
      error: () => alert('Erro ao cancelar assinatura.'),
    });
  }

  /* =====================
     TRIAL RULES (FRONT)
     - usuário não pode pegar novo trial se:
       a) já tem trial ATIVO
       b) já usou trial antes (qualquer indício)
     ===================== */

  private todayISO(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private toISODate(d: any): string {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '';
    return dt.toISOString().slice(0, 10);
  }

  async criarAssinatura() {
    if (!this.planoSelecionado) return;

    if (!this.empresaSelecionadaId) {
      alert('Selecione uma empresa antes de continuar.');
      return;
    }

    const planoTemTrial = this.isPlanoPromocional(this.planoSelecionado);
    const useTrial = this.getUseTrial(this.planoSelecionado);

    if (!useTrial && !this.isValidCPFOrCNPJ(this.cpfCNPJ)) {
      alert('Informe um CPF ou CNPJ válido para assinar.');
      return;
    }

    const seguir = () => {
      this.creating = true;

      const req: any = {
        cpf: useTrial ? undefined : this.cpfCNPJ,
        plano_id: this.planoSelecionado.id,
        usuario_id: this.user?.id,
        empresa_id: this.empresaSelecionadaId,
        use_trial: useTrial,
      };

      this.inscricao.assinarPlano(req).subscribe({
        next: (value: any) => {
          this.creating = false;
          this.closeCreateModal();
          this.getAssinaturas();

          if (!useTrial && value?.paymentLink) {
            const w = window.open('', '_blank');
            if (w) w.location.href = value.paymentLink;
          }

          const msg = useTrial
            ? 'Assinatura em período de teste criada com sucesso.'
            : 'Assinatura criada com sucesso. Efetue o pagamento para ativação.';

          alert(msg);
        },
        error: (err: any) => {
          this.creating = false;
          alert(err?.error?.error || 'Ocorreu um erro na assinatura.');
        },
      });
    };

    // Só valida promo já usada por empresa se ainda houver chance de usar trial
    if (planoTemTrial && useTrial) {
      this.inscricao.checkPromoUsada(this.empresaSelecionadaId).subscribe({
        next: (list: any[]) => {
          if (Array.isArray(list) && list.length > 0) {
            // empresa já usou trial => segue assinatura normal
            if (!this.isValidCPFOrCNPJ(this.cpfCNPJ)) {
              alert(
                'Esta empresa já utilizou o período de teste. Informe um CPF ou CNPJ válido para seguir com a assinatura normal.',
              );
              return;
            }

            this.creating = true;

            const req: any = {
              cpf: this.cpfCNPJ,
              plano_id: this.planoSelecionado.id,
              usuario_id: this.user?.id,
              empresa_id: this.empresaSelecionadaId,
              use_trial: false,
            };

            this.inscricao.assinarPlano(req).subscribe({
              next: (value: any) => {
                this.creating = false;
                this.closeCreateModal();
                this.getAssinaturas();

                if (value?.paymentLink) {
                  const w = window.open('', '_blank');
                  if (w) w.location.href = value.paymentLink;
                }

                alert(
                  'Esta empresa já utilizou o período de teste. A assinatura foi criada no modo normal.',
                );
              },
              error: (err: any) => {
                this.creating = false;
                alert(err?.error?.error || 'Ocorreu um erro na assinatura.');
              },
            });

            return;
          }

          seguir();
        },
        error: () => alert('Não foi possível validar o uso do plano de teste.'),
      });
    } else {
      seguir();
    }
  }

  /* =====================
     VALIDADORES CPF/CNPJ
     ===================== */
  isValidCPFOrCNPJ(value: string): boolean {
    return validDocument(value);
  }

  isValidCPF(cpf: string): boolean {
    return validDocument(cpf);
  }

  isValidCNPJ(cnpj: string): boolean {
    return validDocument(cnpj);
  }

  private getActiveTrial(): any | null {
    const hoje = this.todayISO();
    return (
      (this.assinaturas || []).find((a: any) => {
        const isTrial = a?.status === 'TRIAL' || a?.is_trial === true;
        const endISO = this.toISODate(a?.end_date);
        return isTrial && endISO && endISO >= hoje;
      }) || null
    );
  }

  private hasEverUsedTrial(): boolean {
    return (this.assinaturas || []).some((a: any) => {
      return (
        a?.status === 'TRIAL' ||
        a?.is_trial === true ||
        !!a?.trial_converted_at ||
        a?.empresa?.trial_used === true
      );
    });
  }

  isPlanoPromocional(plano: any): boolean {
    return plano?.trial_enabled === true && Number(plano?.trial_days ?? 0) > 0;
  }

  isTrialDisponivel(plano: any): boolean {
    if (!this.isPlanoPromocional(plano)) return false;

    const active = this.getActiveTrial();
    if (active) return false;

    if (this.hasEverUsedTrial()) return false;

    return true;
  }

  deveExibirCpfCnpj(): boolean {
    if (!this.planoSelecionado) return false;
    return !this.isTrialDisponivel(this.planoSelecionado);
  }

  getUseTrial(plano: any): boolean {
    return this.isTrialDisponivel(plano);
  }

  getStatusTexto(status: string): string {
    const s = String(status || '').toUpperCase();

    switch (s) {
      case 'TRIAL':
        return 'Período de teste';

      case 'FREE':
        return 'Grátis';

      case 'INACTIVE':
        return 'Inativa';

      case 'ACTIVE':
        return 'Ativa';

      case 'PENDING_PAYMENT':
        return 'Pagamento pendente';

      case 'PENDING':
        return 'Pendente';

      case 'OVERDUE':
        return 'Vencida';

      case 'RECEIVED':
        return 'Recebido';

      case 'CONFIRMED':
        return 'Confirmado';

      case 'RECEIVED_IN_CASH':
        return 'Recebido em dinheiro';

      case 'REFUNDED':
        return 'Reembolsado';

      case 'CANCELED':
        return 'Cancelada';

      case 'CANCELLED':
        return 'Cancelada';

      case 'DESCONHECIDO':
        return 'Desconhecido';

      default:
        return status || 'Desconhecido';
    }
  }
}
