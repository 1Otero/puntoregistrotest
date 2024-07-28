import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmChargeComponent } from './confirm-charge.component';

describe('ConfirmChargeComponent', () => {
  let component: ConfirmChargeComponent;
  let fixture: ComponentFixture<ConfirmChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmChargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
