import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/components/dialog/alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailLowercaseDirective } from '../../../shared/directives/email-lowercase.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,EmailLowercaseDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  hiddenPassword: boolean = false;
  rememberEmail: boolean = false;

  constructor(
    private authService: AuthService,
    private router:Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.email = (localStorage.getItem('savedEmail') || '').toLowerCase();
    this.rememberEmail = !!this.email;

  }

  login() {
    this.email = this.email.trim().toLowerCase();
    if(this.email && this.password) {
      this.authService.login({ email: this.email, senha: this.password });

      if (this.rememberEmail) {
        localStorage.setItem('savedEmail', this.email);
      } else {
        localStorage.removeItem('savedEmail');
      }

    }else{
      this.alertService.presentAlert('Atenção ', 'Preencha todos os campos.');
    }
  }

  viewPassword() {
    this.hiddenPassword = !this.hiddenPassword;
  }

  navegate(rota:any){
    this.router.navigate([rota]);
  }
}
