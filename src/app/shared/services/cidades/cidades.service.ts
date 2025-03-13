import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface Cidade {
  id?: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CidadeService {
  private readonly apiUrl = environment.apiUrl + 'cidades';
  constructor(private http: HttpClient) {}

  getAllCidades(): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(this.apiUrl);
  }

  getCidadesById(id: number): Observable<Cidade> {
    return this.http.get<Cidade>(`${this.apiUrl}/${id}`);
  }

  createCidades(cidade: any): Observable<Cidade> {
    return this.http.post<Cidade>(this.apiUrl, cidade);
  }

  updateCidades(id: number, category: Cidade): Observable<Cidade> {
    return this.http.put<Cidade>(`${this.apiUrl}/${id}`, category);
  }

  deleteCidades(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
