import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { IngredientDataService } from '../recipe-module/ingredient-data.service';
import { Ingredient } from '../recipe-module/models/ingredient';
import { DialogService } from '../shared/dialog.service';
import { DialogButtons } from '../shared/models/dialog-buttons';
import { DialogData } from '../shared/models/dialog-data';
import { DialogResult } from '../shared/models/dialog-result';
import { IngredientComponent } from './ingredient/ingredient.component';

@Injectable({
  providedIn: 'root',
})
export class UserItemService {
  public constructor(
    private dialogService: DialogService,
    private ingredientService: IngredientDataService
  ) {}

  public addIngredient(): Observable<number | undefined> {
    const formData: Ingredient = {
      name: '',
      isMeat: false,
      isDairy: false,
      isGluten: false,
    };

    const dialogData: DialogData = {
      title: 'Add Ingredient',
      component: IngredientComponent,
      componentData: formData,
      buttons: DialogButtons.YesCancel,
      yesButtonText: 'Save',
    } as DialogData;

    return this.dialogService.display(dialogData).pipe(
      switchMap((dialogResult) => {
        if (dialogResult === DialogResult.yes) {
          return this.ingredientService.addIngredient(formData);
        }
        return of(undefined);
      })
    );
  }
}
