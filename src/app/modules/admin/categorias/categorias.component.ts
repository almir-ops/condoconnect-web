import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal } from '@ionic/angular';
import { TableComponent } from '../../../shared/components/table/table.component';
import { AlertService } from '../../../shared/components/dialog/alert.service';
import { CategoryService } from '../../../shared/services/category/category.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [TableComponent,IonicModule,FormsModule, CommonModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent  implements OnInit {

  columns = ['nome', 'descricao', 'createdAt'];
  data = [];
  @ViewChild('modalAdicionaCategorias', { static: false, read: IonModal }) modalAdicionaCategorias!: IonModal;
  isModalOpen = false;
  nomeCategorias = '';
  descricaoCategorias = '';
  caracteresRestantes: number = 150;
  editMode: boolean = false;
  categoriaEditando: any = null;

  constructor(
    private categoriaService: CategoryService,
    private alertService: AlertService
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
    this.setOpen(true);
  };

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  adicionaCategorias() {
    const Categorias = {
      id: undefined,
      nome: this.nomeCategorias,
      descricao: this.descricaoCategorias
    };

    if (!Categorias.nome) {
      this.alertService.presentAlert('Atenção', 'Preencha um nome de Categoria');
      return;
    }

    if (Categorias.descricao.length > 150) {
      this.alertService.presentAlert('Atenção', 'A descrição da categoria deve ter no máximo 150 caracteres.');
      return;
    }

    this.categoriaService.createCategory(Categorias).subscribe({
      next: (value: any) => {
        this.getCategories();
        this.setOpen(false);
      },
    });
  }

  editarCategorias = (categoria:any) => {
    this.editMode = true;
    this.categoriaEditando = categoria;
    this.nomeCategorias = categoria.nome;
    this.descricaoCategorias = categoria.descricao;
    this.setOpen(true);
  }

  editarCategoria() {
    const Categorias = {
      id: this.categoriaEditando.id,
      nome: this.nomeCategorias,
      descricao: this.descricaoCategorias,
    };

    if (!Categorias.nome) {
      this.alertService.presentAlert('Atenção', 'Preencha um nome de Categoria');
      return;
    }

    if (Categorias.descricao.length > 150) {
      this.alertService.presentAlert('Atenção', 'A descrição da categoria deve ter no máximo 150 caracteres.');
      return;
    }

    this.categoriaService.updateCategory(Categorias.id, Categorias).subscribe({
      next: (value: any) => {
        this.getCategories();
        this.setOpen(false);
      },
    });
  }

  excluirCategorias(Categorias: any) {
    this.data = this.data.filter(u => u !== Categorias);
  }

  atualizarContagem() {
    this.caracteresRestantes = 150 - (this.descricaoCategorias ? this.descricaoCategorias.length : 0);
  }
}
