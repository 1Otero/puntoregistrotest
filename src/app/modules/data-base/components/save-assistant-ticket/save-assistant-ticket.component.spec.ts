import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAssistantTicketComponent } from './save-assistant-ticket.component';

describe('SaveAssistantTicketComponent', () => {
  let component: SaveAssistantTicketComponent;
  let fixture: ComponentFixture<SaveAssistantTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveAssistantTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveAssistantTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
