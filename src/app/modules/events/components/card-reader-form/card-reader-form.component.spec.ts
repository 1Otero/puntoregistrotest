import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardReaderFormComponent } from './card-reader-form.component';

describe('CardReaderFormComponent', () => {
  let component: CardReaderFormComponent;
  let fixture: ComponentFixture<CardReaderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardReaderFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardReaderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
