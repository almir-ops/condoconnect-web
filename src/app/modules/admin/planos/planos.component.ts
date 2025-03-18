import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../shared/components/table/table.component';
import { PlanoService } from '../../../shared/services/planos/plano.service';
import { MatDialog } from '@angular/material/dialog';
import { SubcategoriaModalComponent } from '../../../shared/components/modais/subcategoria-modal/subcategoria-modal.component';
import { ModalPlanoComponent } from '../../../shared/components/modais/modal-plano/modal-plano.component';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [TableComponent, FormsModule, CommonModule],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss'
})
export class PlanosComponent {

    columns = ['nome', 'valor', 'descricao', 'createdAt'];
    data = [];
    categorias: any[] = [];
    plano:any;

    constructor(
      private planoService: PlanoService,
      private dialog: MatDialog
    ) {}

  ngOnInit() {
    this.getSubcategories();
  }

  getSubcategories() {
    this.planoService.getAllPlanos().subscribe({
      next: (value: any) => {
        this.data = value;
      },
    });
  }

  handleButtonClick = () => {
    this.abrirModalAdicionar();
  };

  abrirModalAdicionar() {
    const dialogRef = this.dialog.open(ModalPlanoComponent, {
      width: '400px',
      data: { plano: this.plano },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adicionaPlano(result);
      }
    });
  }

  adicionaPlano(subcategoria: any) {
    this.planoService.createPlanos(subcategoria).subscribe({
      next: () => {
        this.getSubcategories();
      },
    });
  }

  editarSubCategorias(){}

  excluirSubCategorias(){}
}
