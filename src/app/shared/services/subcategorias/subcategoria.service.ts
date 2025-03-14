import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubCategoriesService {
  private readonly apiUrl = environment.apiUrl + 'subcategorias';
  constructor(private http: HttpClient) {}

  getAllSubCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSubCategoriesById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createSubCategories(category: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, category);
  }

  updateSubCategories(id: number, category: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, category);
  }

  deleteSubCategories(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
