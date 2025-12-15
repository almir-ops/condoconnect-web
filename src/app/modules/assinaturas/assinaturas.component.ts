import { CommonModule, Location } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
  ViewChild,
  TemplateRef,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { PlanoService } from '../../shared/services/planos/plano.service';
import { CompaniesService } from '../../shared/services/companies/companies.service';
import { InscricaoService } from '../../shared/services/inscricao/plano.service';
import { AlertService } from '../../shared/components/dialog/alert.service';
import { SwiperComponent } from '../../shared/components/swiper/swiper.component';

export enum PagamentoCiclo {
  UNICO = 'UNIQUE',
  SEMANAL = 'WEEKLY',
  QUINZENAL = 'BIWEEKLY',
  MENSAL = 'MONTHLY',
  BIMESTRAL = 'BIMONTHLY',
  TRIMESTRAL = 'QUARTERLY',
  SEMESTRAL = 'SEMIANNUALLY',
  ANUAL = 'ANNUALLY',
}

export enum PagamentoStatus {
  Pendente = 'PENDING',
  Recebido = 'RECEIVED',
  Confirmado = 'CONFIRMED',
  Atrasado = 'OVERDUE',
  Cancelado = 'CANCELED',
  Estornado = 'REFUNDED',
  EmProcessamento = 'PROCESSING',
  Autorizado = 'AUTHORIZED',
  Rejeitado = 'REJECTED',
  Disputa = 'CHARGEBACK',
  Expirado = 'EXPIRED',
}

@Component({
  selector: 'app-assinaturas',
  standalone: true,
  templateUrl: './assinaturas.component.html',
  styleUrls: ['./assinaturas.component.scss'],
  imports: [CommonModule, FormsModule, MatDialogModule, SwiperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AssinaturasComponent implements OnInit {
  planos: any[] = [];
  assinaturas: any[] = [];
  empresas: any[] = [];

  planoSelecionado!: any;
  empresaSelecionado!: any;

  @Input() swiperContainerId = '';

  // vindo do payload
  userId: number | null = null;
  authToken: string | null = null;
  user: any; // se quiser ter o user aqui depois

  ciclos = Object.values(PagamentoCiclo);
  cicloSelecionado: PagamentoCiclo = PagamentoCiclo.MENSAL;
  cpfCNPJ: any;

  assinaturaSelecionada: any;
  pagamentos: any;

  @ViewChild('dialogAssinar', { static: false })
  dialogAssinar!: TemplateRef<any>;
  @ViewChild('dialogAssinaturaOpcoes', { static: false })
  dialogAssinaturaOpcoes!: TemplateRef<any>;
  @ViewChild('dialogCancelaAssinatura', { static: false })
  dialogCancelaAssinatura!: TemplateRef<any>;

  private dialogRefAssinar?: MatDialogRef<any>;
  private dialogRefAssinaturaOpcoes?: MatDialogRef<any>;
  private dialogRefCancelaAssinatura?: MatDialogRef<any>;

  constructor(
    private location: Location,
    private planosService: PlanoService,
    private companyService: CompaniesService,
    private inscricaoService: InscricaoService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.lerParametrosDaUrl();
    if (!this.userId) {
      this.alertService.presentAlert(
        'Atenção',
        'Não foi possível identificar o usuário. Acesse este painel através do aplicativo.'
      );
      return;
    }

    this.getPlanos();
    this.getCompanys();
    this.getAssinaturas();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const shadowRoot = document
        .getElementById(this.swiperContainerId)
        ?.getElementsByClassName('swiper')[0]?.shadowRoot
        ?.firstChild as HTMLElement;
      // se você precisar mexer no shadowRoot, faz aqui
    }, 300);
  }

  // ======================
  //   URL / AUTH
  // ======================

  private lerParametrosDaUrl() {
    const params = new URLSearchParams(window.location.search);

    const payloadParam = params.get('payload');
    if (!payloadParam) {
      console.warn('Nenhum payload encontrado na URL');
      return;
    }

    try {
      const decoded = atob(payloadParam); // mesmo encode que fizemos no app
      const payload = JSON.parse(decoded) as {
        userId?: number;
        token?: string;
      };

      if (payload.userId) {
        this.userId = payload.userId;
      }

      if (payload.token) {
        this.authToken = payload.token;
        // guarda no localStorage com a mesma chave do app / interceptor
        localStorage.setItem('auth_token', payload.token);
      }
    } catch (e) {
      console.error('Erro ao decodificar payload da URL:', e);
    }
  }

  // ======================
  //   CARREGAR DADOS
  // ======================

  getPlanos() {
    this.planosService.getAllPlanos().subscribe((data: any) => {
      this.planos = data;
      console.log(this.planos);
    });
  }

  getCompanys() {
    if (!this.userId) return;
    const query = '?user_id=' + this.userId;
    this.companyService.getByFilter(query).subscribe({
      next: (value: any) => {
        console.log(value);
        this.empresas = value;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  getAssinaturas() {
    if (!this.userId) return;
    const query = '?usuario_id=' + this.userId;
    this.inscricaoService.listarAssinaturas(query).subscribe({
      next: (value: any) => {
        console.log(value);
        this.assinaturas = value;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  // ======================
  //   HELPERS / SELECTS
  // ======================

  getCicloTexto(ciclo: string): string {
    const cicloEncontrado = Object.entries(PagamentoCiclo).find(
      ([, value]) => value === ciclo
    );
    return cicloEncontrado ? cicloEncontrado[0] : 'Desconhecido';
  }

  onEmpresaSelect(event: any) {
    const selectedOptions = event.target.selectedOptions;
    if (selectedOptions.length > 0) {
      const selectedId = selectedOptions[0].value;
      this.empresaSelecionado = this.empresas.find(
        (company: any) => String(company.id) === selectedId
      );
    }
  }

  back() {
    this.location.back();
  }

  // ======================
  //   MATDIALOG - ASSINAR PLANO
  // ======================

  abrirModalAssinar() {
    if (this.empresas.length === 0) {
      this.alertService.presentAlert(
        'Atenção',
        'Você não possui empresas cadastradas.'
      );
      return;
    }

    this.planoSelecionado = null;
    this.cpfCNPJ = '';
    this.empresaSelecionado = null;

    this.dialogRefAssinar = this.dialog.open(this.dialogAssinar, {
      panelClass: 'custom-modal-assina',
    });
  }

  fecharModalAssinar() {
    this.dialogRefAssinar?.close();
  }

  assina(plano: any) {
    this.planoSelecionado = plano;
  }

  enviaSolicitacaoCondo() {
    if (!this.empresaSelecionado) {
      this.alertService.presentAlert(
        'Atenção',
        'Selecione uma empresa antes de continuar.'
      );
      return;
    }

    const isPromo = this.isPlanoPromocional(this.planoSelecionado);

    const seguirAssinando = () => {
      if (!isPromo && !this.isValidCPFOrCNPJ(this.cpfCNPJ)) {
        this.alertService.presentAlert(
          'Atenção',
          'Informe um CPF ou CNPJ válido para assinar.'
        );
        return;
      }

      const req = {
        cpf: isPromo ? undefined : this.cpfCNPJ,
        plano_id: this.planoSelecionado.id,
        usuario_id: this.userId, // veio do payload
        empresa_id: this.empresaSelecionado.id,
        use_trial: isPromo,
      };

      this.inscricaoService.assinarPlano(req).subscribe({
        next: (value: any) => {
          this.fecharModalAssinar();
          this.getAssinaturas();

          if (!isPromo && value?.paymentLink) {
            const novaJanela = window.open('', '_blank');
            if (novaJanela) novaJanela.location.href = value.paymentLink;
          }

          const msg = isPromo
            ? `Sua assinatura em período de teste foi criada com sucesso.
O primeiro pagamento será gerado de acordo com o período de teste de ${this.planoSelecionado?.trial_days} dias.`
            : 'Assinatura criada com sucesso, efetue o pagamento para ativação.';

          this.alertService.presentAlert('Atenção', msg);
        },
        error: (err: any) => {
          this.alertService.presentAlert(
            'Atenção',
            err.error?.error || 'Ocorreu um erro na assinatura.'
          );
        },
      });
    };

    if (isPromo) {
      this.inscricaoService
        .checkPromoUsada(this.empresaSelecionado.id)
        .subscribe({
          next: (list: any[]) => {
            if (Array.isArray(list) && list.length > 0) {
              this.alertService.presentAlert(
                'Atenção',
                'Esta empresa já utilizou um plano em período de teste.'
              );
              return;
            }
            seguirAssinando();
          },
          error: () => {
            this.alertService.presentAlert(
              'Atenção',
              'Não foi possível validar o uso do plano de teste. Tente novamente mais tarde.'
            );
          },
        });
    } else {
      seguirAssinando();
    }
  }

  // ======================
  //   MATDIALOG - OPÇÕES ASSINATURA
  // ======================

  openModalOptions(assinatura: any) {
    if (assinatura.status === 'INACTIVE') {
      this.alertService.presentAlert('Atenção', 'Assinatura cancelada.');
      return;
    }

    this.assinaturaSelecionada = assinatura;
    this.inscricaoService
      .listarPagamentosPorAssinatura(assinatura.id)
      .subscribe({
        next: (value: any) => {
          console.log(value);
          this.pagamentos = value;
          this.dialogRefAssinaturaOpcoes = this.dialog.open(
            this.dialogAssinaturaOpcoes,
            {
              panelClass: 'custom-modal-opcoes',
            }
          );
        },
        error: () => {
          this.alertService.presentAlert(
            'Atenção',
            'Ocorreu um erro para buscar informacões da assinatura.'
          );
        },
      });
  }

  fecharModalAssinaturaOpcoes() {
    this.dialogRefAssinaturaOpcoes?.close();
  }

  abrirModalCancelaAssinatura() {
    this.dialogRefAssinaturaOpcoes?.close();
    this.dialogRefCancelaAssinatura = this.dialog.open(
      this.dialogCancelaAssinatura,
      {
        panelClass: 'custom-modal-excluir',
      }
    );
  }

  fecharModalCancelaAssinatura() {
    this.dialogRefCancelaAssinatura?.close();
  }

  // ======================
  //   CANCELAR ASSINATURA
  // ======================

  cancelarAssinatura() {
    console.log(this.assinaturaSelecionada);
    this.inscricaoService
      .cancelarAssinatura(this.assinaturaSelecionada.id)
      .subscribe({
        next: () => {
          this.alertService.presentAlert(
            'Atenção',
            'Assinatura cancelada com sucesso.'
          );
          this.getAssinaturas();
          this.fecharModalCancelaAssinatura();
        },
        error: () => {
          this.alertService.presentAlert(
            'Atenção',
            'Ocorreu um erro para cancelar a assinatura.'
          );
        },
      });
  }

  // ======================
  //   PAGAMENTO
  // ======================

  getStatus(ciclo: string): string {
    if (
      ciclo === PagamentoStatus.Recebido ||
      ciclo === PagamentoStatus.Confirmado
    ) {
      return 'Pago';
    }

    const cicloEncontrado = Object.entries(PagamentoStatus).find(
      ([, value]) => value === ciclo
    );

    return cicloEncontrado ? cicloEncontrado[0] : 'Desconhecido';
  }

  fazerPagamento(pagamnto: any) {
    window.open(pagamnto.paymentLink, '_blank');
  }

  // ======================
  //   VALIDADORES CPF/CNPJ
  // ======================

  isValidCPFOrCNPJ(value: string): boolean {
    if (!value) return false;

    const cleanedValue = value.replace(/\D/g, '');

    if (cleanedValue.length === 11) {
      return this.isValidCPF(cleanedValue);
    } else if (cleanedValue.length === 14) {
      return this.isValidCNPJ(cleanedValue);
    }

    return false;
  }

  isValidCPF(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0,
      remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf[i - 1]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf[i - 1]) * (12 - i);
    }
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

  // ======================
  //   DATAS / TRIAL
  // ======================

  private addDays(base: Date, days: number): Date {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
  }

  private addMonths(base: Date, months: number): Date {
    const d = new Date(base);
    const day = d.getDate();
    d.setMonth(d.getMonth() + months);
    if (d.getDate() < day) d.setDate(0);
    return d;
  }

  private cycleToDuration(cycle: string): { days?: number; months?: number } {
    const c = String(cycle || '').toUpperCase();
    switch (c) {
      case 'WEEKLY':
        return { days: 7 };
      case 'BIWEEKLY':
        return { days: 14 };
      case 'MONTHLY':
        return { months: 1 };
      case 'BIMONTHLY':
        return { months: 2 };
      case 'QUARTERLY':
        return { months: 3 };
      case 'SEMIANNUALLY':
        return { months: 6 };
      case 'ANNUALLY':
      case 'YEARLY':
        return { months: 12 };
      case 'UNIQUE':
      case 'UNICO':
        return { months: 0 };
      default:
        return { months: 1 };
    }
  }

  getEndDateFromStartAndCycle(startISO: string | Date, cycle: string): Date {
    const start = new Date(startISO);
    const dur = this.cycleToDuration(cycle);
    if (dur.days) return this.addDays(start, dur.days);
    if (typeof dur.months === 'number')
      return this.addMonths(start, dur.months);
    return this.addMonths(start, 1);
  }

  previewPromoEndDate(): Date | null {
    if (
      !this.planoSelecionado ||
      !this.isPlanoPromocional(this.planoSelecionado)
    ) {
      return null;
    }
    return this.getEndDateFromStartAndCycle(
      new Date(),
      this.planoSelecionado.pagamento_ciclo
    );
  }

  onAssinaturaClick(assinatura: any) {
    if (
      assinatura?.status === 'FREE' ||
      this.isPlanoPromocional(assinatura?.plano)
    ) {
      return;
    }
    this.openModalOptions(assinatura);
  }

  isPlanoPromocional(plano: any): boolean {
    return !!plano?.trial_days && Number(plano.trial_days) > 0;
  }

  getFreeEndDate(assinatura: any): Date | null {
    if (!assinatura?.plano) return null;
    if (!this.isPlanoPromocional(assinatura.plano)) return null;
    return this.getEndDateFromStartAndCycle(
      assinatura.start_date,
      assinatura.plano.pagamento_ciclo
    );
  }
}
