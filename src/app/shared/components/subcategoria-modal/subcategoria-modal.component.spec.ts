import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoriaModalComponent } from './subcategoria-modal.component';

describe('SubcategoriaModalComponent', () => {
  let component: SubcategoriaModalComponent;
  let fixture: ComponentFixture<SubcategoriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoriaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubcategoriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
