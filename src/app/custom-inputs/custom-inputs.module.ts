import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputHeadingComponent } from './input-heading/input-heading.component';
import { TextInputComponent } from './text-input/text-input.component';

@NgModule({
  declarations: [TextInputComponent, InputHeadingComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatTooltipModule,
    MatMenuModule,
    // NgSelectModule,
    // MatDatepickerModule,
    // MatNativeDateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  exports: [TextInputComponent],
})
export class CustomInputsModule {}
