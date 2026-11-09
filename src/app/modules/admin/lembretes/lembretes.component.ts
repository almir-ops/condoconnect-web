import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

interface Rule {
  id: string; name: string; channel: 'email' | 'push'; audience: 'all' | 'without_company';
  subject: string; message: string; days: number[]; maxSends: number; sendTime: string;
  timezone: string; enabled: boolean;
}
@Component({
  selector: 'app-lembretes', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './lembretes.component.html', styleUrl: './lembretes.component.scss',
})
export class LembretesComponent implements OnInit {
  private url = `${environment.apiUrl}reminders`;
  rules: Rule[] = [];
  history: any[] = [];
  selected?: Rule;
  status = { schedulerEnabled: false, emailReady: false, pushReady: false, androidReady: false, iosReady: false };
  error = ''; success = ''; loading = false; daysText = '1, 3, 7';
  form: Rule = this.blank();
  test = { email: '', title: 'Teste CondoConnect', message: 'Se você recebeu isto, o push está funcionando.' };
  testing = false;
  constructor(private http: HttpClient) {}
  private headers() { return { headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token') || ''}` }) }; }
  private blank(): Rule { return { id: '', name: '', channel: 'email', audience: 'without_company',
    subject: 'Seu cadastro no CondoConnect', message: '', days: [1, 3, 7], maxSends: 3,
    sendTime: '10:00', timezone: 'America/Sao_Paulo', enabled: false }; }
  ngOnInit() { this.refresh(); }
  refresh() {
    this.http.get<Rule[]>(`${this.url}/rules`, this.headers()).subscribe({ next: data => this.rules = data, error: e => this.fail(e) });
    this.http.get<typeof this.status>(`${this.url}/status`, this.headers()).subscribe({ next: data => this.status = data, error: e => this.fail(e) });
  }
  edit(rule: Rule) { this.form = { ...rule, days: [...rule.days] }; this.daysText = rule.days.join(', '); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  clear() { this.form = this.blank(); this.daysText = '1, 3, 7'; }
  save() {
    this.error = ''; this.success = '';
    const days = [...new Set(this.daysText.split(',').map(x => Number(x.trim())))].sort((a, b) => a - b);
    if (!days.length || days.some(x => !Number.isInteger(x) || x < 1 || x > 365)) { this.error = 'Informe dias válidos, separados por vírgula.'; return; }
    const body = { ...this.form, days, maxSends: Number(this.form.maxSends) };
    this.loading = true;
    const request = this.form.id
      ? this.http.put<Rule>(`${this.url}/rules/${this.form.id}`, body, this.headers())
      : this.http.post<Rule>(`${this.url}/rules`, body, this.headers());
    request.subscribe({ next: () => { this.loading = false; this.success = 'Lembrete salvo como rascunho.'; this.clear(); this.refresh(); },
      error: e => { this.loading = false; this.fail(e); } });
  }
  toggle(rule: Rule) {
    this.error = ''; this.success = '';
    this.http.patch<Rule>(`${this.url}/rules/${rule.id}/active`, { enabled: !rule.enabled }, this.headers())
      .subscribe({ next: () => { this.success = rule.enabled ? 'Lembrete pausado.' : 'Lembrete ativado.'; this.refresh(); }, error: e => this.fail(e) });
  }
  showHistory(rule: Rule) {
    this.selected = rule; this.history = [];
    this.http.get<any[]>(`${this.url}/rules/${rule.id}/history`, this.headers())
      .subscribe({ next: data => this.history = data, error: e => this.fail(e) });
  }
  testPush() {
    this.error = ''; this.success = '';
    if (!this.test.email.trim()) { this.error = 'Informe o e-mail do usuário que vai receber o teste.'; return; }
    this.testing = true;
    this.http.post<{ message: string }>(`${this.url}/test-push`, this.test, this.headers())
      .subscribe({ next: r => { this.testing = false; this.success = r.message; }, error: e => { this.testing = false; this.fail(e); } });
  }
  private fail(error: any) { this.error = error?.error?.message || 'Não foi possível concluir a operação.'; }
}

