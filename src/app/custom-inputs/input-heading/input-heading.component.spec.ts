import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputHeadingComponent } from './input-heading.component';

describe('InputHeadingComponent', () => {
  let component: InputHeadingComponent;
  let fixture: ComponentFixture<InputHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputHeadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
