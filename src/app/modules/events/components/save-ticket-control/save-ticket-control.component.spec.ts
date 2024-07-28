import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTicketControlComponent } from './save-ticket-control.component';

describe('SaveTicketControlComponent', () => {
  let component: SaveTicketControlComponent;
  let fixture: ComponentFixture<SaveTicketControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveTicketControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveTicketControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
