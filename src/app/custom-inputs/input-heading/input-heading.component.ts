import { Component, Input } from '@angular/core';
import { LabelPosition, CheckboxLabelPosition } from '../input-options';

@Component({
  selector: 'app-input-heading',
  templateUrl: './input-heading.component.html',
  styleUrls: ['./input-heading.component.scss'],
})
export class InputHeadingComponent {
  @Input() public labelFor?: string;
  @Input() public heading?: string;
  @Input() public labelPosition: LabelPosition | CheckboxLabelPosition = 'top';
  @Input() public labelWidth?: string;
  @Input() public required: boolean | (() => boolean) = false;
  @Input() public readonly: boolean | (() => boolean) = false;

  public isRequired(): boolean {
    if (typeof this.required == 'boolean') {
      return this.required;
    } else {
      return this.required();
    }
  }

  public isReadonly(): boolean {
    if (typeof this.readonly == 'boolean') {
      return this.readonly;
    } else {
      return this.readonly();
    }
  }

  public getLabelWidthSyle(): string | undefined {
    return this.labelWidth;
  }
}
