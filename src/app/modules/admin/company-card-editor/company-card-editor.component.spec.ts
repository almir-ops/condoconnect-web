import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CompanyCardEditorComponent } from './company-card-editor.component';
import { CompaniesService } from '../../../shared/services/companies/companies.service';
import { CondominiosService } from '../../../shared/services/condominios/condominios.service';
import { CategoryService } from '../../../shared/services/category/category.service';
import { SubCategoriesService } from '../../../shared/services/subcategorias/subcategoria.service';

describe('Company card editor', () => {
  let fixture: ComponentFixture<CompanyCardEditorComponent>;
  let editor: CompanyCardEditorComponent;
  let http: HttpTestingController;
  let companies: jasmine.SpyObj<CompaniesService>;
  let dialog: any;
  const original = {
    id: 42, nome: 'Empresa teste', email: 'teste@example.com', ativo: true,
    status: 'ATIVACAO_MANUAL', usuario_id: 'owner', asaas_cliente_id: 'billing',
    avatar: 'https://example.com/original.png',
    condominios: [{id: 1, nome: 'Condomínio teste'}],
    categorias: [{id: 2, nome: 'Serviços'}],
    subCategorias: [{id: 3, nome: 'Consultoria', categoria_id: 2}],
  };

  beforeEach(async () => {
    companies = jasmine.createSpyObj('CompaniesService', ['getById', 'update']);
    companies.getById.and.returnValue(of(original));
    companies.update.and.returnValue(of({ ...original, nome: 'Novo nome' }));
    dialog = { close: jasmine.createSpy('close'), disableClose: false };
    await TestBed.configureTestingModule({
      imports: [CompanyCardEditorComponent, HttpClientTestingModule],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {id: 42}},
        {provide: MatDialogRef, useValue: dialog},
        {provide: CompaniesService, useValue: companies},
        {provide: CondominiosService, useValue: {getAllEstablishments: () => of(original.condominios)}},
        {provide: CategoryService, useValue: {getAllCategories: () => of(original.categorias)}},
        {provide: SubCategoriesService, useValue: {getAllSubCategories: () => of(original.subCategorias)}},
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CompanyCardEditorComponent);
    editor = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });
  afterEach(() => http.verify());
  const form = () => fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

  it('loads the complete company and previews unsaved text without mutating the original', async () => {
    expect(companies.getById).toHaveBeenCalledWith(42);
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#card-nome');
    input.value = 'Novo nome';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.company-card h3').textContent).toContain('Novo nome');
    expect(original.nome).toBe('Empresa teste');
    expect(editor.dirty).toBeTrue();
  });

  it('saves only card fields and relationships without changing activation, ownership or billing', () => {
    editor.model['nome'] = 'Novo nome';
    editor.removeImage('avatar');
    editor.save(form());
    const payload = companies.update.calls.mostRecent().args[1];
    expect(payload.nome).toBe('Novo nome');
    expect(payload.avatar).toBeNull();
    expect(payload.condominios).toEqual([{id: 1}]);
    expect(payload.subcategorias).toEqual([{id: 3}]);
    for (const key of ['ativo', 'status', 'manual_activation', 'usuario_id', 'user_id', 'asaas_cliente_id', 'id']) {
      expect(Object.keys(payload)).not.toContain(key);
    }
    expect(dialog.close).toHaveBeenCalled();
  });

  it('keeps changes and dialog open after a failed save', () => {
    companies.update.and.returnValue(throwError(() => ({error:{message:'E-mail em uso'}})));
    editor.model['nome'] = 'Alterado';
    editor.changed();
    editor.save(form());
    expect(editor.error).toBe('E-mail em uso');
    expect(editor.model['nome']).toBe('Alterado');
    expect(editor.saving).toBeFalse();
    expect(editor.dirty).toBeTrue();
    expect(dialog.close).not.toHaveBeenCalled();
  });

  it('blocks saving during upload and preserves the original image when upload fails', () => {
    const file = new File(['fake image'], 'logo.png', {type:'image/png'});
    editor.upload({target:{files:[file],value:'logo.png'}} as unknown as Event, 'avatar');
    editor.save(form());
    expect(companies.update).not.toHaveBeenCalled();
    const request = http.expectOne(req => req.url.endsWith('/upload'));
    expect(request.request.body.get('file')).toBe(file);
    request.flush({}, {status:500,statusText:'Error'});
    expect(editor.model['avatar']).toBe(original.avatar);
    expect(editor.imageErrors.avatar).toContain('imagem anterior');
    expect(editor.uploading.size).toBe(0);
  });

  it('requires an explicit discard action for unsaved edits', () => {
    editor.changed();
    editor.close();
    expect(editor.discard).toBeTrue();
    expect(dialog.close).not.toHaveBeenCalled();
  });

  it('removes incompatible subcategories when their parent category is removed', () => {
    editor.categoryIds = [];
    editor.categoriesChanged();
    expect(editor.subcategoryIds).toEqual([]);
  });

  it('edits the complement without changing stored address or coordinates', () => {
    editor.model['complemento'] = 'Torre B, sala 12';
    editor.model['latitude'] = 91;
    editor.save(form());
    const payload = companies.update.calls.mostRecent().args[1];
    expect(payload.complemento).toBe('Torre B, sala 12');
    for (const key of ['endereco', 'bairro', 'cidade', 'estado', 'latitude', 'longitude']) {
      expect(Object.keys(payload)).not.toContain(key);
      expect(fixture.nativeElement.querySelector(`#card-${key}`)).toBeNull();
    }
  });

  it('accepts an Instagram handle and saves it as a profile URL', () => {
    editor.model['instagram_url'] = '@nike';
    editor.changed();
    editor.save(form());
    expect(companies.update.calls.mostRecent().args[1].instagram_url)
      .toBe('https://www.instagram.com/nike');
    expect(editor.error).toBe('');
  });

  it('identifies the field when a link is invalid', () => {
    editor.model['instagram_url'] = '@nome inválido';
    editor.changed();
    editor.save(form());
    expect(companies.update).not.toHaveBeenCalled();
    expect(editor.error).toContain('Instagram');
  });
});
