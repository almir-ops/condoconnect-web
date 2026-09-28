import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { CompaniesService } from '../../../shared/services/companies/companies.service';
import { CondominiosService } from '../../../shared/services/condominios/condominios.service';
import { CategoryService } from '../../../shared/services/category/category.service';
import { SubCategoriesService } from '../../../shared/services/subcategorias/subcategoria.service';
import { environment } from '../../../../environments/environment';
import { CompanyCardPreviewComponent } from './company-card-preview.component';
import { CardMultiselectComponent } from './card-multiselect.component';

type ImageField = 'avatar' | 'banner' | 'banner_anuncio';
interface Option { id: number; nome: string; categoria_id?: number; categoria?: { id: number }; }
interface Field { key: string; label: string; max: number; type?: string; required?: boolean; hint?: string; }

@Component({
  selector: 'app-company-card-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CompanyCardPreviewComponent, CardMultiselectComponent],
  templateUrl: './company-card-editor.component.html',
  styleUrl: './company-card-editor.component.scss',
})
export class CompanyCardEditorComponent implements OnInit, OnDestroy {
  @ViewChild('workspace') workspace?: ElementRef<HTMLElement>;
  loading = true;
  saving = false;
  dirty = false;
  error = '';
  discard = false;
  mobilePreview = false;
  model: Record<string, any> = {};
  condominios: Option[] = [];
  categorias: Option[] = [];
  subcategorias: Option[] = [];
  condoIds: number[] = [];
  categoryIds: number[] = [];
  subcategoryIds: number[] = [];
  uploading = new Set<ImageField>();
  imageErrors: Partial<Record<ImageField, string>> = {};
  imageFailures: Partial<Record<ImageField, string>> = {};
  private destroyed = new Subject<void>();

  readonly images: { key: ImageField; label: string; hint: string }[] = [
    { key: 'banner', label: 'Capa do card', hint: 'Imagem horizontal no topo.' },
    { key: 'avatar', label: 'Logo ou foto', hint: 'Imagem quadrada, exibida em círculo.' },
    { key: 'banner_anuncio', label: 'Anúncio complementar', hint: 'Arte exibida abaixo do card.' },
  ];
  readonly groups: { title: string; fields: Field[] }[] = [
    { title: 'Identidade e apresentação', fields: [
      { key: 'nome', label: 'Nome da empresa', max: 100, required: true },
      { key: 'slogan', label: 'Slogan', max: 100 },
      { key: 'descricao', label: 'Descrição', max: 1000, type: 'textarea' },
    ]},
    { title: 'Contatos', fields: [
      { key: 'email', label: 'E-mail', max: 150, type: 'email', required: true },
      { key: 'telefone', label: 'Telefone', max: 20, type: 'tel' },
      { key: 'celular', label: 'Celular / WhatsApp', max: 20, type: 'tel' },
      { key: 'cnpj', label: 'CPF / CNPJ', max: 20 },
    ]},
    { title: 'Local no condomínio', fields: [
      { key: 'complemento', label: 'Sala, andar ou complemento', max: 255 },
    ]},
    { title: 'Site e redes sociais', fields: [
      { key: 'site_url', label: 'Site', max: 255, hint: 'https://suaempresa.com.br' },
      { key: 'facebook_url', label: 'Facebook', max: 255, hint: 'Link completo do perfil.' },
      { key: 'instagram_url', label: 'Instagram', max: 255, hint: '@usuario ou link completo do perfil.' },
      { key: 'youtube_url', label: 'YouTube', max: 255, hint: 'Link completo do canal.' },
    ]},
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    public dialog: MatDialogRef<CompanyCardEditorComponent>,
    private companies: CompaniesService,
    private condos: CondominiosService,
    private categories: CategoryService,
    private subcategories: SubCategoriesService,
    private http: HttpClient,
  ) { this.dialog.disableClose = true; }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      company: this.companies.getById(this.data.id),
      condos: this.condos.getAllEstablishments(),
      categories: this.categories.getAllCategories(),
      subcategories: this.subcategories.getAllSubCategories(),
    }).pipe(takeUntil(this.destroyed)).subscribe({
      next: ({ company, condos, categories, subcategories }) => {
        this.model = { ...company };
        this.condominios = this.mergeOptions(condos, company.condominios);
        this.categorias = this.mergeOptions(categories, company.categorias);
        this.subcategorias = this.mergeOptions(subcategories, company.subCategorias);
        this.condoIds = this.ids(company.condominios);
        this.categoryIds = this.ids(company.categorias);
        this.subcategoryIds = this.ids(company.subCategorias);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Não foi possível carregar o card. Tente novamente.';
      },
    });
  }

  private ids(options: any): number[] {
    return Array.isArray(options) ? options.map((o: Option) => Number(o.id)) : [];
  }

  private mergeOptions(options: any, existing: any): Option[] {
    return [...new Map([...(Array.isArray(existing) ? existing : []),
      ...(Array.isArray(options) ? options : [])].map(o => [Number(o.id), { ...o, id: Number(o.id) }])).values()];
  }

  get visibleSubcategories(): Option[] {
    return this.subcategorias.filter(s => this.categoryIds.includes(Number(s.categoria_id ?? s.categoria?.id)));
  }

  get condoNames(): string {
    return this.condominios.filter(c => this.condoIds.includes(c.id)).map(c => c.nome).join(' • ');
  }

  changed(): void { this.dirty = true; this.discard = false; this.error = ''; }

  showPreview(preview: boolean): void {
    this.mobilePreview = preview;
    if (this.workspace) this.workspace.nativeElement.scrollTop = 0;
  }

  categoriesChanged(): void {
    this.subcategoryIds = this.subcategoryIds.filter(id => this.visibleSubcategories.some(s => s.id === id));
    this.changed();
  }

  imageSource(field: ImageField): string | null {
    const value = String(this.model[field] || '').trim();
    return /^https?:\/\//i.test(value) && this.imageFailures[field] !== value ? value : null;
  }

  imageFailed(field: ImageField): void { this.imageFailures[field] = String(this.model[field] || '').trim(); }

  removeImage(field: ImageField): void {
    this.model[field] = null;
    delete this.imageErrors[field];
    this.changed();
  }

  upload(event: Event, field: ImageField): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || this.saving || this.uploading.has(field)) return;
    delete this.imageErrors[field];
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      this.imageErrors[field] = 'Escolha uma imagem JPG, PNG ou WebP de até 5 MB.';
      return;
    }
    this.uploading.add(field);
    const body = new FormData();
    body.append('file', file);
    this.http.post<{ imageUrl: string }>(environment.apiUrl + 'upload', body)
      .pipe(takeUntil(this.destroyed)).subscribe({
        next: response => {
          this.uploading.delete(field);
          if (!/^https?:\/\//i.test(response.imageUrl || '')) {
            this.imageErrors[field] = 'O servidor não retornou uma imagem válida.';
            return;
          }
          this.model[field] = response.imageUrl;
          delete this.imageFailures[field];
          this.changed();
        },
        error: () => {
          this.uploading.delete(field);
          this.imageErrors[field] = 'Falha no envio. A imagem anterior foi mantida. Tente novamente.';
        },
      });
  }

  buildPayload(): Record<string, any> {
    const payload: Record<string, any> = {};
    for (const field of this.groups.flatMap(g => g.fields)) {
      const value = this.model[field.key];
      payload[field.key] = value === null || value === undefined || String(value).trim() === ''
        ? null : field.type === 'number' ? Number(value) : String(value).trim();
      if (field.key === 'instagram_url' && /^@[a-z\d._]+$/i.test(payload[field.key] || '')) {
        payload[field.key] = 'https://www.instagram.com/' + payload[field.key].slice(1);
      } else if (field.key.endsWith('_url') && payload[field.key] && !/^https?:\/\//i.test(payload[field.key])) {
        payload[field.key] = 'https://' + payload[field.key];
      }
    }
    for (const { key } of this.images) payload[key] = String(this.model[key] || '').trim() || null;
    payload['condominios'] = this.condoIds.map(id => ({ id }));
    payload['categorias'] = this.categoryIds.map(id => ({ id }));
    payload['subcategorias'] = this.subcategoryIds.map(id => ({ id }));
    return payload;
  }

  save(form: NgForm): void {
    if (this.loading || this.saving || this.uploading.size || !this.model['id']) return;
    form.control.markAllAsTouched();
    if (form.invalid || !String(this.model['nome'] || '').trim() || !String(this.model['email'] || '').trim()) {
      this.error = 'Confira os campos obrigatórios e os valores informados.';
      this.mobilePreview = false;
      return;
    }
    const payload = this.buildPayload();
    for (const field of [...this.images.map(i => i.key), 'site_url', 'facebook_url', 'instagram_url', 'youtube_url']) {
      if (payload[field]) {
        try {
          const url = new URL(payload[field]);
          if (!['https:', 'http:'].includes(url.protocol) || !url.hostname.includes('.')) throw new Error();
        } catch {
          const label = this.images.find(image => image.key === field)?.label
            || this.groups.flatMap(group => group.fields).find(item => item.key === field)?.label || field;
          this.error = `Confira o campo ${label}: informe um link válido${field === 'instagram_url' ? ' ou um @usuário' : ''}.`;
          this.mobilePreview = false;
          return;
        }
      }
    }
    this.saving = true;
    this.error = '';
    this.companies.update(this.data.id, payload).pipe(takeUntil(this.destroyed)).subscribe({
      next: result => { this.saving = false; this.dirty = false; this.dialog.close(result); },
      error: err => {
        this.saving = false;
        const fields = err.error?.errors;
        this.error = fields && typeof fields === 'object'
          ? Object.values(fields).join(' ')
          : err.error?.detail || err.error?.message || 'Não foi possível salvar. Suas alterações foram mantidas.';
      },
    });
  }

  @HostListener('keydown.escape')
  close(): void {
    if (this.saving || this.uploading.size) return;
    if (this.dirty) this.discard = true;
    else this.dialog.close();
  }

  ngOnDestroy(): void { this.destroyed.next(); this.destroyed.complete(); }
}
