import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListErrorInitialChargeComponent } from './list-error-initial-charge.component';

describe('ListErrorInitialChargeComponent', () => {
  let component: ListErrorInitialChargeComponent;
  let fixture: ComponentFixture<ListErrorInitialChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListErrorInitialChargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListErrorInitialChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
