import { WeekDay } from '@angular/common';
import { SelectOption } from '../custom-inputs/models/select-option';

export const DayOptions: Array<SelectOption> = [
  { label: 'Sunday', value: WeekDay.Sunday },
  { label: 'Monday', value: WeekDay.Monday },
  { label: 'Tuesday', value: WeekDay.Tuesday },
  { label: 'Wednesday', value: WeekDay.Wednesday },
  { label: 'Thursday', value: WeekDay.Thursday },
  { label: 'Friday', value: WeekDay.Friday },
  { label: 'Saturday', value: WeekDay.Saturday },
];
