import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitRegisterComponent } from './exit-register.component';

describe('ExitRegisterComponent', () => {
  let component: ExitRegisterComponent;
  let fixture: ComponentFixture<ExitRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
