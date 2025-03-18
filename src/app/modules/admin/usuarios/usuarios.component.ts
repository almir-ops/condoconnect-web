import { Component } from '@angular/core';
import { SubcategoriaModalComponent } from '../../../shared/components/modais/subcategoria-modal/subcategoria-modal.component';
import { PlanoService } from '../../../shared/services/planos/plano.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../shared/components/table/table.component';
import { UsersService } from '../../../shared/services/usuarios/users.service';
import { ModalUsuarioComponent } from '../../../shared/components/modais/modal-usuario/modal-usuario.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TableComponent, FormsModule, CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

    columns = ['nome', 'email', 'telefone', 'tipo', 'status', 'createdAt'];
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
  handleButtonClick = () => {
    this.abrirModalAdicionar();
  };

  abrirModalAdicionar() {
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: '400px',

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adicionaUsuario(result);
      }
    });
  }

  adicionaUsuario(subcategoria: any) {

  }

  editarUsuario(){}

  desativarUsuario(){}
}
