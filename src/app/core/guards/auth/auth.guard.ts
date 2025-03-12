import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Injeta o serviço de autenticação
  const router = inject(Router);          // Injeta o roteador do Angular

  if (authService.isTokenValid()) {
    return true; // Permite acesso à rota
  } else {
    router.navigate(['admin/login']); // Redireciona para a página de login
    return false; // Bloqueia o acesso
  }
};
