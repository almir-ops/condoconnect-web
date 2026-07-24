import { Component } from '@angular/core';
import { SubcategoriaModalComponent } from '../../../shared/components/modais/subcategoria-modal/subcategoria-modal.component';
import { PlanoService } from '../../../shared/services/planos/plano.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../shared/components/table/table.component';
import { UsersService } from '../../../shared/services/usuarios/users.service';
import { ModalUsuarioComponent } from '../../../shared/components/modais/modal-usuario/modal-usuario.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { AlertService } from '../../../shared/components/dialog/alert.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [TableComponent, FormsModule, CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

    columns = ['nome', 'email', 'telefone', 'tipo', 'status', 'empresas', 'createdAt'];
    data: any[] = [];
    categorias: any[] = [];
    selectedMetric: { title: string; description: string } | null = null;

    constructor(
      private usuarioService: UsersService,
      private authService: AuthService,
      private dialog: MatDialog,
      private alertService: AlertService
    ) {}

  ngOnInit() {
    this.getUsuarios();
  }

  getUsuarios() {
    this.usuarioService.getAllUsers().subscribe({
      next: (value: any) => {
        this.data = Array.isArray(value) ? value : [];
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
        console.log(result);
        this.adicionaUsuario(result);
      }
    });
  }

  adicionaUsuario(usuario: any) {
    this.usuarioService.register(usuario).subscribe({
      next: (response: any) => {
        this.alertService.presentAlert('Muito bem!', 'Usuário registrado com sucesso.');
      },
      error: (error:any) => {
        console.log(error);


        // Verifica o código de erro HTTP e exibe a mensagem apropriada
        if (error.status === 400) {
          this.alertService.presentAlert('Atenção', error.error.message );
        } else {
          this.alertService.presentAlert('Erro de Comunicação', 'Houve um erro de comunicação, tente novamente.');
        }

        console.error('Erro no registrar', error);
      }
    })
  }

  editarUsuario = (usuario: any) => {
   const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: '400px',
      data: {
        usuario: usuario,
        editMode: true
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.usuarioService.updateUserss(result.id, result).subscribe({
          next: () => {
            this.alertService.presentAlert('Muito bem!', 'Usuário atualizado com sucesso.');
            this.getUsuarios();
          },
          error: (err: any) => {
            console.error('Erro ao atualizar usuário', err);

            if (err.status === 400) {
              this.alertService.presentAlert('Atenção', err.error?.message ?? 'Dados inválidos.');
            } else {
              this.alertService.presentAlert('Erro de Comunicação', 'Não foi possível atualizar o usuário, tente novamente.');
            }
          }
        })
      }
    });
  }

  desativarUsuario(){}

  totalUsuarios(): number {
    return this.data.length;
  }

  totalUsuariosAtivos(): number {
    return this.data.filter((usuario) => this.isUsuarioAtivo(usuario)).length;
  }

  totalUsuariosNovosMesAtual(): number {
    const now = new Date();

    return this.data.filter((usuario) => {
      const createdAt = new Date(usuario?.createdAt);

      return (
        !Number.isNaN(createdAt.getTime()) &&
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      );
    }).length;
  }

  abrirAjudaMetrica(title: string, description: string) {
    this.selectedMetric = { title, description };
  }

  fecharAjudaMetrica() {
    this.selectedMetric = null;
  }

  private isUsuarioAtivo(usuario: any): boolean {
    const status = String(usuario?.status ?? '').toLowerCase();

    return usuario?.ativo === true || status === 'ativo' || status === 'active';
  }
}
