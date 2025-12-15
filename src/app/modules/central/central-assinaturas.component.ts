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
  ANUAL = 'ANNUALLY',
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
    private dialog: MatDialog
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
    // ao trocar plano, limpa CPF/CNPJ se virou trial
    if (this.isPlanoPromocional(this.planoSelecionado)) {
      this.cpfCNPJ = '';
    }
  }

  syncEmpresaSelecionada() {
    this.empresaSelecionada = this.empresas.find(
      (e: any) => String(e?.id) === String(this.empresaSelecionadaId)
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
      // indícios possíveis (depende do retorno do backend)
      return (
        a?.status === 'TRIAL' ||
        a?.is_trial === true ||
        !!a?.trial_converted_at ||
        a?.empresa?.trial_used === true
      );
    });
  }

  /* =====================
     CRIAR ASSINATURA
     ===================== */

  // ✅ corrigido: respeita trial_enabled + trial_days
  isPlanoPromocional(plano: any): boolean {
    return plano?.trial_enabled === true && Number(plano?.trial_days ?? 0) > 0;
  }

  async criarAssinatura() {
    if (!this.planoSelecionado) return;

    if (!this.empresaSelecionadaId) {
      alert('Selecione uma empresa antes de continuar.');
      return;
    }

    const isPromo = this.isPlanoPromocional(this.planoSelecionado);

    // ✅ regra do usuário: não pode pegar trial se já tem/teve
    if (isPromo) {
      const active = this.getActiveTrial();
      if (active) {
        const ate = this.toISODate(active.end_date);
        alert(
          `Você já possui um período de teste ativo (até ${ate
            .split('-')
            .reverse()
            .join('/')}).`
        );
        return;
      }

      if (this.hasEverUsedTrial()) {
        alert(
          'Você já utilizou o período de teste anteriormente e não pode ativar outro.'
        );
        return;
      }
    }

    // se NÃO for promo/trial -> valida CPF/CNPJ
    if (!isPromo && !this.isValidCPFOrCNPJ(this.cpfCNPJ)) {
      alert('Informe um CPF ou CNPJ válido para assinar.');
      return;
    }

    const seguir = () => {
      this.creating = true;

      const req: any = {
        cpf: isPromo ? undefined : this.cpfCNPJ,
        plano_id: this.planoSelecionado.id,
        usuario_id: this.user?.id,
        empresa_id: this.empresaSelecionadaId,
        use_trial: isPromo,
      };

      this.inscricao.assinarPlano(req).subscribe({
        next: (value: any) => {
          this.creating = false;
          this.closeCreateModal();
          this.getAssinaturas();

          if (!isPromo && value?.paymentLink) {
            const w = window.open('', '_blank');
            if (w) w.location.href = value.paymentLink;
          }

          const msg = isPromo
            ? `Assinatura em período de teste criada com sucesso.`
            : `Assinatura criada com sucesso. Efetue o pagamento para ativação.`;

          alert(msg);
        },
        error: (err: any) => {
          this.creating = false;
          alert(err?.error?.error || 'Ocorreu um erro na assinatura.');
        },
      });
    };

    // mantém regra por empresa também (UX)
    if (isPromo) {
      this.inscricao.checkPromoUsada(this.empresaSelecionadaId).subscribe({
        next: (list: any[]) => {
          if (Array.isArray(list) && list.length > 0) {
            alert('Esta empresa já utilizou um plano em período de teste.');
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
    if (!value) return false;
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 11) return this.isValidCPF(cleaned);
    if (cleaned.length === 14) return this.isValidCNPJ(cleaned);
    return false;
  }

  isValidCPF(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);

    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;

    return remainder === parseInt(cpf[10]);
  }

  isValidCNPJ(cnpj: string): boolean {
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    let digits = cnpj.substring(size);

    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += Number(numbers[size - i]) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number(digits[0])) return false;

    size = size + 1;
    numbers = cnpj.substring(0, size);

    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += Number(numbers[size - i]) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result === Number(digits[1]);
  }
}
