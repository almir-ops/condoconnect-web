import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnChanges {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Input() btnText1!: string;
  @Input() defaultSortColumn: string = '';
  @Input() defaultSortDirection: 'asc' | 'desc' = 'asc';
  @Input() onButtonClick?: () => void;
  @Input() onEdit?: (row: any) => void;
  @Input() editLabel = 'Editar';
  @Input() companyCards = false;
  @Input() onDelete?: (row: any) => void;
  @Input() onCustomAction?: (row: any) => void;
  @Input() onToggleStatus?: (row: any) => void;
  @Input() onTrocarCondominio?: (row: any) => void;
  @Input() onQrCode?: (row: any) => void;
  private _searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.currentPage = 1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['defaultSortColumn'] || changes['columns']) && this.defaultSortColumn) {
      this.sortColumn = this.defaultSortColumn;
      this.sortDirection = this.defaultSortDirection;
    }

    if (changes['data']) {
      this.currentPage = 1;
    }
  }

  filteredData() {
    if (!Array.isArray(this.data)) {
      return [];
    }

    return this.data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase()),
      ),
    );
  }

  paginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.sortedData().slice(startIndex, startIndex + this.pageSize);
  }

  sortedData() {
    const rows = [...this.filteredData()];

    if (!this.sortColumn) {
      return rows;
    }

    return rows.sort((a, b) => {
      const comparison = this.compareValues(a?.[this.sortColumn], b?.[this.sortColumn]);
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  totalPages() {
    return Math.ceil(this.sortedData().length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  changePageSize(value: number | string) {
    this.pageSize = Number(value);
    this.currentPage = 1;
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.currentPage = 1;
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return '↕';
    }

    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  formatStatus(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'Ativo' : 'Inativo';
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return 'N/A';

      return value.map((item) => item?.nome).filter(Boolean).join(', ') || 'N/A';
    }

    if (typeof value === 'object' && value !== null) {
      return value.nome || 'N/A';
    }

    return value ?? '';
  }

  capitalizeFirstLetter(text: string): string {
    if (!text) return '';

    if (text === 'trocar_condominio') {
      return 'Trocar condomínio';
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  getToggleLabel(row: any): string {
    return row?.ativo ? 'Desativar' : 'Ativar';
  }

  getToggleClass(row: any): string {
    return row?.ativo
      ? 'bg-orange-600 text-sm text-white px-2 py-1 rounded'
      : 'bg-green-600 text-sm text-white px-2 py-1 rounded';
  }

  private compareValues(a: any, b: any): number {
    const normalizedA = this.normalizeSortValue(a);
    const normalizedB = this.normalizeSortValue(b);

    if (normalizedA === normalizedB) {
      return 0;
    }

    if (normalizedA === null || normalizedA === undefined || normalizedA === '') {
      return 1;
    }

    if (normalizedB === null || normalizedB === undefined || normalizedB === '') {
      return -1;
    }

    if (typeof normalizedA === 'number' && typeof normalizedB === 'number') {
      return normalizedA - normalizedB;
    }

    return String(normalizedA).localeCompare(String(normalizedB), 'pt-BR', {
      numeric: true,
      sensitivity: 'base',
    });
  }

  private normalizeSortValue(value: any): any {
    if (value instanceof Date) {
      return value.getTime();
    }

    if (typeof value === 'string') {
      const timestamp = Date.parse(value);
      if (!Number.isNaN(timestamp) && /\d{4}-\d{2}-\d{2}|T\d{2}:\d{2}/.test(value)) {
        return timestamp;
      }

      const number = Number(value.replace(',', '.'));
      if (!Number.isNaN(number) && value.trim() !== '') {
        return number;
      }

      return value;
    }

    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.formatStatus(item)).join(', ');
    }

    if (typeof value === 'object' && value !== null) {
      return value.nome || JSON.stringify(value);
    }

    return value;
  }
}
