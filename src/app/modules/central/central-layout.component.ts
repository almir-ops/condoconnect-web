import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { CentralAuthService } from '../../shared/services/auth/central-auth.service';

@Component({
  selector: 'app-central-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    NgIf,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatRippleModule,
  ],
  templateUrl: './central-layout.component.html',
  styles: [
    `
      .navItem {
        @apply flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition;
      }
      .activeLink {
        @apply bg-gray-100;
      }
    `,
  ],
})
export class CentralLayoutComponent {
  private bp = inject(BreakpointObserver);
  private auth = inject(CentralAuthService);

  user = this.auth.getUser();
  isHandset$ = this.bp
    .observe('(max-width: 768px)')
    .pipe(map((r) => r.matches));

  logout() {
    this.auth.logout(true);
  }
}
