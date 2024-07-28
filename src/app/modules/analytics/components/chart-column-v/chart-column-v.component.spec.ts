import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartColumnVComponent } from './chart-column-v.component';

describe('ChartColumnVComponent', () => {
  let component: ChartColumnVComponent;
  let fixture: ComponentFixture<ChartColumnVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartColumnVComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartColumnVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
