import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuorumReadingComponent } from './quorum-reading.component';

describe('QuorumReadingComponent', () => {
  let component: QuorumReadingComponent;
  let fixture: ComponentFixture<QuorumReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuorumReadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuorumReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
