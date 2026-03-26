import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subcategoria-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subcategoria-modal.component.html',
  styleUrls: ['./subcategoria-modal.component.scss'],
})
export class SubcategoriaModalComponent implements OnInit {
  nomeSubcategoria = '';
  categoriaSelecionada: any = null;
  categorias: any[] = [];
  isEdit = false;

  constructor(
    private dialogRef: MatDialogRef<SubcategoriaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.categorias = this.data?.categorias || [];
    this.isEdit = !!this.data?.subcategoria;

    if (this.isEdit && this.data?.subcategoria) {
      this.nomeSubcategoria = this.data.subcategoria.nome || '';

      const categoriaId =
        this.data.subcategoria.categoria_id ??
        this.data.subcategoria.categoria?.id;

      this.categoriaSelecionada =
        this.categorias.find((cat) => String(cat.id) === String(categoriaId)) ||
        null;
    }
  }

  fechar(): void {
    this.dialogRef.close();
  }

  adicionar(): void {
    if (!this.nomeSubcategoria?.trim() || !this.categoriaSelecionada) {
      return;
    }

    const payload = {
      id: this.isEdit ? String(this.data.subcategoria.id) : undefined,
      nome: this.nomeSubcategoria.trim(),
      categoria_id: String(this.categoriaSelecionada.id),
    };

    this.dialogRef.close(payload);
  }
}
