import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuorumFormComponent } from './quorum-form.component';

describe('QuorumFormComponent', () => {
  let component: QuorumFormComponent;
  let fixture: ComponentFixture<QuorumFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuorumFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuorumFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
