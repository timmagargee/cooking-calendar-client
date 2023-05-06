import { MeasurementType } from 'src/app/models/enums/measurement-type';
import { ShoppingCategory } from './shopping-category';

export interface ShoppingListDto {
  id: number;
  startDate: Date;
  endDate: Date;
  createdOn: Date;
  generatedItems: Array<GeneratedItem>;
  enteredItems: Array<EnteredItem>;
}

export interface ShoppingItem {
  id?: number;
  name: string;
  isChecked: boolean;
}

export interface GeneratedItem extends ShoppingItem {
  ingredientId: number;
  amount: number;
  measurementType: MeasurementType;
  measLabel: string;
}

export interface EnteredItem extends ShoppingItem {
  category: ShoppingCategory;
  isBeingEdited?: boolean;
}
