import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  menuOpen = false;
  readonly year = new Date().getFullYear();
  readonly appleStore = 'https://apps.apple.com/br/app/condoconnect/id6748700594';
  readonly googlePlay = 'https://play.google.com/store/apps/details?id=br.com.condoconnect';
  readonly whatsapp = 'https://wa.me/5511930299320';

  closeMenu(): void {
    this.menuOpen = false;
  }
}
