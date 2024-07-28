import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTicketControlUserComponent } from './save-ticket-control-user.component';

describe('SaveTicketControlUserComponent', () => {
  let component: SaveTicketControlUserComponent;
  let fixture: ComponentFixture<SaveTicketControlUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveTicketControlUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveTicketControlUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
