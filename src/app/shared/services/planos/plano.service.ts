import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlanoService {
  private readonly apiUrl = environment.apiUrl + 'planos';
  constructor(private http: HttpClient) {}

  getAllPlanos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPlanosById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPlanos(plano: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, plano);
  }

  updatePlanos(id: number, plano: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, plano);
  }

  deletePlanos(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
