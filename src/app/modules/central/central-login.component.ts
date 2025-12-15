import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CentralAuthService } from '../../shared/services/auth/central-auth.service';

@Component({
  selector: 'app-central-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './central-login.component.html',
})
export class CentralLoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(CentralAuthService);

  loading = false;
  showPass = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]],
  });

  get email() {
    return this.form.get('email')!;
  }
  get senha() {
    return this.form.get('senha')!;
  }
  hiddenPassword = true;

  viewPassword() {
    this.hiddenPassword = !this.hiddenPassword;
  }
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    // seu service hoje faz subscribe interno; então aqui só chama
    this.auth.login(this.form.getRawValue() as any);

    // se quiser loading perfeito, eu ajusto o service pra retornar Observable
    setTimeout(() => (this.loading = false), 1200);
  }
}
