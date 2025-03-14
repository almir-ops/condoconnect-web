import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import moment from 'moment';

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

  formatStatus(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'Ativo' : 'Inativo';
    }

    // Verifica se o valor é um objeto e contém a chave desejada
    if (typeof value === 'object' && value !== null) {
      return value.nome || 'N/A'; // Retorna o campo 'nome', ou outro campo desejado
    }
    /*
    // Verifica se o valor é uma data válida antes de tentar formatar
    if (moment(value, moment.ISO_8601, true).isValid()) {
      return moment(value).format('DD/MM/YYYY HH:mm:ss'); // Formato desejado
    }
    */
    return value; // Retorna o valor original caso não seja booleano, objeto ou data
  }


  capitalizeFirstLetter(text: string): string {
    if (!text) return ''; // Caso seja undefined ou vazio, retorna string vazia
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

}
