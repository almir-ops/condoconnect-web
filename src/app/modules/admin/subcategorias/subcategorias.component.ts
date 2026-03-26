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
  data: any[] = [];
  categorias: any[] = [];

  constructor(
    private subCategoriaService: SubCategoriesService,
    private categoriaService: CategoryService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getCategories();
    this.getSubcategories();
  }

  getSubcategories() {
    this.subCategoriaService.getAllSubCategories().subscribe({
      next: (value: any) => {
        this.data = value;
      },
      error: (err) => {
        console.error('Erro ao buscar subcategorias:', err);
      },
    });
  }

  getCategories() {
    this.categoriaService.getAllCategories().subscribe({
      next: (value: any) => {
        this.categorias = value;
      },
      error: (err) => {
        console.error('Erro ao buscar categorias:', err);
      },
    });
  }

  handleButtonClick = () => {
    this.abrirModalAdicionar();
  };

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
      error: (err) => {
        console.error('Erro ao adicionar subcategoria:', err);
      },
    });
  }

  editarSubCategorias = (row: any) => {
    const dialogRef = this.dialog.open(SubcategoriaModalComponent, {
      width: '400px',
      data: {
        categorias: this.categorias,
        subcategoria: row,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.atualizarSubCategoria(result.id, result);
      }
    });
  };

  atualizarSubCategoria(id: string | number, payload: any) {
    const body = {
      nome: payload.nome,
      categoria_id: payload.categoria_id,
    };

    this.subCategoriaService.updateSubCategories(Number(id), body).subscribe({
      next: () => {
        this.getSubcategories();
      },
      error: (err) => {
        console.error('Erro ao atualizar subcategoria:', err);
      },
    });
  }

  excluirSubCategorias = (row: any) => {
    const confirmar = window.confirm(
      `Deseja realmente excluir a subcategoria "${row.nome}"?`,
    );

    if (!confirmar) return;

    this.subCategoriaService.deleteSubCategories(row.id).subscribe({
      next: () => {
        this.getSubcategories();
      },
      error: (err) => {
        console.error('Erro ao excluir subcategoria:', err);
      },
    });
  };
}
