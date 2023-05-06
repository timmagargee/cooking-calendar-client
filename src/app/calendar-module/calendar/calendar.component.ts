import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  faChevronLeft,
  faChevronRight,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { Subject, of, startWith, switchMap } from 'rxjs';
import { SelectOption } from 'src/app/custom-inputs/models/select-option';
import { Category } from 'src/app/models/category-dto';
import { ActionType } from 'src/app/models/enums/action-type';
import { RecipeDataService } from 'src/app/recipe-module/recipe-data.service';
import { ToastService } from 'src/app/services/toast.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { DialogButtons } from 'src/app/shared/models/dialog-buttons';
import { DialogData } from 'src/app/shared/models/dialog-data';
import { DialogResult } from 'src/app/shared/models/dialog-result';
import { StateService } from 'src/app/state.service';
import { isDateEqual } from 'src/app/utilities/date_utility';
import { CalendarDataService } from '../calendar-data.service';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { AssignMealDto } from '../models/assign-meal-dto';
import { CalendarDto } from '../models/calendar-dto';
import { DateFilters } from '../models/date-filters';
import { MealDto } from '../models/meal-dto';
const DAY_MS = 60 * 60 * 24 * 1000;

interface CalendarDate {
  date: Date;
  meal?: MealDto;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('assignMealForm', { static: true })
  public assignMealForm!: TemplateRef<any>;

  public dates: Array<Date>;
  public days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public date = new Date();
  public calendar!: CalendarDto;
  public meals: Array<MealDto> = [];
  public refreshData = new Subject<void>();
  public refreshMealData = new Subject<DateFilters>();
  public editIcon = faPenToSquare;
  public leftIcon = faChevronLeft;
  public rightIcon = faChevronRight;
  public loading = true;
  public calendarDays: Array<CalendarDate> = [];
  public recipes: Array<SelectOption> = [];
  public mealFormData!: AssignMealDto;
  private today = new Date();

  constructor(
    private dataService: CalendarDataService,
    private recipeService: RecipeDataService,
    private dialogService: DialogService,
    private toastService: ToastService,
    private router: Router,
    private stateService: StateService
  ) {
    this.dates = this.getCalendarDays(this.date);
  }

  ngOnInit(): void {
    this.stateService.setDateToAssign();
    this.refreshData
      .pipe(
        startWith(null),
        switchMap(() => this.dataService.getCalendar())
      )
      .subscribe((x) => {
        this.calendar = x;
        this.refreshMeals();
        this.loading = false;
      });

    this.refreshMealData
      .pipe(
        switchMap((x) => this.dataService.getCalendarMeals(this.calendar.id, x))
      )
      .subscribe((x) => {
        this.meals = x;
        this.calendarDays = this.dates.map((x) => ({
          date: x,
          meal: this.meals.find((y) => isDateEqual(y.mealDate, x)),
        }));
      });
  }

  public setMonth(inc: number) {
    const [year, month] = [this.date.getFullYear(), this.date.getMonth()];
    this.date = new Date(year, month + inc, 1);
    this.dates = this.getCalendarDays(this.date);
    this.refreshMeals();
  }

  public isSameMonth(date: Date) {
    return date.getMonth() === this.date.getMonth();
  }

  public editCategory(cat: Category) {
    const formData = { ...cat };
    const dialogData: DialogData = {
      title: 'Update Category',
      component: CategoryFormComponent,
      componentData: formData,
      buttons: DialogButtons.YesCancel,
      width: '400px',
      yesButtonText: 'Save',
    } as DialogData;
    this.dialogService
      .display(dialogData)
      .pipe(
        switchMap((dialogResult) => {
          if (dialogResult === DialogResult.yes) {
            return this.dataService.updateCategory(this.calendar.id, formData);
          }
          return of(undefined);
        })
      )
      .subscribe((x) => {
        if (x !== undefined) {
          this.toastService.showActionToast(ActionType.update, x);
          this.refreshData.next();
        }
      });
  }

  public updateRecipeOnDay(day: CalendarDate) {
    if ((this.recipes = [])) {
      this.recipeService
        .getRecipes()
        .subscribe(
          (x) => (this.recipes = x.map((y) => ({ label: y.name, value: y.id })))
        );
    }

    if (day.meal) {
      this.mealFormData = {
        mealId: day.meal.id,
        recipeId: day.meal.recipe.id,
        mealDate: day.date,
      };
    } else {
      this.mealFormData = {
        mealDate: day.date,
      } as AssignMealDto;
    }

    const dialogData: DialogData = {
      title: 'Update Meal',
      template: this.assignMealForm,
      buttons: DialogButtons.YesCancel,
      width: '400px',
      yesButtonText: 'Save',
      validityCallback: (): boolean => {
        return this.mealFormData.recipeId !== undefined;
      },
    } as DialogData;

    this.dialogService
      .display(dialogData)
      .pipe(
        switchMap((dialogResult) => {
          if (dialogResult === DialogResult.yes) {
            return this.dataService.assignMealToDate(this.mealFormData);
          }
          return of(undefined);
        })
      )
      .subscribe((x) => {
        if (x !== undefined) {
          this.toastService.showActionToast(ActionType.update, x);
          this.refreshMeals();
        }
      });
  }

  public searchForRecipe() {
    this.dialogService.closeAll();
    this.stateService.setDateToAssign(this.mealFormData.mealDate);
    this.router.navigate(['recipe']);
  }

  public generatePlan() {
    const startDay =
      this.date.getMonth() != this.today.getMonth() ? this.date : this.today;

    this.dataService
      .generateMealPlan(this.calendar.id, {
        startDate: startDay,
        endDate: new Date(startDay.getFullYear(), startDay.getMonth() + 1, 0),
      })
      .subscribe((x) => {
        this.toastService.showActionToast(ActionType.generate, x);
        this.refreshData.next();
      });
  }

  public canGeneratePlan() {
    return (
      this.date.getMonth() >= this.today.getMonth() &&
      this.date.getFullYear() >= new Date().getFullYear()
    );
  }

  private getCalendarDays(date = new Date()) {
    const calendarStartTime =
      this.getCalendarStartDay(date).getTime() +
      60 * 60 * 2 * 1000; /* add 2 hours for day light saving time adjustment */

    return this.range(0, 41).map(
      (num) => new Date(calendarStartTime + DAY_MS * num)
    );
  }

  private getCalendarStartDay(date: Date = new Date()) {
    const [year, month] = [date.getFullYear(), date.getMonth()];
    const firstDayOfMonth = new Date(year, month, 1).getTime();

    return this.range(1, 7)
      .map((num) => new Date(firstDayOfMonth - DAY_MS * num))
      .find((dt) => dt.getDay() === 0)!;
  }

  private range(start: number, end: number, length = end - start + 1) {
    return Array.from({ length }, (_, i) => start + i);
  }

  private refreshMeals() {
    this.refreshMealData.next({
      startDate: this.dates[0],
      endDate: this.dates[this.dates.length - 1],
    });
  }
}
