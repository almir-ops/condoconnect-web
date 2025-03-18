import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCondominioComponent } from './modal-condominio.component';

describe('ModalCondominioComponent', () => {
  let component: ModalCondominioComponent;
  let fixture: ComponentFixture<ModalCondominioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCondominioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCondominioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
