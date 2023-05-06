import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CalendarDataService } from '../calendar-module/calendar-data.service';
import { DateFilters } from '../calendar-module/models/date-filters';
import { MealDto } from '../calendar-module/models/meal-dto';
import { RecipeSummary } from '../recipe-module/models/recipe-summary';
import { RecipeService } from '../services/recipe.service';
import { ShoppingDataService } from '../shopping-module/shopping-data.service';
import { addDays, isDateEqual, setToMidnight } from '../utilities/date_utility';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public dates!: DateFilters;
  public today = new Date();
  public shoppingItems?: Array<string>;
  public shoppingGeneratedItems?: Array<string>;
  public shoppingEnteredItems?: Array<string>;
  public meals!: Array<MealDto>;
  public todaysRecipe?: RecipeSummary;
  public isNewUser: boolean = true;

  constructor(
    private recipeService: RecipeService,
    private calendarService: CalendarDataService,
    private shoppingService: ShoppingDataService,
    private datepipe: DatePipe
  ) {
    setToMidnight(this.today);
    this.dates = { startDate: this.today, endDate: addDays(this.today, 7) };
  }
  ngOnInit(): void {
    forkJoin([
      this.shoppingService.getShoppingList(),
      this.calendarService.getUpcomingMeals(this.dates),
    ]).subscribe(([shoppingList, meals]) => {
      this.isNewUser = meals.length == 0;
      if (shoppingList) {
        this.shoppingItems = [
          ...shoppingList.generatedItems.map((x) => x.name),
          ...shoppingList.enteredItems.map((x) => x.name),
        ];

        this.shoppingGeneratedItems = shoppingList.generatedItems.map(
          (x) => x.name
        );
        this.shoppingEnteredItems = shoppingList.enteredItems.map(
          (x) => x.name
        );
      }
      if (meals) {
        meals.forEach((x) => (x.mealDate = new Date(x.mealDate)));

        this.meals = meals.sort((a, b) => {
          return a.mealDate.getTime() - b.mealDate.getTime();
        });
        this.todaysRecipe = this.meals.find((x) =>
          isDateEqual(x.mealDate, this.today)
        )?.recipe;
      }
    });
  }

  public callGetRecipe() {
    this.recipeService.getRecipe(1).subscribe();
  }

  public mealDateString(meal: MealDto) {
    return this.datepipe.transform(meal.mealDate, 'EE MM/dd');
  }
}
