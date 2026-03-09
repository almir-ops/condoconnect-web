import { Component } from '@angular/core';
import { CompaniesService } from '../../../shared/services/companies/companies.service';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss',
})
export class EmpresasComponent {
  columns = ['nome', 'telefone', 'condominios', 'email', 'usuario', 'ativo'];
  data = [];

  constructor(private empresaService: CompaniesService) {}

  ngOnInit(): void {
    this.getCondominios();
  }

  getCondominios() {
    this.empresaService.getAll().subscribe({
      next: (value: any) => {
        console.log(value);
        this.data = value;
      },
    });
  }

  handleButtonClick() {
    console.log('Botão clicado! Executando ação externa...');
    // Aqui pode chamar qualquer lógica necessária
  }

  toggleEmpresaStatus(item: any) {
    const payload = {
      ...item,
      ativo: !item.ativo,
    };

    this.empresaService.update(item.id, payload).subscribe({
      next: (resp) => {
        item.ativo = payload.ativo;
      },
      error: (err) => {
        console.error('Erro ao alterar status da empresa:', err);
        alert('Erro ao alterar status da empresa.');
      },
    });
  }

  getStatusLabel(ativo: boolean): string {
    return ativo ? 'Ativa' : 'Inativa';
  }
}
