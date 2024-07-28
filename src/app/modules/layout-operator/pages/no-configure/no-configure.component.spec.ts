import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoConfigureComponent } from './no-configure.component';

describe('NoConfigureComponent', () => {
  let component: NoConfigureComponent;
  let fixture: ComponentFixture<NoConfigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoConfigureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
