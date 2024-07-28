import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartColumAdminComponent } from './chart-colum-admin.component';

describe('ChartColumAdminComponent', () => {
  let component: ChartColumAdminComponent;
  let fixture: ComponentFixture<ChartColumAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartColumAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartColumAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
