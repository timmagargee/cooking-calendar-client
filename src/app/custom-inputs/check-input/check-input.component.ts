import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { BaseUiComponent } from '../base-ui-component';
import { CheckboxLabelPosition } from '../input-options';

@Component({
  selector: 'app-check-input',
  templateUrl: './check-input.component.html',
  styleUrls: ['./check-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckInputComponent),
      multi: true,
    },
  ],
})
export class CheckInputComponent extends BaseUiComponent {
  public faSquare = faSquare;
  public faSquareCheck = faSquareCheck;

  @Input() public labelPosition: CheckboxLabelPosition = 'right';
}
