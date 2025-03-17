import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubcategoriasComponent } from './subcategorias.component';

describe('SubcategoriasComponent', () => {
  let component: SubcategoriasComponent;
  let fixture: ComponentFixture<SubcategoriasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcategoriasComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubcategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
