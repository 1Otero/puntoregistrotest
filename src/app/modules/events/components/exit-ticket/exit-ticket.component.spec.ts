import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitTicketComponent } from './exit-ticket.component';

describe('ExitTicketComponent', () => {
  let component: ExitTicketComponent;
  let fixture: ComponentFixture<ExitTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
