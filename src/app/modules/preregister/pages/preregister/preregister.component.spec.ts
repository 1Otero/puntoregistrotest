import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreregisterComponent } from './preregister.component';

describe('PreregisterComponent', () => {
  let component: PreregisterComponent;
  let fixture: ComponentFixture<PreregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
