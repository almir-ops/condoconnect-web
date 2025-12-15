import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CentralAuthService } from '../../shared/services/auth/central-auth.service';

@Component({
  selector: 'app-central-perfil',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './central-perfil.component.html',
})
export class CentralPerfilComponent {
  user: any;
  centralUrl =
    localStorage.getItem('central_url') ||
    '' ||
    'http://localhost:57792/central';
  resetUrl = 'https://admin.condoconnectbr.com.br/reset-password';

  initials = 'CC';

  constructor(private auth: CentralAuthService) {
    this.user = this.auth.getUser();
    this.initials = this.makeInitials(
      this.user?.nome || this.user?.email || 'CC'
    );
    console.log(this.user);
  }

  private makeInitials(v: string) {
    const parts = String(v).trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('') || 'CC';
  }
}
