import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAdicionaCidadeComponent } from './dialog-adiciona-cidade.component';

describe('DialogAdicionaCidadeComponent', () => {
  let component: DialogAdicionaCidadeComponent;
  let fixture: ComponentFixture<DialogAdicionaCidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAdicionaCidadeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAdicionaCidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
