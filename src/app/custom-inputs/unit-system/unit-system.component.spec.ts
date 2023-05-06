import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSystemComponent } from './unit-system.component';

describe('UnitSystemComponent', () => {
  let component: UnitSystemComponent;
  let fixture: ComponentFixture<UnitSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitSystemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
