import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEmpresaComponent } from './modal-empresa.component';

describe('ModalEmpresaComponent', () => {
  let component: ModalEmpresaComponent;
  let fixture: ComponentFixture<ModalEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
