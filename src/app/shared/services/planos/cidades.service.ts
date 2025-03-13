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
  private readonly apiUrl = environment.apiUrl + 'planos';
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<Cidade> {
    return this.http.get<Cidade>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: Cidade): Observable<Cidade> {
    return this.http.post<Cidade>(this.apiUrl, category);
  }

  updateCategory(id: number, category: Cidade): Observable<Cidade> {
    return this.http.put<Cidade>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
