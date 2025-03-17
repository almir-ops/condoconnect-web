import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../shared/components/table/table.component';
import { PlanoService } from '../../../shared/services/planos/plano.service';
import { MatDialog } from '@angular/material/dialog';
import { SubcategoriaModalComponent } from '../../../shared/components/subcategoria-modal/subcategoria-modal.component';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [TableComponent, FormsModule, CommonModule],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss'
})
export class PlanosComponent {

    columns = ['nome', 'valor', 'createdAt'];
    data = [];
    categorias: any[] = [];

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


  abrirModalAdicionar() {
    const dialogRef = this.dialog.open(SubcategoriaModalComponent, {
      width: '400px',
      data: { categorias: this.categorias },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adicionaSubCategoria(result);
      }
    });
  }

  adicionaSubCategoria(subcategoria: any) {
    this.planoService.createPlanos(subcategoria).subscribe({
      next: () => {
        this.getSubcategories();
      },
    });
  }

  editarSubCategorias(){}

  excluirSubCategorias(){}
}
