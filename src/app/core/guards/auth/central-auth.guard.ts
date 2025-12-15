import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CentralAuthService } from '../../../shared/services/auth/central-auth.service';

@Injectable({ providedIn: 'root' })
export class CentralAuthGuard implements CanActivate {
  constructor(private auth: CentralAuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isTokenValid()) return true;
    this.router.navigate(['/central/login']);
    return false;
  }
}
