import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSaveComponent } from './control-save.component';

describe('ControlSaveComponent', () => {
  let component: ControlSaveComponent;
  let fixture: ComponentFixture<ControlSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlSaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
