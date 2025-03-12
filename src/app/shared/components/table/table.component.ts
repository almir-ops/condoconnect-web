import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-4 flex justify-between items-center">
      <input
        type="text"
        [(ngModel)]="searchTerm"
        placeholder="Buscar..."
        class="border p-2 w-full rounded-md"
      />
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
        <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th *ngFor="let col of columns" class="py-2 px-4 text-left border-b">
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of paginatedData(); let i = index" [ngClass]="{ 'bg-gray-100': i % 2 === 0, 'bg-white': i % 2 !== 0 }">
            <td *ngFor="let col of columns" class="py-2 px-4 border-b">
              {{ row[col] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-between items-center mt-4">
      <button (click)="prevPage()" [disabled]="currentPage === 1" class="px-4 py-2 bg-gray-300 rounded-md">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages() }}</span>
      <button (click)="nextPage()" [disabled]="currentPage >= totalPages()" class="px-4 py-2 bg-gray-300 rounded-md">Próximo</button>
    </div>
  `,
})
export class TableComponent {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;

  filteredData() {
    return this.data.filter(row =>
      Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  paginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredData().slice(startIndex, startIndex + this.pageSize);
  }

  totalPages() {
    return Math.ceil(this.filteredData().length / this.pageSize);
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
}