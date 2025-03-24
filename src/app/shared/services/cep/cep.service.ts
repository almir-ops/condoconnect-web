import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  private viaCepUrl = 'https://viacep.com.br/ws/';

  constructor(private http: HttpClient) {}

  buscarCep(cep: string): Observable<any> {
    const url = `${this.viaCepUrl}${cep}/json/`;
    return this.http.get<any>(url);
  }
}
