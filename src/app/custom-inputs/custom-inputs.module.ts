import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CheckInputComponent } from './check-input/check-input.component';
import { DateInputComponent } from './date-input/date-input.component';
import { InputHeadingComponent } from './input-heading/input-heading.component';
import { NumberInputComponent } from './number-input/number-input.component';
import { ReadonlyInputComponent } from './readonly-input/readonly-input.component';
import { SelectInputComponent } from './select-input/select-input.component';
import { TextAreaInputComponent } from './text-area-input/text-area-input.component';
import { TextInputComponent } from './text-input/text-input.component';

@NgModule({
  declarations: [
    TextInputComponent,
    InputHeadingComponent,
    NumberInputComponent,
    SelectInputComponent,
    TextAreaInputComponent,
    CheckInputComponent,
    ReadonlyInputComponent,
    DateInputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatTooltipModule,
    MatMenuModule,
    // NgSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  exports: [
    InputHeadingComponent,
    TextInputComponent,
    NumberInputComponent,
    SelectInputComponent,
    TextAreaInputComponent,
    CheckInputComponent,
    DateInputComponent,
  ],
})
export class CustomInputsModule {}
