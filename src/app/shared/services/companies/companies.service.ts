import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private readonly apiUrl = environment.apiUrl + 'empresas'; // Substitua pela URL correta do seu endpoint

  constructor(private http: HttpClient) { }

  // Método para buscar todas as empresas
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para buscar uma empresa por ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Método para buscar uma empresa por ID
  getCategoriesByCondo(idCondo: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories-by-establishment?establishment_id=${idCondo}`);
  }

  // Método para buscar uma empresa por ID
  getByFilter(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${query}`);
  }

  // Método para criar uma nova empresa
  create(company: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, company);
  }

  // Método para atualizar uma empresa existente
  update(id: number, company: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, company);
  }

  // Método para excluir uma empresa
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
