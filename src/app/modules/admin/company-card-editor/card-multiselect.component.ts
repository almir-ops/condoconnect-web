import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-card-multiselect',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  template: `
    <label class="label" [id]="id + '-label'">{{ label }}</label>
    <button #trigger class="trigger" cdkOverlayOrigin #origin="cdkOverlayOrigin" type="button"
      [disabled]="disabled" [class.active]="open" [attr.aria-expanded]="open" aria-haspopup="dialog"
      [attr.aria-labelledby]="id + '-label ' + id + '-summary'" [attr.aria-controls]="open ? id + '-options' : null"
      (click)="open = !open; query = ''">
      <span class="summary" [class.placeholder]="!value.length" [id]="id + '-summary'">{{ summary }}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 9 7 7 7-7" stroke="currentColor" stroke-width="1.7"/></svg>
    </button>
    <ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="origin" [cdkConnectedOverlayOpen]="open && !disabled"
      [cdkConnectedOverlayWidth]="trigger.offsetWidth" [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      (backdropClick)="open = false" (detach)="open = false"
      (overlayKeydown)="onKey($event, trigger)">
      <div class="options" role="dialog" [attr.aria-label]="label" [id]="id + '-options'">
        <div class="search-row">
          <input type="checkbox" [checked]="allSelected" [indeterminate]="someSelected && !allSelected"
            [disabled]="!filtered.length" (change)="toggleAll()" aria-label="Selecionar todas as opções filtradas">
          <div class="search-wrap"><input type="search" class="search" [value]="query" (input)="search($event)"
            [attr.aria-label]="'Buscar em ' + label" placeholder="Buscar…">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7" stroke="currentColor"/><path d="m15 15 6 6" stroke="currentColor"/></svg>
          </div>
        </div>
        <div class="list" role="group" [attr.aria-label]="label">
          <label *ngFor="let option of filtered" class="option">
            <input type="checkbox" [checked]="value.includes(option.id)" (change)="toggle(option.id)">
            <span>{{ option.nome }}</span>
          </label>
          <p *ngIf="!filtered.length">{{ options.length ? 'Nenhum resultado para esta busca.' : 'Nenhuma opção disponível.' }}</p>
        </div>
        <div class="count">{{ value.length }} selecionado(s) · {{ options.length }} opções</div>
      </div>
    </ng-template>
  `,
  styleUrl: './card-multiselect.component.scss',
})
export class CardMultiselectComponent {
  @Input() id = '';
  @Input() label = '';
  @Input() options: { id: number; nome: string }[] = [];
  @Input() value: number[] = [];
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<number[]>();
  open = false;
  query = '';
  get summary() { return this.options.filter(option => this.value.includes(option.id)).map(option => option.nome).join(', ') || 'Selecione as opções'; }
  get filtered() {
    const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return this.options.filter(option => normalize(option.nome).includes(normalize(this.query.trim())));
  }
  get allSelected() { return this.filtered.length > 0 && this.filtered.every(option => this.value.includes(option.id)); }
  get someSelected() { return this.filtered.some(option => this.value.includes(option.id)); }
  search(event: Event) { this.query = (event.target as HTMLInputElement).value; }
  onKey(event: KeyboardEvent, trigger: HTMLButtonElement) {
    if (event.key === 'Escape') { event.stopPropagation(); this.open = false; trigger.focus(); }
  }
  toggleAll() {
    if (this.disabled) return;
    const ids = this.filtered.map(option => option.id);
    this.valueChange.emit(this.allSelected ? this.value.filter(id => !ids.includes(id)) : [...new Set([...this.value, ...ids])]);
  }
  toggle(id: number) {
    if (!this.disabled) this.valueChange.emit(this.value.includes(id) ? this.value.filter(value => value !== id) : [...this.value, id]);
  }
}
