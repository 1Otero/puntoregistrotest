import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoVariableComponent } from './info-variable.component';

describe('InfoVariableComponent', () => {
  let component: InfoVariableComponent;
  let fixture: ComponentFixture<InfoVariableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoVariableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
