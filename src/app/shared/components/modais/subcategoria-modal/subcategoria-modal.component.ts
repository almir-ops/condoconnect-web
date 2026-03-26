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
        this.data.subcategoria.categoriaId ??
        this.data.subcategoria.categoria?.id;

      this.categoriaSelecionada =
        this.categorias.find((cat) => cat.id === categoriaId) || null;
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
      nome: this.nomeSubcategoria.trim(),
      categoriaId: this.categoriaSelecionada.id,
    };

    if (this.isEdit) {
      this.dialogRef.close({
        ...payload,
        id: this.data.subcategoria.id,
      });
      return;
    }

    this.dialogRef.close(payload);
  }
}
