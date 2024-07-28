import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingControlsComponent } from './missing-controls.component';

describe('MissingControlsComponent', () => {
  let component: MissingControlsComponent;
  let fixture: ComponentFixture<MissingControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissingControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissingControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
