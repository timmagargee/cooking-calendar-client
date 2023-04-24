import { Component, OnInit } from '@angular/core';
import { SelectOption } from 'src/app/custom-inputs/models/select-option';
import {
  MetricMeasurementOptions,
  StandardMeasurementOptions,
} from 'src/app/models/enums/measurement-type';
import { IDialogFormData } from 'src/app/shared/dialog/dialog-form-data';
import { DialogData } from 'src/app/shared/models/dialog-data';
import { UserItemService } from 'src/app/user-item-dialogs/user-item.service';
import { IngredientDataService } from '../ingredient-data.service';
import { AmountType, AmountTypeOptions } from '../models/enums';
import { IngredientBase } from '../models/ingredient';
import { RecipeIngredient } from '../models/recipe';

export interface IngredientFormData {
  ingredient: RecipeIngredient;
  usedIds: Array<number>;
  useStandardMeasuments: boolean;
}

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.scss'],
  providers: [
    {
      provide: IDialogFormData,
      useExisting: IngredientFormComponent,
    },
  ],
})
export class IngredientFormComponent implements IDialogFormData, OnInit {
  public dialogData!: DialogData;
  public formData!: IngredientFormData;
  public ing!: RecipeIngredient;

  public amountType: AmountType = AmountType.Decimal;
  public amountTypeList = AmountTypeOptions;

  public nullVar?: number;

  public measurementTypeList: Array<SelectOption> = [];
  public ingredientList: Array<IngredientBase> = [];
  public ingredientSelectList: Array<SelectOption> = [];

  public ingredientId?: number;
  public newUserIngredient?: boolean;

  constructor(
    private dataService: IngredientDataService,
    private userItemService: UserItemService
  ) {}
  ngOnInit(): void {
    this.dialogData.validityCallback = this.isValid;
    this.measurementTypeList = this.formData.useStandardMeasuments
      ? StandardMeasurementOptions
      : MetricMeasurementOptions;

    this.refreshIngredients();
  }

  private refreshIngredients(): void {
    this.dataService.getIngredients().subscribe((x) => {
      this.ingredientList = x;
      this.setIngredientSelectOptions();
      if (this.ing.ingredientId) {
        this.ingredientId = this.ingredientList.find(
          (x) => x.userIngredientId == this.ing.ingredientId
        )!.id;
      }
      if (this.ingredientId) {
        this.onIngredientChange();
      }
    });
  }

  public onAmountTypeChange(): void {
    if (
      this.showFractionAmountField() &&
      this.ing.amountDenominator === undefined
    ) {
      this.ing.amountNumerator = 1;
      this.ing.amountDenominator = 2;
    }
    switch (this.amountType as AmountType) {
      case AmountType.Decimal:
        this.ing.amountNumerator = undefined;
        this.ing.amountDenominator = undefined;
        break;
      case AmountType.Fraction:
        this.ing.amount = undefined;
        break;
      case AmountType.Mixed:
        if (this.ing.amount) {
          this.ing.amount = Math.floor(this.ing.amount);
        }
        break;
    }
  }

  public setFormData(formData: IngredientFormData): void {
    this.formData = formData;
    this.ing = formData.ingredient;
  }

  public setDialogData(dialogData: DialogData): void {
    this.dialogData = dialogData;
  }

  public showSingleAmountField() {
    return (
      this.amountType == AmountType.Decimal ||
      this.amountType == AmountType.Mixed
    );
  }

  public showFractionAmountField() {
    return (
      this.amountType == AmountType.Fraction ||
      this.amountType == AmountType.Mixed
    );
  }

  public setIngredientSelectOptions() {
    this.ingredientSelectList = this.ingredientList
      .filter((x) => !this.formData.usedIds.includes(x.userIngredientId ?? -1))
      .map((x) => ({
        value: x.id,
        label: x.name,
        //disabled: this.formData.usedIds.includes(x.userIngredientId ?? -1),
      }));
  }

  public async onIngredientChange() {
    const ing = this.ingredientList.find((x) => x.id == this.ingredientId)!;
    this.newUserIngredient = ing.userIngredientId == undefined;
    this.ing.ingredient = ing.name;

    if (this.newUserIngredient) {
      this.ing.ingredientId = undefined;
      this.addUserIngredient();
    } else {
      this.ing.ingredientId = ing.userIngredientId;
    }
  }

  public addNewIngredient() {
    this.userItemService.addIngredient().subscribe((x) => {
      if (x !== undefined && x != -1) {
        this.ingredientId = x;
        this.refreshIngredients();
      }
    });
  }

  public addUserIngredient() {
    this.dataService.addUserIngredient(this.ingredientId!).subscribe((x) => {
      if (x !== -1) {
        this.ingredientId = x;
        this.refreshIngredients();
      }
    });
  }

  public isValid = (): boolean => {
    return (
      this.ing.measurement !== undefined &&
      this.ing.ingredientId !== undefined &&
      this.isAmountValid()
    );
  };

  private isAmountValid(): boolean {
    return (
      (this.amountType == AmountType.Decimal && this.ing.amount != undefined) ||
      (this.ing.amountNumerator != undefined &&
        this.ing.amountDenominator != undefined)
    );
  }
}
