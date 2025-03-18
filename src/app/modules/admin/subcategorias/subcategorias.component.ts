import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CategoryService } from '../../../shared/services/category/category.service';
import { SubCategoriesService } from '../../../shared/services/subcategorias/subcategoria.service';
import { SubcategoriaModalComponent } from '../../../shared/components/modais/subcategoria-modal/subcategoria-modal.component';

@Component({
  selector: 'app-subcategorias',
  standalone: true,
  imports: [TableComponent, FormsModule, CommonModule],
  templateUrl: './subcategorias.component.html',
  styleUrls: ['./subcategorias.component.scss'],
})
export class SubcategoriasComponent implements OnInit {
  columns = ['nome', 'categoria', 'createdAt'];
  data = [];
  categorias: any[] = [];

  constructor(
    private subCategoriaService: SubCategoriesService,
    private categoriaService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getSubcategories();
    this.getCategories();
  }

  getSubcategories() {
    this.subCategoriaService.getAllSubCategories().subscribe({
      next: (value: any) => {
        this.data = value;
      },
    });
  }

  getCategories() {
    this.categoriaService.getAllCategories().subscribe({
      next: (value: any) => {
        this.categorias = value;
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
    this.subCategoriaService.createSubCategories(subcategoria).subscribe({
      next: () => {
        this.getSubcategories();
      },
    });
  }

  editarSubCategorias(){}

  excluirSubCategorias(){}
}
