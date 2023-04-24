export interface Ingredient {
  id?: number;
  name: string;
  isMeat: boolean;
  isDairy: boolean;
  isGluten: boolean;
}

export interface IngredientBase {
  userIngredientId?: number;
  id: number;
  name: string;
}
