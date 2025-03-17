import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../shared/components/table/table.component';
import { AlertService } from '../../../shared/components/dialog/alert.service';
import { CategoryService } from '../../../shared/services/category/category.service';
import { CategoriaDialogComponent } from '../../../shared/components/categoria-dialog/categoria-dialog.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [TableComponent, FormsModule, CommonModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {
  columns = ['nome', 'descricao', 'createdAt'];
  data = [];

  constructor(
    private categoriaService: CategoryService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.categoriaService.getAllCategories().subscribe({
      next: (value: any) => {
        this.data = value;
      },
    });
  }

  handleButtonClick = () => {
    this.abrirModal();
  };

  abrirModal(editMode: boolean = false, categoria: any = null) {
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      width: '400px',
      data: {
        editMode,
        nomeCategorias: categoria ? categoria.nome : '',
        descricaoCategorias: categoria ? categoria.descricao : '',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.editMode) {
          this.editarCategoria(categoria.id, result);
        } else {
          this.adicionaCategorias(result);
        }
      }
    });
  }

  adicionaCategorias(dados: any) {
    const novaCategoria = {
      id: undefined,
      nome: dados.nomeCategorias,
      descricao: dados.descricaoCategorias
    };

    this.categoriaService.createCategory(novaCategoria).subscribe({
      next: () => this.getCategories(),
    });
  }

  editarCategorias = (categoria: any) => {
    this.abrirModal(true, categoria);
  };

  editarCategoria(id: number, dados: any) {
    const categoriaAtualizada = {
      id,
      nome: dados.nomeCategorias,
      descricao: dados.descricaoCategorias
    };

    this.categoriaService.updateCategory(id, categoriaAtualizada).subscribe({
      next: () => this.getCategories(),
    });
  }

  excluirCategorias(Categorias: any) {
    this.data = this.data.filter(u => u !== Categorias);
  }
}
