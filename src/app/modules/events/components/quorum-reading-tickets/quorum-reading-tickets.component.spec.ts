import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuorumReadingTicketsComponent } from './quorum-reading-tickets.component';

describe('QuorumReadingTicketsComponent', () => {
  let component: QuorumReadingTicketsComponent;
  let fixture: ComponentFixture<QuorumReadingTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuorumReadingTicketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuorumReadingTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
