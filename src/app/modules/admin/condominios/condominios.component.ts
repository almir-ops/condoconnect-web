import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-condominios',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './condominios.component.html',
  styleUrl: './condominios.component.scss'
})
export class CondominiosComponent {
  columns = ['Nome', 'Idade', 'Cidade'];
  data = [
    { Nome: 'João', Idade: 25, Cidade: 'São Paulo' },
    { Nome: 'Maria', Idade: 30, Cidade: 'Rio de Janeiro' },
    { Nome: 'Pedro', Idade: 22, Cidade: 'Curitiba' },
  ];
}
