import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTicketComponent } from './save-ticket.component';

describe('SaveTicketComponent', () => {
  let component: SaveTicketComponent;
  let fixture: ComponentFixture<SaveTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
