import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import QRCode from 'qrcode';
import { CompaniesService } from '../../../shared/services/companies/companies.service';
import { CondominiosService } from '../../../shared/services/condominios/condominios.service';
import { Platform, STORE_LINKS, detectPlatform, openAppOrStore } from '../../../shared/utils/open-app';

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
  naoEncontrado = false;

  empresas: any[] = [];
  empresasFiltradas: any[] = [];

  loading: boolean = true;
  loadingCondominio: boolean = true;

  // "Cadastrar empresa": no celular abre o app ou a loja; no computador mostra os dois links
  lojas = STORE_LINKS;
  plataforma: Platform = 'desktop';
  mostrarLojas = false;

  // QR Code do condomínio (opção discreta no topo)
  qrAberto = false;
  qrDataUrl = '';
  linkCondominio = '';
  aviso = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private empresasService: CompaniesService,
    private condominiosService: CondominiosService,
  ) {}

  ngOnInit(): void {
    this.plataforma = detectPlatform();
    this.condominioId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.condominioId) {
      this.loading = false;
      this.loadingCondominio = false;
      this.naoEncontrado = true;
      return;
    }

    this.linkCondominio = `${window.location.origin}/condominio/${this.condominioId}`;
    this.carregarCondominio();
    this.carregarEmpresasDoCondominio();
  }

  // ---------- dados ----------
  carregarCondominio(): void {
    this.loadingCondominio = true;

    this.condominiosService.getEstablishmentById(this.condominioId).subscribe({
      next: (condominio: any) => {
        this.condominio = condominio;
        this.naoEncontrado = !condominio?.id;
        this.loadingCondominio = false;
        if (condominio?.nome) document.title = `${condominio.nome} | CondoConnect`;
      },
      error: (error: any) => {
        console.error('Erro ao buscar condomínio:', error);
        this.condominio = null;
        this.naoEncontrado = true;
        this.loadingCondominio = false;
      },
    });
  }

  carregarEmpresasDoCondominio(): void {
    this.loading = true;

    this.empresasService.getCompaniesByCondominioId(this.condominioId).subscribe({
      next: (response: any) => {
        // empresas desativadas não aparecem para o público
        this.empresas = Array.isArray(response) ? response.filter((e: any) => e?.ativo !== false) : [];
        this.filtrarEmpresas();
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
    const termo = this.normalizar(this.pesquisar).trim();
    if (!termo) {
      this.empresasFiltradas = this.empresas;
      return;
    }
    this.empresasFiltradas = this.empresas.filter((empresa: any) => {
      const categorias = (empresa?.categorias || []).map((c: any) => c?.nome).join(' ');
      const texto = this.normalizar(
        [empresa?.nome, empresa?.slogan, empresa?.descricao, empresa?.telefone, empresa?.email, categorias].join(' '),
      );
      return texto.includes(termo);
    });
  }

  private normalizar(valor: unknown): string {
    return String(valor ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  categoriasDe(empresa: any): string[] {
    return (empresa?.categorias || []).map((c: any) => c?.nome).filter(Boolean).slice(0, 2);
  }

  abrirEmpresa(empresa: any): void {
    if (!empresa?.id) return;
    this.router.navigate(['empresa', empresa.id, 'cartao-digital']);
  }

  // ---------- endereço, mapa e busca ----------
  get enderecoCompleto(): string {
    const c = this.condominio;
    if (!c) return '';
    const rua = [c.endereco, c.numero].filter(Boolean).join(', ');
    return [rua, c.bairro, c.cidade && c.estado ? `${c.cidade} - ${c.estado}` : c.cidade || c.estado, c.cep]
      .filter(Boolean).join(', ');
  }

  /** Texto do destino no mapa: coordenadas, se existirem; senão nome + endereço. */
  private get destinoMapa(): string {
    const c = this.condominio;
    if (c?.latitude && c?.longitude) return `${c.latitude},${c.longitude}`;
    return [c?.nome, this.enderecoCompleto].filter(Boolean).join(' ');
  }

  get temLocal(): boolean { return !!this.condominio && !!this.destinoMapa; }

  get linkComoChegar(): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.destinoMapa)}`;
  }
  get linkVerNoMapa(): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.destinoMapa)}`;
  }
  get linkGoogle(): string {
    const c = this.condominio;
    const busca = [c?.nome, c?.cidade].filter(Boolean).join(' ');
    return `https://www.google.com/search?q=${encodeURIComponent(busca)}`;
  }
  get linkTelefone(): string {
    return `tel:${String(this.condominio?.telefone || this.condominio?.celular || '').replace(/[^\d+]/g, '')}`;
  }
  get temTelefone(): boolean { return !!(this.condominio?.telefone || this.condominio?.celular); }

  // ---------- cadastrar empresa ----------
  cadastrarEmpresa(): void {
    const plataforma = openAppOrStore('/perfil/estabelecimentos/novo');
    this.mostrarLojas = plataforma === 'desktop';
  }

  // ---------- QR Code ----------
  async abrirQr(): Promise<void> {
    this.qrAberto = true;
    if (this.qrDataUrl || !this.linkCondominio) return;
    try {
      this.qrDataUrl = await QRCode.toDataURL(this.linkCondominio, { width: 520, margin: 2, errorCorrectionLevel: 'H' });
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  }
  fecharQr(): void { this.qrAberto = false; }

  baixarQr(): void {
    if (!this.qrDataUrl) return;
    const nome = this.normalizar(this.condominio?.nome || 'condominio').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const a = document.createElement('a');
    a.href = this.qrDataUrl;
    a.download = `qrcode-${nome || 'condominio'}.png`;
    a.click();
  }

  async copiarLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.linkCondominio);
      this.mostrarAviso('Link copiado!');
    } catch {
      this.mostrarAviso('Não foi possível copiar. Copie o link manualmente.');
    }
  }

  async compartilhar(): Promise<void> {
    const dados = { title: this.condominio?.nome || 'Condomínio', text: `Veja as empresas do ${this.condominio?.nome || 'condomínio'} no CondoConnect`, url: this.linkCondominio };
    if (navigator.share) {
      try { await navigator.share(dados); } catch { /* a pessoa cancelou */ }
    } else {
      await this.copiarLink();
    }
  }

  private mostrarAviso(texto: string): void {
    this.aviso = texto;
    setTimeout(() => { this.aviso = ''; }, 2500);
  }

  trackEmpresa(_: number, empresa: any): any { return empresa?.id ?? _; }

  irParaInicio(): void {
    this.router.navigate(['']);
  }
}
