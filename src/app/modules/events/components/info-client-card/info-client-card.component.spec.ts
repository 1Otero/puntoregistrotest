import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoClientCardComponent } from './info-client-card.component';

describe('InfoClientCardComponent', () => {
  let component: InfoClientCardComponent;
  let fixture: ComponentFixture<InfoClientCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoClientCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoClientCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
