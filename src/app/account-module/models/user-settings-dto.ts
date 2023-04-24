import { Category } from 'src/app/models/category-dto';

export interface UserSettingsDto {
  isDefaultMeasurementStandard: boolean;
  isDarkMode: boolean;
  isMonthDefaultView: boolean;
  categories: Array<Category>;
}
