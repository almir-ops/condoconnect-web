import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal } from '@ionic/angular';
import { AlertService } from '../../../shared/components/dialog/alert.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CategoryService } from '../../../shared/services/category/category.service';
import { SubCategoriesService } from '../../../shared/services/subcategorias/subcategoria.service';

@Component({
  selector: 'app-subcategorias',
  standalone: true,
  imports: [TableComponent, IonicModule, FormsModule, CommonModule],
  templateUrl: './subcategorias.component.html',
  styleUrls: ['./subcategorias.component.scss'],
})
export class SubcategoriasComponent implements OnInit {

  columns = ['nome', 'categoria', 'createdAt'];
  data = [];
  categorias: any[] = [];

  @ViewChild('modalAdicionaSubcategorias', { static: false, read: IonModal }) modalAdicionaSubcategorias!: IonModal;
  isModalOpen = false;
  nomeSubcategoria = '';
  categoriaSelecionada: any;
  caracteresRestantes: number = 150;

  constructor(
    private subCategoriaService: SubCategoriesService,
    private categoriaService: CategoryService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.getSubcategories();
    this.getCategories();
  }

  getSubcategories() {
    this.subCategoriaService.getAllSubCategories().subscribe({
      next: (value: any) => {
        console.log(value);
        this.data = value;
      },
    });
  }

  getCategories() {
    this.categoriaService.getAllCategories().subscribe({
      next: (value: any) => {
        console.log(value);

        this.categorias = value;
      },
    });
  }

  handleButtonClick = () => {
    this.setOpen(true);
  };

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  adicionaSubCategorias() {
    if (!this.nomeSubcategoria) {
      this.alertService.presentAlert('Atenção', 'Preencha um nome para a subcategoria.');
      return;
    }
    if (!this.categoriaSelecionada) {
      this.alertService.presentAlert('Atenção', 'Selecione uma categoria.');
      return;
    }

    const subcategoria = {
      id: undefined,
      nome: this.nomeSubcategoria,
      categoria_id: this.categoriaSelecionada.id
    };

    this.subCategoriaService.createSubCategories(subcategoria).subscribe({
      next: () => {
        this.getSubcategories();
        this.setOpen(false);
      },
    });
  }


  editarSubCategorias(){

  }

  excluirSubCategorias(){

  }

  onCategorySelect(event: any) {
    const selectedOptions = event.target.selectedOptions;

    for (let option of selectedOptions) {
      const categoryId = option.value;
      console.log(categoryId);
      console.log(this.categorias);

      // Garantir que tanto o categoryId quanto o id em categoriesList sejam do mesmo tipo
      this.categoriaSelecionada = this.categorias.find((cat) => {
        return Number(cat.id) === Number(categoryId); // Garantindo que ambos sejam números
      });

      console.log(this.categoriaSelecionada );
    }
  }
}
