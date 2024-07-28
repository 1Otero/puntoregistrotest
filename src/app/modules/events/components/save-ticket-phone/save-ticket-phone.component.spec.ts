import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTicketPhoneComponent } from './save-ticket-phone.component';

describe('SaveTicketPhoneComponent', () => {
  let component: SaveTicketPhoneComponent;
  let fixture: ComponentFixture<SaveTicketPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveTicketPhoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveTicketPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
