import { Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'condoconnect-web';

  private readonly defaultFavicon = 'assets/icon/favicon.png';
  private readonly adminFavicon = 'assets/icon/favicon-admin.png';

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.updateFavicon(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateFavicon(event.urlAfterRedirects));
  }

  private updateFavicon(url: string) {
    const favicon = this.document.querySelector<HTMLLinkElement>('#app-favicon');
    if (!favicon) return;

    const path = url.split('?')[0].split('#')[0];
    const isAdminRoute = path === '/admin' || path.startsWith('/admin/');

    favicon.type = 'image/png';
    favicon.href = isAdminRoute ? this.adminFavicon : this.defaultFavicon;
  }
}
