import { Component, Input, OnDestroy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BaseUiComponent } from '../base-ui-component';
import { LabelPosition } from '../input-options';
import { SelectOption } from '../models/select-option';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true,
    },
  ],
})
export class SelectInputComponent extends BaseUiComponent implements OnDestroy {
  @Input() public labelPosition: LabelPosition = 'top';
  @Input() public set options(
    data: Array<SelectOption> | Observable<Array<SelectOption>>
  ) {
    if (data instanceof Observable) {
      data
        .pipe(takeUntil(this.destroy))
        .subscribe((options) => (this.selectOptions = options));
    } else if (Array.isArray(data)) {
      this.selectOptions = data;
    } else {
      throw 'Unknown options type';
    }
  }
  private destroy = new Subject<void>();
  public selectOptions: Array<SelectOption> = [];

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  public getReadOnlyValue(): string {
    if (this.selectOptions && this.selectOptions.length > 0) {
      const data = this.selectOptions.find((x) => x.value === this.value);
      if (data) {
        return data.label || data.label;
      }
    }

    return '';
  }

  public trackSelect(index: number, option: SelectOption): any {
    return option.value ? option.value : option.label;
  }
}
