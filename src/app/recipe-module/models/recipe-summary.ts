export interface RecipeSummary {
  id: number;
  name: string;
  tags: Array<string>;
  ingredients: Array<string>;
  isVegetarian: boolean;
  isDairyFree: boolean;
  isGlutenFree: boolean;
}
