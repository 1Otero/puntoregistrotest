import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAssistantComponent } from './save-assistant.component';

describe('SaveAssistantComponent', () => {
  let component: SaveAssistantComponent;
  let fixture: ComponentFixture<SaveAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveAssistantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
