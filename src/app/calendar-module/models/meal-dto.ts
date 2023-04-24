import { RecipeSummary } from 'src/app/recipe-module/models/recipe-summary';

export interface MealDto {
  id: number;
  mealDate: Date;
  isUserAssigned: boolean;
  recipe: RecipeSummary;
}
