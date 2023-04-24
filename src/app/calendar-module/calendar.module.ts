import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from '../shared/shared.module';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { CategoryFormComponent } from './category-form/category-form.component';

@NgModule({
  declarations: [CalendarComponent, CategoryFormComponent],
  imports: [CommonModule, CalendarRoutingModule, SharedModule, MatRadioModule],
})
export class CalendarModule {}
