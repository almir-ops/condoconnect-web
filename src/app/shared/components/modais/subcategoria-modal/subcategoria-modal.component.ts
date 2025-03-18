import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subcategoria-modal',
  standalone: true,
  templateUrl: './subcategoria-modal.component.html',
  styleUrls: ['./subcategoria-modal.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class SubcategoriaModalComponent {
  nomeSubcategoria: string = '';
  categoriaSelecionada: any;
  categorias: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<SubcategoriaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categorias = data.categorias;
  }

  fechar() {
    this.dialogRef.close();
  }

  adicionar() {
    if (!this.nomeSubcategoria) {
      alert('Preencha um nome para a subcategoria.');
      return;
    }
    if (!this.categoriaSelecionada) {
      alert('Selecione uma categoria.');
      return;
    }

    const subcategoria = {
      nome: this.nomeSubcategoria,
      categoria_id: this.categoriaSelecionada.id,
    };

    this.dialogRef.close(subcategoria);
  }
}
