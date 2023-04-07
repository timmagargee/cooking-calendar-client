import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import {
  faExclamationCircle,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

@Component({ template: '' })
export abstract class BaseUiComponent implements ControlValueAccessor {
  @Input() public htmlId?: string;
  @Input() public heading?: string;
  @Input() public required: boolean | (() => boolean) = false;
  @Input() public requiredForCalc: boolean | (() => boolean) = false;
  @Input() public disabled: boolean | (() => boolean) = false;
  @Input() public readonly: boolean | (() => boolean) = false;
  @Input() public placeholder?: string;
  @Input() public errors: Array<string> = [];
  @Input() public warnings: Array<string> = [];
  @Input() public isLoading: boolean | (() => boolean) = false;
  @Input() public labelWidth?: string;
  @Output() public change = new EventEmitter<any>();

  public faExclamationTriangle = faExclamationTriangle;
  public faExclamationCircle = faExclamationCircle;

  public value: any = '';

  public constructor() {}

  private onChange: ((value: any) => void) | undefined;
  private onTouched: (() => void) | undefined;

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public handleChange(event?: Event): void {
    if (event && 'stopPropagation' in event) {
      event.stopPropagation();
    }

    if (this.onChange) {
      this.onChange(this.value);
    }

    this.change.emit(this.value);
  }

  public triggerOnTouched(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  public getBorderColor(): string {
    if (this.hasErrors()) {
      return '#e32b24';
    } else if (this.hasWarnings()) {
      return '#F0A92E';
    }

    return '';
  }

  public hasWarnings(): boolean {
    return this.warnings.length > 0;
  }

  public hasErrors(): boolean {
    return this.errors.length > 0;
  }

  public transform(lines: Array<string>): string {
    return lines.map((x) => `• ${x}`).join('\n');
  }

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public isLoadingData(): boolean {
    if (typeof this.isLoading == 'boolean') {
      return this.isLoading;
    } else {
      return this.isLoading();
    }
  }

  public isDisabled(): boolean {
    if (typeof this.disabled == 'boolean') {
      return this.disabled;
    } else {
      return this.disabled();
    }
  }

  public isReadonly(): boolean {
    if (typeof this.readonly == 'boolean') {
      return this.readonly;
    } else {
      return this.readonly();
    }
  }

  // public isDefault(): boolean {
  //   if (typeof this.isDefaultValue == 'boolean') {
  //     return this.isDefaultValue;
  //   } else {
  //     return this.isDefaultValue();
  //   }
  // }

  // public isRequiredForCalc(): boolean {
  //   if (typeof this.requiredForCalc == 'boolean') {
  //     return this.requiredForCalc;
  //   } else {
  //     return this.requiredForCalc();
  //   }
  // }

  // public getBackgroundColor(): string {
  //   if (this.isRequiredForCalc() && this.colorAdapter) {
  //     const bgColor = this.colorAdapter.getRequiredColor();
  //     if (bgColor) {
  //       return bgColor;
  //     }
  //   }

  //   return '';
  // }
}
