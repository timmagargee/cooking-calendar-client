import { Category } from 'src/app/models/category-dto';

export interface CalendarDto {
  id: number;
  lastGenerated: Date;
  categories: Array<Category>;
}
