import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CentralAuthService {
  private readonly TOKEN_KEY = 'central_auth_token';
  private readonly USER_KEY = 'central_user';
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  private saveUser(user: any) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  getUser(): any | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  decodeToken(): any {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  isTokenValid(): boolean {
    const decoded = this.decodeToken();
    if (!decoded?.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  }

  // ✅ login do portal (usuário diferente do admin)
  login(credentials: { email: string; senha: string }) {
    return this.http.post(`${this.API_URL}auth/login`, credentials).subscribe({
      next: (response: any) => {
        const user = response?.user;

        // 🔒 aqui você define o(s) tipos aceitos no portal
        const tipo = String(user?.tipo || '').toLowerCase();
        const allow = ['empresa', 'cliente', 'user', 'gestor']; // ajuste para sua regra real

        if (!allow.includes(tipo)) {
          // não salva nada
          this.logout(false);
          alert('Usuário não permitido para o portal.');
          return;
        }

        this.saveToken(response.token);
        this.saveUser(user);
        this.router.navigate(['/central/assinaturas']);
      },
      error: (err) => {
        if (err.status === 401) alert('Usuário ou senha inválidos.');
        else if (err.status === 404) alert('Usuário não encontrado.');
        else alert('Erro de comunicação, tente novamente.');
        console.error('Erro no login portal', err);
      },
    });
  }

  logout(navigate = true) {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    if (navigate) this.router.navigate(['/central/login']);
  }
}
