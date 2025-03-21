import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiUrl = environment.apiUrl + 'auth';
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/users');
  }

  updateUserss(id: number, category: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, category);
  }

  deleteUsers(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  register(body:any){
    return this.http.post(`${this.apiUrl}/register`, body);
  }
}
