import { Component } from '@angular/core';
import { SubcategoriaModalComponent } from '../../../shared/components/subcategoria-modal/subcategoria-modal.component';
import { PlanoService } from '../../../shared/services/planos/plano.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../shared/components/table/table.component';
import { UsersService } from '../../../shared/services/usuarios/users.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TableComponent, FormsModule, CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

    columns = ['nome','email', 'tipo', 'createdAt'];
    data = [];
    categorias: any[] = [];

    constructor(
      private usuarioService: UsersService,
      private dialog: MatDialog
    ) {}

  ngOnInit() {
    this.getSubcategories();
  }

  getSubcategories() {
    this.usuarioService.getAllUsers().subscribe({
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

  }

  editarSubCategorias(){}

  excluirSubCategorias(){}
}
