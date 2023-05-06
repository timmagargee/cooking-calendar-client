import { Component } from '@angular/core';
import * as _ from 'lodash';
import { Subject, startWith, switchMap } from 'rxjs';
import { AccountSettingsService } from 'src/app/account-module/account-setting.service';
import { DateFilters } from 'src/app/calendar-module/models/date-filters';
import { ActionType } from 'src/app/models/enums/action-type';
import { ToastService } from 'src/app/services/toast.service';
import { addDays, setToMidnight } from 'src/app/utilities/date_utility';
import { ShoppingCategory } from '../models/shopping-category';
import { EnteredItem, ShoppingListDto } from '../models/shopping-list-dto';
import { ShoppingDataService } from '../shopping-data.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss'],
})
export class ShoppingComponent {
  public refreshData = new Subject<void>();
  public loading = true;
  public shoppingList!: ShoppingListDto;
  public initialList!: ShoppingListDto;
  public dates!: DateFilters;
  public today = new Date();
  public shoppingCategory = ShoppingCategory;
  public isEditing: boolean = false;

  public enteredLists = new Map<ShoppingCategory, Array<EnteredItem>>([
    [ShoppingCategory.Drink, []],
    [ShoppingCategory.Snack, []],
    [ShoppingCategory.Other, []],
  ]);

  constructor(
    private dataService: ShoppingDataService,
    private toastService: ToastService,
    private accountSettingsService: AccountSettingsService
  ) {
    setToMidnight(this.today);
    this.accountSettingsService.getSettings().subscribe((x) => {
      if (x && x.defaultShoppingDay !== undefined) {
        let daysToAdd = x.defaultShoppingDay - this.today.getDay();
        if (daysToAdd < 0) {
          daysToAdd += 7;
        }

        this.dates = {
          startDate: addDays(this.today, daysToAdd),
          endDate: addDays(this.today, daysToAdd + 7),
        };
      } else {
        this.dates = { startDate: this.today, endDate: addDays(this.today, 7) };
      }
    });
  }

  ngOnInit(): void {
    this.refreshData
      .pipe(
        startWith(null),
        switchMap(() => this.dataService.getShoppingList())
      )
      .subscribe((x) => {
        if (x) {
          this.shoppingList = x;
          this.splitEnteredItems();
          this.initialList = _.cloneDeep(this.shoppingList);
        }

        this.loading = false;
      });
  }

  public generateList() {
    this.dataService.generateShoppingList(this.dates).subscribe((x) => {
      this.toastService.showActionToast(ActionType.generate, x);
      this.refreshData.next();
    });
  }

  public clearChecked() {
    this.dataService.clearCheckedItems(this.shoppingList.id).subscribe((x) => {
      this.toastService.showActionToast(ActionType.delete, x);
      this.refreshData.next();
    });
  }

  public hasCheckedItems() {
    return (
      this.shoppingList.generatedItems.some((x) => x.isChecked) ||
      this.shoppingList.enteredItems.some((x) => x.isChecked)
    );
  }

  public onSave() {
    this.combineEnteredItems();
    this.dataService.updateShoppingList(this.shoppingList).subscribe((x) => {
      this.toastService.showActionToast(ActionType.update, x);
      if (x) {
        this.refreshData.next();
        this.isEditing = false;
      }
    });
  }

  public readyToSave(): boolean {
    let isValid = true;
    this.enteredLists.forEach((x) => {
      if (x.some((y) => y.isBeingEdited)) {
        isValid = false;
      }
    });
    return isValid;
  }

  public editMade() {
    this.isEditing = true;
  }

  public onCancel(): void {
    this.shoppingList = _.cloneDeep(this.initialList);
    this.splitEnteredItems();
    this.isEditing = false;
  }

  private splitEnteredItems(): void {
    this.enteredLists.set(
      ShoppingCategory.Drink,
      this.shoppingList.enteredItems.filter(
        (x) => x.category == ShoppingCategory.Drink
      )
    );
    this.enteredLists.set(
      ShoppingCategory.Snack,
      this.shoppingList.enteredItems.filter(
        (x) => x.category == ShoppingCategory.Snack
      )
    );
    this.enteredLists.set(
      ShoppingCategory.Other,
      this.shoppingList.enteredItems.filter(
        (x) => x.category == ShoppingCategory.Other
      )
    );
  }

  private combineEnteredItems(): void {
    const a: Array<EnteredItem> = [];
    this.enteredLists.forEach((x) => {
      a.push(...x);
    });
    this.shoppingList.enteredItems = a;
  }
}
