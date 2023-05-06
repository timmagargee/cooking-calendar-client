import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseUiComponent } from '../base-ui-component';

@Component({
  selector: 'app-unit-system',
  templateUrl: './unit-system.component.html',
  styleUrls: ['./unit-system.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UnitSystemComponent),
      multi: true,
    },
  ],
})
export class UnitSystemComponent extends BaseUiComponent {
  @Input() public disableUnselected: boolean = false;
}
