import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAssistantComponent } from './ticket-assistant.component';

describe('TicketAssistantComponent', () => {
  let component: TicketAssistantComponent;
  let fixture: ComponentFixture<TicketAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketAssistantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
