import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDataBaseComponent } from './ticket-data-base.component';

describe('TicketDataBaseComponent', () => {
  let component: TicketDataBaseComponent;
  let fixture: ComponentFixture<TicketDataBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketDataBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketDataBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
