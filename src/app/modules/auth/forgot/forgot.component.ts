import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../shared/components/dialog/alert.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { debounceTime, Observable } from 'rxjs';
import { BaseComponent } from '../../../shared/components/base/base.component';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.scss'
})
export class ForgotComponent extends BaseComponent implements OnInit {

  token: string | null = null;
  email: string = '';
  password: string = '';
  hiddenPassword: boolean = false;
  rememberEmail: boolean = false;
  passwordErrors: any = {
    minLength: false,
    specialChar: false,
    number: false,
    upperLower: false,
  };
  enableLogin = false;
  passwordNull = false;
  styleBorderPassword = '';


  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      console.log('Token recebido:', this.token);
    });
    this.initForm();

  }

  initForm() {
    this.form = this.fb.group({
      password: ['', Validators.required, this.passwordValidator.bind(this)],
      email: ['', [Validators.required, Validators.email]],
      confirmPassword: ['', Validators.required],
      token: ['', Validators.required],
    });

    this.formControlls['password'].valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.updateLoginState();
      });

    this.formControlls['confirmPassword'].valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.updateLoginState();
      });
  }
  resetPassword() {
    if(this.email && this.password) {
      this.authService.update({ email: this.email, senha: this.password, token: this.token });

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

  private passwordValidator(
    control: FormControl
  ): Observable<{ [key: string]: boolean } | null> {
    return new Observable((observer) => {
      const value = control.value || '';
      this.passwordErrors.minLength = value.length >= 6;
      this.passwordErrors.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      this.passwordErrors.number = /\d/.test(value);
      this.passwordErrors.upperLower =
        /[a-z]/.test(value) && /[A-Z]/.test(value);

      const isValid =
        this.passwordErrors.minLength &&
        this.passwordErrors.specialChar &&
        this.passwordErrors.number &&
        this.passwordErrors.upperLower;

      observer.next(isValid ? null : { passwordInvalid: true });
      observer.complete();
    });
  }

  updateLoginState() {
    const { username, password } = this.form.getRawValue();

    this.enableLogin = username !== '' && password?.length > 4;

    if (!password || password.length < 1) {
      this.passwordNull = true;
      this.styleBorderPassword = 'border-red-400';
    } else {
      this.passwordNull = false;
      this.styleBorderPassword = '';
    }
  }
}
