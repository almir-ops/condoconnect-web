import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CategoriasComponent } from './categorias.component';

describe('CategoriasComponent', () => {
  let component: CategoriasComponent;
  let fixture: ComponentFixture<CategoriasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriasComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
