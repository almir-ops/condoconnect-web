// planos.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../shared/components/table/table.component';
import { PlanoService } from '../../../shared/services/planos/plano.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalPlanoComponent } from '../../../shared/components/modais/modal-plano/modal-plano.component';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [TableComponent, FormsModule, CommonModule],
  templateUrl: './assinaturas.component.html',
  styleUrl: './assinaturas.component.scss',
})
export class AssinaturasComponent {
  // 👇 acrescente uma coluna "trial"
  columns = ['nome', 'valor', 'descricao', 'trial', 'createdAt'];
  data: any[] = [];
  plano: any;

  constructor(private planoService: PlanoService, private dialog: MatDialog) {}

  ngOnInit() {
    this.getPlanos();
  }

  getPlanos() {
    this.planoService.getAllPlanos().subscribe({
      next: (planos: any[]) => {
        // mapeia campo "trial" derivado de trial_enabled + trial_days
        this.data = (planos || []).map((p) => ({
          ...p,
          trial: p.trial_enabled ? `Sim (${p.trial_days} dias)` : 'Não',
        }));
      },
    });
  }

  handleButtonClick = () => {
    this.abrirModalAdicionar();
  };

  abrirModalAdicionar() {
    const dialogRef = this.dialog.open(ModalPlanoComponent, {
      width: '420px',
      data: { plano: null, editMode: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adicionaPlano(result);
      }
    });
  }

  adicionaPlano(plano: any) {
    // normaliza tipos
    const payload = {
      ...plano,
      valor: Number(plano.valor),
      trial_enabled: Boolean(plano.trial_enabled),
      trial_days: Number(plano.trial_days) || 0,
      pagamento_ciclo: String(plano.pagamento_ciclo || 'MONTHLY').toUpperCase(),
    };

    this.planoService.createPlanos(payload).subscribe({
      next: () => this.getPlanos(),
    });
  }

  editarPlano = (plano: any) => {
    const dialogRef = this.dialog.open(ModalPlanoComponent, {
      width: '420px',
      data: { plano, editMode: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const payload = {
          ...result,
          valor: Number(result.valor),
          trial_enabled: Boolean(result.trial_enabled),
          trial_days: Number(result.trial_days) || 0,
          pagamento_ciclo: String(
            result.pagamento_ciclo || 'MONTHLY'
          ).toUpperCase(),
        };

        this.planoService.updatePlanos(payload.id, payload).subscribe({
          next: () => this.getPlanos(),
          error: (err: any) => console.log(err),
        });
      }
    });
  };

  excluirPlano() {}
}
