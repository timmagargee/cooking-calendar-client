import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SelectOption } from 'src/app/custom-inputs/models/select-option';
import { Category } from 'src/app/models/category-dto';
import { CategoryType } from 'src/app/models/enums/category-type';
import { IngredientDataService } from 'src/app/recipe-module/ingredient-data.service';
import { RecipeDataService } from 'src/app/recipe-module/recipe-data.service';
import { DialogData } from 'src/app/shared/models/dialog-data';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  public dialogData!: DialogData;
  public formData!: Category;
  public tags: Array<SelectOption> = [];
  public ingredients: Array<SelectOption> = [];
  public loading = true;
  public type = CategoryType;

  constructor(
    private recipeService: RecipeDataService,
    private ingredientService: IngredientDataService
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.recipeService.getTags(),
      this.ingredientService.getIngredients(),
    ]).subscribe(([tags, ings]) => {
      if ((this.formData.name = this.getPlaceholder())) {
        this.formData.name = '';
      }
      this.tags = tags.map((x) => ({
        value: x.id,
        label: x.name,
      }));
      this.ingredients = ings.map((x) => ({
        value: x.userIngredientId!,
        label: x.name,
      }));

      this.loading = false;
    });

    this.dialogData.validityCallback = this.isValid;
    this.dialogData.beforeCloseCallback = this.beforeClose;
  }

  public setFormData(formData: Category): void {
    this.formData = formData;
  }

  public setDialogData(dialogData: DialogData): void {
    this.dialogData = dialogData;
  }

  private isValid = (): boolean => {
    return (
      (this.formData.categoryType == CategoryType.Tag &&
        this.formData.tagId != undefined) ||
      (this.formData.categoryType == CategoryType.Ingredient &&
        this.formData.ingredientId != undefined) ||
      this.formData.categoryType == CategoryType.Unplanned ||
      this.formData.categoryType == CategoryType.Random
    );
  };

  private beforeClose = (): void => {
    if (this.formData.name.trim() == '') {
      this.formData.name = this.getPlaceholder();
    }
  };

  public getPlaceholder(): string {
    switch (this.formData.categoryType) {
      case CategoryType.Tag:
        const tag = this.tags.find((x) => x.value == this.formData.tagId);
        return tag !== undefined ? tag.label : '';
      case CategoryType.Ingredient:
        const ingredient = this.ingredients.find(
          (x) => x.value == this.formData.ingredientId
        );
        return ingredient !== undefined ? ingredient.label : '';
      case CategoryType.Unplanned:
        return 'Unplanned';
      case CategoryType.Random:
        return 'Random';
    }
  }
}
