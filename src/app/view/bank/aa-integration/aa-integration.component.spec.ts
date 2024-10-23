import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AaIntegrationComponent } from './aa-integration.component';

describe('AaIntegrationComponent', () => {
  let component: AaIntegrationComponent;
  let fixture: ComponentFixture<AaIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AaIntegrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AaIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
