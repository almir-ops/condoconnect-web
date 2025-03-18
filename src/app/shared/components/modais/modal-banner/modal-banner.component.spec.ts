import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBannerComponent } from './modal-banner.component';

describe('ModalBannerComponent', () => {
  let component: ModalBannerComponent;
  let fixture: ComponentFixture<ModalBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
