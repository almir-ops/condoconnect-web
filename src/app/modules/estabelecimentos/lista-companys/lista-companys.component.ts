import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from '../../../shared/services/companies/companies.service';
import { CondominiosService } from '../../../shared/services/condominios/condominios.service';

@Component({
  selector: 'app-lista-companys',
  templateUrl: './lista-companys.component.html',
  styleUrls: ['./lista-companys.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class ListaCompanysComponent implements OnInit {
  pesquisar: string = '';

  condominioId: string = '';
  condominio: any = null;

  empresas: any[] = [];
  empresasFiltradas: any[] = [];

  loading: boolean = false;
  loadingCondominio: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private empresasService: CompaniesService,
    private condominiosService: CondominiosService,
  ) {}

  ngOnInit(): void {
    this.condominioId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.condominioId) {
      console.error('ID do condomínio não encontrado na rota.');
      return;
    }

    this.carregarCondominio();
    this.carregarEmpresasDoCondominio();
  }

  carregarCondominio(): void {
    this.loadingCondominio = true;

    this.condominiosService.getEstablishmentById(this.condominioId).subscribe({
      next: (condominio: any) => {
        this.condominio = condominio;
        this.loadingCondominio = false;
      },
      error: (error: any) => {
        console.error('Erro ao buscar condomínio:', error);
        this.condominio = null;
        this.loadingCondominio = false;
      },
    });
  }

  carregarEmpresasDoCondominio(): void {
    this.loading = true;

    this.empresasService
      .getCompaniesByCondominioId(this.condominioId)
      .subscribe({
        next: (response: any) => {
          if (Array.isArray(response)) {
            this.empresas = response;
          } else {
            this.empresas = [];
          }

          this.empresasFiltradas = this.empresas;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao buscar empresas do condomínio:', error);
          this.empresas = [];
          this.empresasFiltradas = [];
          this.loading = false;
        },
      });
  }

  filtrarEmpresas(): void {
    const termo = String(this.pesquisar || '')
      .toLowerCase()
      .trim();

    if (!termo) {
      this.empresasFiltradas = this.empresas;
      return;
    }

    this.empresasFiltradas = this.empresas.filter((empresa: any) => {
      const nome = String(empresa?.nome || '').toLowerCase();
      const descricao = String(empresa?.descricao || '').toLowerCase();
      const telefone = String(empresa?.telefone || '').toLowerCase();
      const email = String(empresa?.email || '').toLowerCase();
      const endereco = String(empresa?.endereco || '').toLowerCase();
      const cidade = String(empresa?.cidade || '').toLowerCase();
      const estado = String(empresa?.estado || '').toLowerCase();
      const cep = String(empresa?.cep || '').toLowerCase();

      return (
        nome.includes(termo) ||
        descricao.includes(termo) ||
        telefone.includes(termo) ||
        email.includes(termo) ||
        endereco.includes(termo) ||
        cidade.includes(termo) ||
        estado.includes(termo) ||
        cep.includes(termo)
      );
    });
  }

  abrirEmpresa(empresa: any): void {
    if (!empresa?.id) {
      console.error('Empresa sem ID:', empresa);
      return;
    }

    this.router.navigate(['empresa', empresa.id, 'cartao-digital']);
  }

  navegate(rota: any): void {
    this.router.navigate([rota]);
  }

  rollback(): void {
    this.router.navigate(['init']);
    localStorage.removeItem('selectedCity');
    localStorage.removeItem('establishmentSelected');
  }
}
