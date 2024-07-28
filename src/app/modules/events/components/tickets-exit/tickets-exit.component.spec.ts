import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsExitComponent } from './tickets-exit.component';

describe('TicketsExitComponent', () => {
  let component: TicketsExitComponent;
  let fixture: ComponentFixture<TicketsExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsExitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
