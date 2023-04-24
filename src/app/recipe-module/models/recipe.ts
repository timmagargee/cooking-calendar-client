import { MeasurementType } from 'src/app/models/enums/measurement-type';

export interface Recipe {
  id: number;
  name: string;
  description: string;
  servingSize: number;
  areMeasurementsStandard: boolean;
  tags: Array<RecipeTag>;
  ingredients: Array<RecipeIngredient>;
  steps: Array<RecipeStep>;
}

export interface RecipeTag {
  tagId: number;
  name: string;
  sortOrder: number;
}

export interface RecipeIngredient {
  ingredientId?: number;
  ingredient?: string;
  sortOrder?: number;
  measurement?: MeasurementType;
  amount?: number;
  amountNumerator?: number;
  amountDenominator?: number;
  description?: string;
}

export interface RecipeStep {
  step: string;
  sortOrder: number;
  ingredients: Array<RecipeStepIngredient>;
}

export interface RecipeStepIngredient {
  stepNumber: number;
  ingredientOrderNumber: number;
  numerator?: number;
  denominator?: number;
}
