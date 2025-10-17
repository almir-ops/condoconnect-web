// pages/assinaturas/modal-editar-assinatura.component.ts
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { InscricaoService } from '../../../services/inscricao/plano.service';

@Component({
  standalone: true,
  selector: 'app-modal-editar-assinatura',
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './modal-editar-assinatura.component.html',
})
export class ModalEditarAssinaturaComponent {
  model: any = {};
  reconciliar = false;

  constructor(
    private ref: MatDialogRef<ModalEditarAssinaturaComponent>,
    private api: InscricaoService,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'edit' | 'create'; sub: any }
  ) {}

  ngOnInit() {
    if (this.data?.mode === 'edit' && this.data.sub) {
      const s = this.data.sub;
      this.model = {
        id: s.id,
        empresa_id: s.empresa_id,
        plano_id: s.plano_id,
        is_active: !!s.is_active,
        is_trial: !!s.is_trial,
        start_date: s.start_date ? this.toDateInput(s.start_date) : '',
        end_date: s.end_date ? this.toDateInput(s.end_date) : '',
        asaas_inscricao_id: s.asaas_inscricao_id ?? '',
      };
    } else {
      // criar novo (local)
      this.model = {
        empresa_id: '',
        plano_id: '',
        is_active: true,
        is_trial: false,
        start_date: this.today(),
        end_date: '',
        asaas_inscricao_id: '',
      };
    }
  }

  private toDateInput(value: string | Date) {
    return new Date(value).toISOString().slice(0, 10);
  }
  private today() {
    return new Date().toISOString().slice(0, 10);
  }

  close() {
    this.ref.close(false);
  }

  onSubmit() {
    if (this.data.mode === 'edit') {
      const payload: any = {
        is_active: !!this.model.is_active,
        is_trial: !!this.model.is_trial,
        start_date: this.model.start_date || undefined,
        end_date: this.model.end_date || undefined,
        asaas_inscricao_id: this.model.asaas_inscricao_id ?? null,
        reconciliar: !!this.reconciliar,
      };
      this.api.editar(this.model.id, payload).subscribe({
        next: () => this.ref.close(true),
      });
    } else {
      // criar novo local (se quiser manter fluxo simples; sua API de criar já aplica regras de trial/free/pago)
      const payload = {
        empresa_id: Number(this.model.empresa_id),
        usuario_id: 1, // ajuste conforme seu contexto/autenticado
        plano_id: Number(this.model.plano_id),
        use_trial: false, // ou true se quiser testar fluxo de trial
        cpf: undefined, // obrigatório para plano pago
      };
      this.api.criar(payload).subscribe({
        next: () => this.ref.close(true),
      });
    }
  }
}
