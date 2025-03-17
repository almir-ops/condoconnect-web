import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CidadeService } from '../../../shared/services/cidades/cidades.service';
import { CommonModule } from '@angular/common';
import { DialogAdicionaCidadeComponent } from '../../../shared/components/dialog-adiciona-cidade/dialog-adiciona-cidade.component';

@Component({
  selector: 'app-cidades',
  standalone: true,
  imports: [TableComponent, CommonModule],
  templateUrl: './cidades.component.html',
  styleUrl: './cidades.component.scss'
})
export class CidadesComponent {

  columns = ['nome', 'createdAt'];
  data = [];

  constructor(
    private cidadeService: CidadeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCidades();
  }

  getCidades() {
    this.cidadeService.getAllCidades().subscribe({
      next: (value: any) => {
        this.data = value;
      },
    });
  }

  handleButtonClick = () => {
    const dialogRef = this.dialog.open(DialogAdicionaCidadeComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((nomeCidade: string) => {
      if (nomeCidade) {
        this.adicionaCidade(nomeCidade);
      }
    });
  };

  adicionaCidade(nomeCidade: string) {
    if (!nomeCidade.trim()) {
      return;
    }

    const cidade = { nome: nomeCidade };
    this.cidadeService.createCidades(cidade).subscribe({
      next: () => {
        this.getCidades();
      },
    });
  }

  editarCidade(cidade: any) {
    console.log('Editando cidade:', cidade);
  }

  excluirCidade(cidade: any) {
    console.log('Excluindo cidade:', cidade);
    this.data = this.data.filter(u => u !== cidade);
  }
}
