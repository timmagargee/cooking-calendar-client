import { Component, OnInit } from '@angular/core';
import { IngredientDataService } from 'src/app/recipe-module/ingredient-data.service';
import { Ingredient } from 'src/app/recipe-module/models/ingredient';
import { IDialogFormData } from 'src/app/shared/dialog/dialog-form-data';
import { DialogData } from 'src/app/shared/models/dialog-data';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
  providers: [
    {
      provide: IDialogFormData,
      useExisting: IngredientComponent,
    },
  ],
})
export class IngredientComponent implements IDialogFormData, OnInit {
  public dialogData!: DialogData;
  public formData!: Ingredient;
  public labelWidth = '55px';

  public usedNames: Array<string> = [];

  public ingredientId?: number;
  public newUserIngredient?: boolean;

  constructor(private dataService: IngredientDataService) {}
  ngOnInit(): void {
    this.dialogData.validityCallback = this.isValid;
    this.dataService.getIngredients().subscribe((x) => {
      this.usedNames = x.map((x) => x.name);
    });
  }

  public setFormData(formData: Ingredient): void {
    this.formData = formData;
  }

  public setDialogData(dialogData: DialogData): void {
    this.dialogData = dialogData;
  }

  public isValid = (): boolean => {
    return (
      this.formData.name.trim() !== '' &&
      !this.usedNames.some((x) => this.formData.name.trim() == x)
    );
  };
}
