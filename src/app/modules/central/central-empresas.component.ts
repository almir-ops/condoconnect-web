import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { CentralAuthService } from '../../shared/services/auth/central-auth.service';
import { CompaniesService } from '../../shared/services/companies/companies.service';

@Component({
  selector: 'app-central-empresas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './central-empresas.component.html',
})
export class CentralEmpresasComponent {
  loading = true;
  q = '';

  empresas: any[] = [];
  filtered: any[] = [];

  user: any;
  item: any;

  constructor(
    private companies: CompaniesService,
    private auth: CentralAuthService
  ) {
    this.user = this.auth.getUser();
    this.load();
  }

  load() {
    this.loading = true;
    const query = '?user_id=' + this.user?.id;

    this.companies.getByFilter(query).subscribe({
      next: (value: any) => {
        this.empresas = Array.isArray(value) ? value : [];
        this.filtered = [...this.empresas];
        this.loading = false;
      },
      error: () => {
        this.empresas = [];
        this.filtered = [];
        this.loading = false;
      },
    });
  }

  applyFilter() {
    const s = this.q.trim().toLowerCase();
    if (!s) {
      this.filtered = [...this.empresas];
      return;
    }
    this.filtered = this.empresas.filter((e) =>
      `${e?.nome || ''} ${e?.cnpj || ''} ${e?.cpf || ''} ${e?.email || ''}`
        .toLowerCase()
        .includes(s)
    );
  }
}
