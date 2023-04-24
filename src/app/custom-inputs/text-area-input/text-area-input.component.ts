import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseUiComponent } from '../base-ui-component';
import { LabelPosition } from '../input-options';

@Component({
  selector: 'app-text-area-input',
  templateUrl: './text-area-input.component.html',
  styleUrls: ['./text-area-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaInputComponent),
      multi: true,
    },
  ],
})
export class TextAreaInputComponent extends BaseUiComponent {
  @Input() public labelPosition: LabelPosition = 'top';
  @Input() public rows: string = '5';
  @Input() public maxlength?: string | number = 4000;
  @Output() public input = new EventEmitter<string>();

  public handleInput(event: Event): void {
    this.handleChange(event);
    this.input.emit(this.value);
  }

  public getMaxLength(): string {
    return this.maxlength?.toString() || '';
  }
}
