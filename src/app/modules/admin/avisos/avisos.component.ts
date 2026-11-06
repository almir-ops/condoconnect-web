import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { UsersService } from '../../../shared/services/usuarios/users.service';
import { CompaniesService } from '../../../shared/services/companies/companies.service';

type Publico = 'todos' | 'usuarios' | 'empresas';
interface Aviso {
  id: string; titulo: string; mensagem: string; tipo: 'aviso' | 'novidade' | 'alerta';
  publico: Publico; usuarioIds: string[]; empresaIds: number[]; permiteDispensar: boolean;
  botaoTexto: string; botaoUrl: string; inicio: string; fim: string; ativo: boolean;
  vistos?: number; dispensados?: number; createdAt?: string;
}
interface Opcao { id: string | number; nome: string; detalhe: string; }

@Component({
  selector: 'app-avisos', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './avisos.component.html', styleUrl: './avisos.component.scss',
})
export class AvisosComponent implements OnInit {
  private url = `${environment.apiUrl}avisos`;
  avisos: Aviso[] = [];
  usuarios: Opcao[] = [];
  empresas: Opcao[] = [];
  busca = '';
  form: Aviso = this.blank();
  error = ''; success = ''; loading = false;
  readonly tipos = [
    { valor: 'aviso', nome: 'Aviso' }, { valor: 'novidade', nome: 'Novidade' }, { valor: 'alerta', nome: 'Alerta importante' },
  ];

  constructor(private http: HttpClient, private users: UsersService, private companies: CompaniesService) {}

  private headers() { return { headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` }) }; }
  private blank(): Aviso {
    return { id: '', titulo: '', mensagem: '', tipo: 'aviso', publico: 'todos', usuarioIds: [], empresaIds: [],
      permiteDispensar: true, botaoTexto: '', botaoUrl: '', inicio: '', fim: '', ativo: true };
  }

  ngOnInit() {
    this.refresh();
    this.users.getAllUsers().subscribe({ next: list => this.usuarios = (list || []).map(u => ({ id: u.id, nome: u.nome || u.email, detalhe: u.email })) });
    this.companies.getAll().subscribe({ next: list => this.empresas = (list || []).map(e => ({ id: e.id, nome: e.nome, detalhe: [e.cidade, e.email].filter(Boolean).join(' · ') })) });
  }

  refresh() {
    this.http.get<Aviso[]>(this.url, this.headers()).subscribe({ next: data => this.avisos = data, error: e => this.fail(e) });
  }

  // ---- seleção de público ----
  get opcoes(): Opcao[] { return this.form.publico === 'usuarios' ? this.usuarios : this.empresas; }
  get selecionados(): (string | number)[] { return this.form.publico === 'usuarios' ? this.form.usuarioIds : this.form.empresaIds; }
  get filtradas(): Opcao[] {
    const q = this.busca.trim().toLowerCase();
    const lista = q ? this.opcoes.filter(o => `${o.nome} ${o.detalhe}`.toLowerCase().includes(q)) : this.opcoes;
    return lista.slice(0, 60);
  }
  marcado(o: Opcao) { return this.selecionados.includes(o.id as never); }
  alternar(o: Opcao) {
    const lista = this.form.publico === 'usuarios' ? this.form.usuarioIds : this.form.empresaIds as (string | number)[];
    const i = lista.indexOf(o.id);
    if (i >= 0) lista.splice(i, 1); else lista.push(o.id);
  }
  nomeDe(id: string | number, publico: Publico) {
    const lista = publico === 'usuarios' ? this.usuarios : this.empresas;
    return lista.find(o => o.id === id)?.nome || `#${id}`;
  }
  resumoPublico(a: Aviso): string {
    if (a.publico === 'todos') return 'Todos os usuários';
    const ids = a.publico === 'usuarios' ? a.usuarioIds : a.empresaIds;
    const nomes = ids.slice(0, 3).map(id => this.nomeDe(id, a.publico)).join(', ');
    const rotulo = a.publico === 'usuarios' ? 'Usuário(s)' : 'Empresa(s)';
    return `${rotulo}: ${nomes}${ids.length > 3 ? ` e mais ${ids.length - 3}` : ''}`;
  }
  trocarPublico() { this.busca = ''; }

  // ---- ações ----
  edit(a: Aviso) {
    this.form = { ...a, usuarioIds: [...(a.usuarioIds || [])], empresaIds: [...(a.empresaIds || [])],
      botaoTexto: a.botaoTexto || '', botaoUrl: a.botaoUrl || '', inicio: this.paraCampo(a.inicio), fim: this.paraCampo(a.fim) };
    this.error = ''; this.success = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  clear() { this.form = this.blank(); this.busca = ''; }
  save() {
    this.error = ''; this.success = '';
    const body = { ...this.form, inicio: this.deCampo(this.form.inicio), fim: this.deCampo(this.form.fim) };
    this.loading = true;
    const req = this.form.id
      ? this.http.put<Aviso>(`${this.url}/${this.form.id}`, body, this.headers())
      : this.http.post<Aviso>(this.url, body, this.headers());
    req.subscribe({
      next: () => { this.loading = false; this.success = 'Aviso salvo.'; this.clear(); this.refresh(); },
      error: e => { this.loading = false; this.fail(e); },
    });
  }
  toggle(a: Aviso) {
    this.error = ''; this.success = '';
    this.http.patch(`${this.url}/${a.id}/ativo`, { ativo: !a.ativo }, this.headers())
      .subscribe({ next: () => { this.success = a.ativo ? 'Aviso desativado.' : 'Aviso ativado.'; this.refresh(); }, error: e => this.fail(e) });
  }
  remove(a: Aviso) {
    if (!confirm(`Excluir o aviso "${a.titulo}"? Isso também apaga o histórico de quem viu.`)) return;
    this.http.delete(`${this.url}/${a.id}`, this.headers())
      .subscribe({ next: () => { this.success = 'Aviso excluído.'; if (this.form.id === a.id) this.clear(); this.refresh(); }, error: e => this.fail(e) });
  }

  situacao(a: Aviso): string {
    const agora = Date.now();
    if (!a.ativo) return 'Desativado';
    if (a.inicio && new Date(a.inicio).getTime() > agora) return 'Agendado';
    if (a.fim && new Date(a.fim).getTime() < agora) return 'Encerrado';
    return 'No ar';
  }

  // datetime-local <-> ISO
  private paraCampo(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso); const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  private deCampo(valor: string): string | null { return valor ? new Date(valor).toISOString() : null; }
  private fail(e: any) { this.error = e?.error?.message || 'Não foi possível concluir a operação.'; }
}
