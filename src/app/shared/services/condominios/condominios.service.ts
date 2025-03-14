import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CondominiosService {
  private readonly apiUrl = environment.apiUrl + 'condominios';

  constructor(private http: HttpClient) {}

  // Criar um novo estabelecimento
  createEstablishment(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }

  // Obter todos os estabelecimentos
  getAllEstablishments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Obter todos os estabelecimentos
  getAllEstablishmentsByFilters(filter:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?search=${filter}`);
  }
/*
  getAllEstablishmentsByFiltersNoLoad(filter: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?search=${filter}`, {
      context: new HttpContext().set(NO_LOADING, true), // Desativa o loading
    });
  }
*/
  // Obter um estabelecimento por ID
  getEstablishmentById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Atualizar um estabelecimento por ID
  updateEstablishment(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Remover um estabelecimento por ID
  deleteEstablishment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
