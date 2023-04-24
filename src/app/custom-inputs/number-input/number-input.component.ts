import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseUiComponent } from '../base-ui-component';
import { LabelPosition } from '../input-options';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
})
export class NumberInputComponent extends BaseUiComponent implements OnInit {
  @Input() public labelPosition: LabelPosition = 'left';
  @Input() public isPositive: boolean = false;
  @Input() public isInteger: boolean = false;
  @Input() public numDigits?: number;
  @Output() public input = new EventEmitter<string>();

  ngOnInit(): void {
    if (this.value === undefined) {
      this.value = 0;
    }
  }

  public handleInput(event: Event): void {
    this.errors = [];

    this.handleChange(event);
    this.input.emit(this.value);
  }

  public getMin(): string {
    return this.isPositive ? '1' : '';
  }

  public getMax(): string {
    if (this.numDigits) {
      return '9'.repeat(this.numDigits);
    }
    return '';
  }

  public getStyle(forWrap: boolean): Record<string, string> {
    if (this.numDigits) {
      const test = {
        ...this.style,
        width: `${this.numDigits + (forWrap ? 2 : 1)}em`,
        'padding-right': '0px',
        flex: 'none',
      };
      return test;
    }
    return this.style;
  }
}
