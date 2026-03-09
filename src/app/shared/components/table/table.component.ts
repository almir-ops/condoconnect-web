import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
})
export class TableComponent {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Input() btnText1!: string;
  @Input() onButtonClick?: () => void;
  @Input() onEdit?: (row: any) => void;
  @Input() onDelete?: (row: any) => void;
  @Input() onCustomAction?: (row: any) => void;
  @Input() onToggleStatus?: (row: any) => void;

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;

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
    return this.filteredData().slice(startIndex, startIndex + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredData().length / this.pageSize) || 1;
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

  formatStatus(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'Ativo' : 'Inativo';
    }

    if (Array.isArray(value) && value.length > 0) {
      return value[0]?.nome || 'N/A';
    }

    if (typeof value === 'object' && value !== null) {
      return value.nome || 'N/A';
    }

    return value ?? '';
  }

  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
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
}
