import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveDataEventComponent } from './save-data-event.component';

describe('SaveDataEventComponent', () => {
  let component: SaveDataEventComponent;
  let fixture: ComponentFixture<SaveDataEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveDataEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveDataEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
