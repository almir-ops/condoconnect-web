import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from '../../interfaces/Company';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private readonly apiUrl = environment.api_url + 'companies'; // Substitua pela URL correta do seu endpoint

  constructor(private http: HttpClient) { }

  // Método para buscar todas as empresas
  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  // Método para buscar uma empresa por ID
  getById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  // Método para buscar uma empresa por ID
  getCategoriesByCondo(idCondo: number): Observable<Company> {
    return this.http.get<any>(`${this.apiUrl}/categories-by-establishment?establishment_id=${idCondo}`);
  }

  // Método para buscar uma empresa por ID
  getByFilter(query: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}${query}`);
  }

  // Método para criar uma nova empresa
  create(company: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  // Método para atualizar uma empresa existente
  update(id: number, company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}`, company);
  }

  // Método para excluir uma empresa
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
