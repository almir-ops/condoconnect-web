import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  url: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    const rawUrl = 'https://phtreinamentoecons.wixsite.com/condoconnect-1';
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }
}
