import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TabService } from '../tabs/tabs.service';
import { AlertService } from '../../components/dialog/alert.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly API_URL = environment.apiUrl; // Substitua pelo seu endpoint

  constructor(
    private http: HttpClient,
    private router: Router,
    private tabService: TabService,
    private alertService: AlertService

  ) {}

  // Armazena o token de forma segura
  private saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token); // Para maior segurança, use plugins como Secure Storage.
  }

  saveUser(user: any){
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Retorna o token armazenado
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Decodifica o token para obter informações como expiração
  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  // Verifica se o token é válido
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.decodeToken();
    const now = Math.floor(Date.now() / 1000); // Tempo atual em segundos
    return decodedToken.exp > now; // Compara a expiração
  }

  // Login e armazenamento do token
  login(credentials: { email: string; senha: string }) {
    console.log(credentials);

    return this.http.post(`${this.API_URL}auth/login`, credentials).subscribe(
      (response: any) => {
        console.log(response);

        if(response.user.tipo === 'admin'){
          this.saveToken(response.token);
          this.saveUser(response.user)
          this.router.navigate(['/admin/condominios']);
        }else{
          this.alertService.presentAlert('Atenção', 'Usuário não encontrado.');
        }
      },
      (error) => {
        // Verifica o código de erro HTTP e exibe a mensagem apropriada
        if (error.status === 401) {
          this.alertService.presentAlert('Atenção', 'Usuário ou senha inválidos.');
        } else if (error.status === 404) {
          this.alertService.presentAlert('Atenção', 'Usuário não encontrado.');
        } else {
          this.alertService.presentAlert('Erro de Comunicação', 'Houve um erro de comunicação, tente novamente.');
        }

        console.error('Erro no login', error);
      }
    );
  }

  register(body:any){
    return this.http.post(`${this.API_URL}auth/register`, body).subscribe(
      (response: any) => {
        this.router.navigate(['/perfil']);
        this.tabService.setActiveTab('perfil');
        this.alertService.presentAlert('Muito bem!', 'Usuário registrado com sucesso.');
      },
      (error) => {
        console.log(error);


        // Verifica o código de erro HTTP e exibe a mensagem apropriada
        if (error.status === 400) {
          this.alertService.presentAlert('Atenção', error.error.message );
        } else {
          this.alertService.presentAlert('Erro de Comunicação', 'Houve um erro de comunicação, tente novamente.');
        }

        console.error('Erro no registrar', error);
      }
    );
  }

  update(body:any){
    return this.http.put(`${this.API_URL}auth/update/`+ body.id, body);
  }

  // Logout e remoção do token
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}
