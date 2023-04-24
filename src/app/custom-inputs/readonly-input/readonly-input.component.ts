import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-readonly-input',
  templateUrl: './readonly-input.component.html',
  styleUrls: ['./readonly-input.component.scss'],
})
export class ReadonlyInputComponent {
  @Input() value?: string | Date;
  @Input() public style: Record<string, string> = {};

  public getDisplayValue(): string {
    if (this.value === undefined) {
      return '';
    } else if (this.value instanceof Date) {
      const month = String(this.value.getMonth() + 1).padStart(2, '0');
      const day = String(this.value.getDate()).padStart(2, '0');
      const year = this.value.getFullYear();
      return `${month}/${day}/${year}`;
    }

    return this.value;
  }
}
