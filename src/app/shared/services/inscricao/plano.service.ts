// shared/services/inscricoes/inscricao.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InscricaoService {
  private readonly baseUrl = environment.apiUrl + 'inscricoes';

  constructor(private http: HttpClient) {}

  listarAssinaturas(query: string = ''): Observable<any[]> {
    // ex: listarAssinaturas('?usuario_id=...') ou ('?empresa_id=...')
    return this.http.get<any[]>(`${this.baseUrl}${query}`);
  }

  // GET /inscricoes  (lista assinaturas com include empresa/plano e status agregado)
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // GET /inscricoes/subscriptions (com filtros opcionais, ex: ?onlyPaid=true)
  listarFiltrado(
    params?: Record<string, string | number | boolean>
  ): Observable<any[]> {
    let p = new HttpParams();
    Object.entries(params || {}).forEach(([k, v]) => (p = p.set(k, String(v))));
    return this.http.get<any[]>(`${this.baseUrl}/subscriptions`, { params: p });
  }

  // GET /inscricoes/pagamentos/:subscription_id
  pagamentos(subscriptionId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pagamentos/${subscriptionId}`);
  }

  // POST /inscricoes  (criar assinatura)
  criar(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }

  // PATCH /inscricoes/:id  (editar campos locais da assinatura)
  editar(id: number | string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}`, payload);
  }

  // POST /inscricoes/:id/cancelar  (importante: é POST no seu back)
  cancelar(id: number | string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}/cancelar`, {});
  }

  // (Opcional) POST /inscricoes/:id/avisar  (se expor essa rota)
  avisarTrial(
    id: number | string,
    body: { dias?: number; canal?: string } = {}
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}/avisar`, body);
  }

  assinarPlano(req: any): Observable<any> {
    // req: { empresa_id, usuario_id, plano_id, cpf?, use_trial? }
    return this.http.post<any>(this.baseUrl, req);
  }

  checkPromoUsada(empresaId: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/subscriptions?empresa_id=${empresaId}&onlyFree=true`
    );
  }

  listarPagamentosPorAssinatura(idInscricao: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pagamentos/${idInscricao}`);
  }

  cancelarAssinatura(idInscricao: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${idInscricao}/cancelar`, {});
  }
}
