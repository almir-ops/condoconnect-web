// pages/assinaturas/modal-pagamentos.component.ts
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { InscricaoService } from '../../../services/inscricao/plano.service';

@Component({
  standalone: true,
  selector: 'app-modal-pagamentos',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './modal-pagamentos.component.html',
})
export class ModalPagamentosComponent {
  rows: any[] = [];
  constructor(
    private api: InscricaoService,
    @Inject(MAT_DIALOG_DATA)
    public data: { subId: number; empresa?: string; plano?: string }
  ) {}

  ngOnInit() {
    this.api.pagamentos(this.data.subId).subscribe({
      next: (r) => (this.rows = r || []),
    });
  }
}
