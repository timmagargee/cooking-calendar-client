import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faCirclePlus,
  faCircleXmark,
  faPenToSquare,
  faUpDown,
} from '@fortawesome/free-solid-svg-icons';
import { Subject, of, startWith, switchMap } from 'rxjs';
import { CalendarDataService } from 'src/app/calendar-module/calendar-data.service';
import { SelectOption } from 'src/app/custom-inputs/models/select-option';
import { IdNameDto } from 'src/app/models/IdNameDto';
import { ActionType } from 'src/app/models/enums/action-type';
import {
  MeasurementType,
  GetMeasurementString as getMeasurementString,
} from 'src/app/models/enums/measurement-type';
import { ToastService } from 'src/app/services/toast.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { DialogButtons } from 'src/app/shared/models/dialog-buttons';
import { DialogData, GetDeleteDialog } from 'src/app/shared/models/dialog-data';
import { DialogResult } from 'src/app/shared/models/dialog-result';
import { StateService } from 'src/app/state.service';
import { reduceFraction } from '../../utilities/fraction_utility';
import {
  IngredientFormComponent,
  IngredientFormData,
} from '../ingredient-form/ingredient-form.component';
import { NewTagDto } from '../models/new-tag-dto';
import {
  Recipe,
  RecipeIngredient,
  RecipeStep,
  RecipeStepIngredient,
  RecipeTag,
} from '../models/recipe';
import { RecipeDataService } from '../recipe-data.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  @ViewChild('tmplAddNewTag', { static: true })
  public tmplAddNewTag!: TemplateRef<any>;
  @ViewChild('tmplAddStepIngredient', { static: true })
  public tmplAddStepIngredient!: TemplateRef<any>;

  public recipe!: Recipe;
  public loading = true;
  public isEditing = false;

  public isAddingTag = false;
  public tagList: Array<IdNameDto> = [];
  public newTagId?: number;
  public tagOptions: Array<SelectOption> = [];
  public newTag: NewTagDto = { name: '' };
  public tagErrors = [];
  public initialServingSize = 0;

  public newStepIngredient!: RecipeStepIngredient;
  public stepIngredientOptions: Array<SelectOption> = [];
  public numeratorErrors: Array<string> = [];
  public initialRecipe!: Recipe;

  public dateToAssign?: Date;

  public addIcon = faCirclePlus;
  public editIcon = faPenToSquare;
  public removeIcon = faCircleXmark;
  public reorderIcon = faUpDown;
  public refreshData = new Subject<void>();
  public locale = 'en-US';

  public ingredientDialogData: DialogData = {
    component: IngredientFormComponent,
    buttons: DialogButtons.YesCancel,
    yesButtonText: 'Save',
    width: '500px',
  } as DialogData;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stateService: StateService,
    private dataService: RecipeDataService,
    private calendarDataService: CalendarDataService,
    private dialogService: DialogService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const recipeId = Number(this.route.snapshot.paramMap.get('id'));

    this.refreshData
      .pipe(
        startWith(null),
        switchMap(() => this.dataService.getRecipe(recipeId))
      )
      .subscribe((x) => {
        this.recipe = x;
        this.initialServingSize = this.recipe.servingSize;
        if (this.stateService.staticState.startRecipeInEdit) {
          this.stateService.setStartRecipeInEdit(false);
          this.startEditing();
        }
        this.dateToAssign = this.stateService.staticState.dateToAssign;
        this.loading = false;
      });
  }

  public addTag(): void {
    this.newTagId = undefined;
    this.setTagSelectOptions();
    this.isAddingTag = true;
  }

  public tagSelected(): void {
    this.addToRecipeTags(
      this.newTagId!,
      this.tagList.find((x) => x.id == this.newTagId)!.name
    );
  }

  public startEditing(): void {
    if (this.tagList.length == 0) {
      this.refreshTagList();
    }
    this.recipe.servingSize = this.initialServingSize;
    this.isEditing = true;
    this.initialRecipe = { ...this.recipe };
  }

  public dropTag(event: CdkDragDrop<RecipeTag[]>) {
    moveItemInArray(this.recipe.tags, event.previousIndex, event.currentIndex);
    this.refreshTagSortOrder();
  }

  public removeTag(tagId: number) {
    this.recipe.tags = this.recipe.tags.filter((x) => x.tagId !== tagId);
    this.refreshTagSortOrder();
  }

  private refreshTagSortOrder() {
    this.recipe.tags.forEach((x, i) => {
      x.sortOrder = i + 1;
    });
  }

  private refreshTagList() {
    this.dataService.getTags().subscribe((x) => {
      this.tagList = x.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  public addNewTag(): void {
    const dialogData: DialogData = {
      title: 'Add new Tag',
      template: this.tmplAddNewTag,
      buttons: DialogButtons.YesCancel,
      yesButtonText: 'Save',
      message: 'This will immediately add a new tag to your list',
      validityCallback: this.isNewTagValid,
    } as DialogData;
    this.dialogService
      .display(dialogData)
      .pipe(
        switchMap((dialogResult) => {
          if (dialogResult === DialogResult.yes) {
            return this.dataService.addTag(this.newTag);
          }
          return of(-1);
        })
      )
      .subscribe((x) => {
        if (x !== -1) {
          this.tagList.push({ id: x, name: this.newTag.name });
          this.addToRecipeTags(x, this.newTag.name);
        }
      });
  }

  public setTagSelectOptions() {
    this.tagOptions = this.tagList.map((x) => ({
      value: x.id,
      label: x.name,
      disabled: this.recipe.tags.map((y) => y.tagId).includes(x.id),
    }));
  }

  private addToRecipeTags(tagId: number, name: string) {
    this.recipe.tags.push({
      tagId: tagId,
      name: name,
      sortOrder: this.recipe.tags.length,
    });
    this.isAddingTag = false;
  }

  private isNewTagValid = (): boolean => {
    return !(
      this.tagList.some((x) => x.name == this.newTag.name) ||
      this.newTag.name.trim() === ''
    );
  };

  public checkForErrors() {
    this.tagErrors = [];

    if (this.newTag.name.trim() === '') {
    }
  }

  public getTagString(): string {
    return this.recipe.tags.map((x) => x.name).join(', ');
  }

  public getStepString(step: RecipeStep): string {
    let ret = '';
    const pieces = step.step.split('{');

    pieces.forEach((s, i) => {
      if (i != 0) {
        const ss = s.split('}');
        s = ss[0].replaceAll(' ', '');
        const endString = ss[1].replaceAll('}', '');

        const ingInfo = s.split(',');
        const ing = {
          ...this.recipe.ingredients.find(
            (x) => x.sortOrder == Number(ingInfo[0])
          ),
        }!;
        const fraction = ingInfo[1].split('/').map((x) => Number(x));
        if (fraction[0] != fraction[1]) {
          if (ing.amountNumerator) {
            ing.amountNumerator *= fraction[0];
            ing.amountDenominator! *= fraction[1];
          } else {
            ing.amount! *= fraction[0] / fraction[1];
          }
        }
        ret +=
          `(${this.getMeasString(ing)}) ${this.getIngString(ing)}` + endString;
      } else {
        ret += s;
      }
    });

    return ret;
  }

  public dropIngredient(event: CdkDragDrop<RecipeIngredient[]>) {
    moveItemInArray(
      this.recipe.ingredients,
      event.previousIndex,
      event.currentIndex
    );
    this.recipe.ingredients.forEach((x, i) => {
      x.sortOrder = i + 1;
    });
  }

  public addIngredient() {
    const formData: IngredientFormData = {
      ingredient: { sortOrder: this.recipe.ingredients.length + 1 },
      usedIds: this.recipe.ingredients.map((x) => x.ingredientId!),
      useStandardMeasuments: this.recipe.areMeasurementsStandard,
    };

    this.ingredientDialogData.title = 'Add Ingredient';
    this.ingredientDialogData.componentData = formData;

    this.dialogService
      .display(this.ingredientDialogData)
      .subscribe((dialogResult) => {
        if (dialogResult === DialogResult.yes) {
          this.recipe.ingredients.push(formData.ingredient);
        }
      });
  }

  public editIngredient(ing: RecipeIngredient, index: number) {
    const formData: IngredientFormData = {
      ingredient: { ...ing },
      usedIds: this.recipe.ingredients
        .map((x) => x.ingredientId!)
        .filter((x) => x !== ing.ingredientId),
      useStandardMeasuments: this.recipe.areMeasurementsStandard,
    };

    this.ingredientDialogData.title = 'Add Ingredient';
    this.ingredientDialogData.componentData = formData;

    this.dialogService
      .display(this.ingredientDialogData)
      .subscribe((dialogResult) => {
        if (dialogResult === DialogResult.yes) {
          this.recipe.ingredients[index] = { ...formData.ingredient };
        }
      });
  }

  public addStep() {
    this.recipe.steps.push({
      step: '',
      sortOrder: this.recipe.steps.length + 1,
      ingredients: [],
    });
  }

  public dropStep(event: CdkDragDrop<RecipeStep[]>) {
    moveItemInArray(this.recipe.steps, event.previousIndex, event.currentIndex);
    this.recipe.steps.forEach((x, i) => {
      x.sortOrder = i + 1;
    });
  }

  public onCancel(): void {
    this.recipe = { ...this.initialRecipe };
    this.isEditing = false;
    this.isAddingTag = false;
  }

  public onDelete(): void {
    this.dialogService
      .display(GetDeleteDialog('recipe'))
      .pipe(
        switchMap((dialogResult) => {
          if (dialogResult === DialogResult.yes) {
            return this.dataService.deleteRecipe(this.recipe.id);
          }
          return of(undefined);
        })
      )
      .subscribe((x) => {
        if (x !== undefined) {
          this.toastService.showActionToast(ActionType.delete, x);
          this.routeBack();
        }
      });
  }

  public onSave(): void {
    this.dataService.updateRecipe(this.recipe).subscribe((x) => {
      this.toastService.showActionToast(ActionType.update, x);

      if (x) {
        this.refreshData.next();
        this.isEditing = false;
        this.isAddingTag = false;
      }
    });
  }

  public assignToDate(): void {
    this.calendarDataService
      .assignMealToDate({
        mealDate: this.dateToAssign!,
        recipeId: this.recipe.id,
      })
      .subscribe((x) => {
        this.toastService.showActionToast(ActionType.assign, x);
        if (x) {
          this.router.navigate(['calendar']);
        }
      });
  }

  private routeBack(): void {
    this.router.navigate([`recipe`]);
  }

  public getMeasString(ing: RecipeIngredient): string {
    let amount = ing.amount;
    let numerator = ing.amountNumerator;
    let denominator = ing.amountDenominator;
    if (
      !this.isEditing &&
      this.initialServingSize !== this.recipe.servingSize
    ) {
      if (amount) {
        amount *= this.recipe.servingSize / this.initialServingSize;
      }
      if (numerator) {
        const fraction = reduceFraction(
          numerator * this.recipe.servingSize,
          denominator! * this.initialServingSize
        );
        numerator = fraction[0];
        denominator = fraction[1];
      }
    }

    let s = amount
      ? amount.toLocaleString(this.locale, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 3,
        }) + ' '
      : '';
    if (numerator) {
      s += `${numerator}/${denominator} `;
    }
    if (ing.measurement != MeasurementType.Amount) {
      s += getMeasurementString(ing.measurement!);
    }
    return s;
  }

  public getIngString(ing: RecipeIngredient): string {
    return (
      ing.ingredient +
      (ing.description !== undefined && ing.description.trim() !== ''
        ? `, ${ing.description}`
        : '')
    );
  }

  public addStepIngredient(step: RecipeStep, index: number) {
    this.newStepIngredient = {
      stepNumber: step.sortOrder,
      ingredientOrderNumber: 1,
      numerator: 1,
      denominator: 1,
    };

    this.dialogService
      .display(this.getStepIngredientDialog(step.sortOrder))
      .subscribe((dialogResult) => {
        if (dialogResult === DialogResult.yes) {
          step.step += ` ${this.convertStepIngredientToText(
            this.newStepIngredient
          )} `;
          this.recipe.steps[index] = { ...step };
        }
      });
  }

  private getStepIngredientDialog(orderNumber: number, isAdd = true) {
    this.stepIngredientOptions = this.recipe.ingredients.map((x) => ({
      label: x.ingredient!,
      value: x.sortOrder!,
    }));

    return {
      title: `${isAdd ? 'Add' : 'Edit'} Step ${orderNumber} Ingredient`,
      template: this.tmplAddStepIngredient,
      buttons: DialogButtons.YesCancel,
      yesButtonText: 'Save',
    } as DialogData;
  }

  private convertStepIngredientToText(ing: RecipeStepIngredient): string {
    let s = `{${ing.ingredientOrderNumber}`;
    if (ing.numerator) {
      s += `, ${ing.numerator}/${ing.denominator}`;
    }
    s += '}';
    return s;
  }

  public onFractionChange() {
    this.numeratorErrors = [];
    if (
      !this.newStepIngredient.numerator ||
      this.newStepIngredient.numerator >
        (this.newStepIngredient.denominator ?? 0)
    ) {
      this.numeratorErrors.push(
        'Numerator must be less than or equal to denominator'
      );
    }
  }
}
