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
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent extends BaseUiComponent {
  @Input() public labelPosition: LabelPosition = 'top';
  @Input() public type?: string;
  @Input() public maxlength?: string | number = 32;
  @Output() public input = new EventEmitter<string>();

  public handleInput(event: Event): void {
    this.handleChange(event);
    this.input.emit(this.value);
  }

  public getType(): string {
    return this.type || 'text';
  }

  public getMaxLength(): string {
    return this.maxlength?.toString() || '';
  }
}
