import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-company-card-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-card-preview.component.html',
  styleUrl: './company-card-preview.component.scss',
})
export class CompanyCardPreviewComponent {
  @Input() model: Record<string, any> = {};
  @Input() condoNames = '';
  private failures: Record<string, string> = {};
  imageSource(field: string): string | null {
    const value = String(this.model[field] || '').trim();
    return /^https?:\/\//i.test(value) && this.failures[field] !== value ? value : null;
  }
  imageFailed(field: string): void { this.failures[field] = String(this.model[field] || '').trim(); }
}
