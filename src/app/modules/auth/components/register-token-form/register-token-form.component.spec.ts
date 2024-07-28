import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTokenFormComponent } from './register-token-form.component';

describe('RegisterTokenFormComponent', () => {
  let component: RegisterTokenFormComponent;
  let fixture: ComponentFixture<RegisterTokenFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterTokenFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterTokenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
