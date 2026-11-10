import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

interface Item { key: string; userId: string | null; nome: string; email: string; detalhe: string; push: string[]; faltando?: string[] }
interface Field { key: string; label: string }
interface SendResult {
  total: number;
  push: { sent: number; noDevice: number; failed: number };
  email: { sent: number; failed: number; noEmail: number };
  errors: { destinatario: string; canal: string; erro: string }[];
}

@Component({
  selector: 'app-envio-manual', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './envio-manual.component.html', styleUrl: './envio-manual.component.scss',
})
export class EnvioManualComponent implements OnInit {
  private url = `${environment.apiUrl}reminders`;
  type: 'usuarios' | 'empresas' = 'usuarios';
  appRoutes: { route: string; label: string }[] = [];
  requiredFields: Field[] = [];
  optionalFields: Field[] = [];

  // Filtros (os dois públicos usam o mesmo objeto; a API ignora o que não é do tipo escolhido)
  filters: any = this.blankFilters();
  faltando = new Set<string>();

  items: Item[] = [];
  total = 0; truncated = false; listed = false; loadingList = false;
  selected = new Set<string>();

  channels = { push: true, email: false };
  title = ''; message = '';
  actionType: 'none' | 'app' | 'link' = 'none';
  actionRoute = '/perfil/estabelecimentos/novo'; actionUrl = ''; buttonText = '';
  sending = false; error = ''; result?: SendResult;

  constructor(private http: HttpClient) {}
  private headers() { return { headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}` }) }; }
  private blankFilters() {
    return { search: '', tipo: 'cliente', status: 'ativo', empresa: 'todos', telefone: 'todos', push: 'todos', cadastradoHaDias: null,
      ativa: 'todos', faltandoModo: 'qualquer', semAssinatura: false };
  }

  ngOnInit() {
    this.http.get<any>(`${this.url}/options`, this.headers()).subscribe({
      next: o => { this.appRoutes = o.appRoutes; this.requiredFields = o.requiredFields; this.optionalFields = o.optionalFields; },
      error: e => this.fail(e),
    });
  }

  setType(type: 'usuarios' | 'empresas') {
    if (this.type === type) return;
    this.type = type; this.reset();
  }
  reset() { this.filters = this.blankFilters(); this.faltando.clear(); this.items = []; this.selected.clear(); this.listed = false; this.error = ''; this.result = undefined; }

  // Atalhos para os filtros mais usados
  preset(name: string) {
    this.reset();
    if (name === 'usuarios-sem-empresa') { this.type = 'usuarios'; this.filters.empresa = 'sem'; }
    if (name === 'usuarios-sem-push') { this.type = 'usuarios'; this.filters.push = 'sem'; }
    if (name === 'usuarios-sem-empresa-7d') { this.type = 'usuarios'; this.filters.empresa = 'sem'; this.filters.cadastradoHaDias = 7; }
    if (name === 'empresas-incompletas') { this.type = 'empresas'; this.requiredFields.forEach(f => this.faltando.add(f.key)); }
    if (name === 'empresas-sem-condominio') { this.type = 'empresas'; this.faltando.add('condominio'); }
    if (name === 'empresas-sem-assinatura') { this.type = 'empresas'; this.filters.semAssinatura = true; this.filters.ativa = 'ativa'; }
    this.list();
  }

  toggleField(key: string) { this.faltando.has(key) ? this.faltando.delete(key) : this.faltando.add(key); }

  list() {
    this.error = ''; this.result = undefined; this.loadingList = true;
    const f = { ...this.filters, type: this.type, faltando: [...this.faltando],
      cadastradoHaDias: this.filters.cadastradoHaDias ? Number(this.filters.cadastradoHaDias) : undefined };
    this.http.post<{ total: number; truncated: boolean; items: Item[] }>(`${this.url}/audience`, f, this.headers()).subscribe({
      next: r => { this.loadingList = false; this.items = r.items; this.total = r.total; this.truncated = r.truncated; this.listed = true; this.selected.clear(); },
      error: e => { this.loadingList = false; this.fail(e); },
    });
  }

  // ---- seleção ----
  isSelected(item: Item) { return this.selected.has(item.key); }
  toggle(item: Item) { this.isSelected(item) ? this.selected.delete(item.key) : this.selected.add(item.key); }
  get allSelected() { return this.items.length > 0 && this.items.every(i => this.selected.has(i.key)); }
  toggleAll() { this.allSelected ? this.selected.clear() : this.items.forEach(i => this.selected.add(i.key)); }
  get chosen() { return this.items.filter(i => this.selected.has(i.key)); }
  /** Pessoas distintas (uma pessoa pode ser dona de várias empresas) */
  get recipients() { return [...new Map(this.chosen.filter(i => i.userId).map(i => [i.userId!, i])).values()]; }
  get withoutOwner() { return this.chosen.filter(i => !i.userId).length; }
  get withoutDevice() { return this.recipients.filter(i => !i.push.length).length; }

  get canSend() {
    return !this.sending && this.recipients.length > 0 && (this.channels.push || this.channels.email)
      && this.title.trim().length > 0 && this.message.trim().length > 0
      && (this.actionType !== 'link' || this.actionUrl.trim().length > 0);
  }

  send() {
    this.error = ''; this.result = undefined;
    const via = [this.channels.push ? 'push' : '', this.channels.email ? 'e-mail' : ''].filter(Boolean).join(' e ');
    if (!window.confirm(`Enviar "${this.title.trim()}" por ${via} para ${this.recipients.length} destinatário(s)? Não dá para desfazer.`)) return;
    this.sending = true;
    const body = {
      userIds: this.recipients.map(r => r.userId),
      channels: [this.channels.push ? 'push' : '', this.channels.email ? 'email' : ''].filter(Boolean),
      title: this.title.trim(), message: this.message.trim(),
      action: { type: this.actionType, route: this.actionRoute, url: this.actionUrl.trim(), buttonText: this.buttonText.trim() },
    };
    this.http.post<SendResult>(`${this.url}/send`, body, this.headers()).subscribe({
      next: r => { this.sending = false; this.result = r; },
      error: e => { this.sending = false; this.fail(e); },
    });
  }

  pushLabel(item: Item) { return item.push.length ? item.push.map(p => p === 'ios' ? 'iPhone' : 'Android').join(' + ') : '—'; }
  private fail(error: any) { this.error = error?.error?.message || 'Não foi possível concluir a operação.'; }
}
