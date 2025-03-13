import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CondominiosService } from '../../../shared/services/condominios/condominios.service';

@Component({
  selector: 'app-condominios',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './condominios.component.html',
  styleUrl: './condominios.component.scss'
})
export class CondominiosComponent implements OnInit {

  columns = ['nome', 'telefone','endereco', 'cidade', 'estado', 'esta_ativo' ];
  data = [];

  constructor(
    private condominiosService:CondominiosService
  ){

  }

  ngOnInit(): void {
    this.getCondominios()
  }

  getCondominios(){
    this.condominiosService.getAllEstablishments().subscribe({
      next:(value:any)=> {
        console.log(value);
        this.data = value
      },
    })
  }

  handleButtonClick() {
    console.log('Botão clicado! Executando ação externa...');
    // Aqui pode chamar qualquer lógica necessária
  }
}
