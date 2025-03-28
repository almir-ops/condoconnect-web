import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InscricaoService {
  private readonly apiUrl = environment.apiUrl + 'inscricoes';
  constructor(private http: HttpClient) {}

  getAllAssinaturas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAllPagamentosAssinaturas(idAssinatura:any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+ '/pagamentos/'+ idAssinatura);
  }

  criarAssinatura(req: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, req);
  }

  cancelaPlano(idAssinatura: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idAssinatura}/cancelar`);
  }
}
