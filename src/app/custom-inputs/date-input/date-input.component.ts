import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { BaseUiComponent } from '../base-ui-component';
import { LabelPosition } from '../input-options';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
  ],
})
export class DateInputComponent extends BaseUiComponent {
  @Input() public labelPosition: LabelPosition = 'top';
  @Input() public pickerOnly: boolean = false;
  @Output() public input = new EventEmitter<Date>();
  @Output() public isValidDate = new EventEmitter<boolean>();

  public faCalendarCheck = faCalendar;
  public toggleDatePicker = false;

  public handleDateInput(): void {
    this.validDate(this.value);
    this.input.emit(this.value);
    this.handleChange();
  }

  public handleDateChange(): void {
    this.validDate(this.value);
    this.handleChange();
  }

  public keyPressOnlyNumbersSlash(event: any): boolean {
    let charCode = event.which ? event.which : event.keyCode;
    //Only Numbers 0-9 and forward slash
    if (charCode < 47 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  public preventPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }

  private validDate(date: Date): void {
    if (!date) {
      this.isValidDate.emit(false);
    } else {
      this.isValidDate.emit(true);
    }
  }
}
