import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankOffersComponent } from './bank-offers.component';

describe('BankOffersComponent', () => {
  let component: BankOffersComponent;
  let fixture: ComponentFixture<BankOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankOffersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
