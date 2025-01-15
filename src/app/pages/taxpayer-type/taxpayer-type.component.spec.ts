import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxpayerTypeComponent } from './taxpayer-type.component';

describe('TaxpayerTypeComponent', () => {
  let component: TaxpayerTypeComponent;
  let fixture: ComponentFixture<TaxpayerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxpayerTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxpayerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
