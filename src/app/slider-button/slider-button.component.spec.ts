import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SliderButtonComponent } from './slider-button.component';

describe('SliderButtonComponent', () => {
  let component: SliderButtonComponent;
  let fixture: ComponentFixture<SliderButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SliderButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SliderButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
