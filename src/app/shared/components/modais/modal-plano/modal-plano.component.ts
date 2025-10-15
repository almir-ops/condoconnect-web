import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Ciclo = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'YEARLY';
function toCiclo(v: any): Ciclo {
  const c = String(v ?? 'MONTHLY').toUpperCase();
  return (['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'YEARLY'] as const).includes(
    c as Ciclo
  )
    ? (c as Ciclo)
    : 'MONTHLY';
}

@Component({
  selector: 'app-modal-plano',
  standalone: true, // <<<<<<<<<<
  imports: [CommonModule, FormsModule], // <<<<<<
  templateUrl: './modal-plano.component.html',
})
export class ModalPlanoComponent {
  id?: number;
  nome = '';
  valor: number | null = null;
  pagamento_ciclo: Ciclo = 'MONTHLY';
  descricao = '';
  trial_enabled = false;
  trial_days: number | null = null;

  editMode = false;
  caracteresRestantes = 150;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalPlanoComponent>
  ) {
    const plano = data?.plano;
    this.editMode = !!data?.editMode;

    if (plano) {
      this.id = plano.id;
      this.nome = plano.nome ?? '';
      this.valor = Number(plano.valor ?? 0);
      this.pagamento_ciclo = toCiclo(plano.pagamento_ciclo);
      this.descricao = plano.descricao ?? '';
      this.trial_enabled = !!plano.trial_enabled;
      this.trial_days =
        typeof plano.trial_days === 'number'
          ? plano.trial_days
          : plano.trial_days
          ? Number(plano.trial_days)
          : null;

      this.atualizarContagem();
    }
  }

  atualizarContagem() {
    const used = (this.descricao || '').length;
    this.caracteresRestantes = Math.max(0, 150 - used);
    if (this.descricao && this.descricao.length > 150) {
      this.descricao = this.descricao.slice(0, 150);
    }
  }

  fechar() {
    this.dialogRef.close(null);
  }

  private validate(): string | null {
    if (!this.nome?.trim()) return 'Informe o nome do plano.';
    if (
      this.valor === null ||
      isNaN(Number(this.valor)) ||
      Number(this.valor) < 0
    )
      return 'Informe um valor válido.';
    if (!this.pagamento_ciclo) return 'Selecione o ciclo de pagamento.';
    if (this.trial_enabled) {
      const dias = Number(this.trial_days);
      if (!dias || dias < 1) return 'Informe os dias de trial (≥ 1).';
    }
    return null;
  }

  private buildPayload() {
    return {
      ...(this.id ? { id: this.id } : {}),
      nome: this.nome.trim(),
      valor: Number(this.valor),
      pagamento_ciclo: this.pagamento_ciclo,
      descricao: (this.descricao || '').trim(),
      trial_enabled: !!this.trial_enabled,
      trial_days: this.trial_enabled ? Number(this.trial_days) : 0,
    };
  }

  salvar() {
    const err = this.validate();
    if (err) {
      alert(err);
      return;
    }
    this.dialogRef.close(this.buildPayload());
  }

  update() {
    this.salvar();
  }
}
