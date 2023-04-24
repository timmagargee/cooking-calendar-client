import { WeekDay } from '@angular/common';
import { CategoryType } from './enums/category-type';

export interface Category {
  id: number;
  name: string;
  dayOfWeek: WeekDay;
  categoryType: CategoryType;
  tagId: number;
  ingredientId: number;
}
