import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions, RowClickedEvent } from 'ag-grid-community';
import { concatMap, of } from 'rxjs';
import { BooleanColumnFilter } from 'src/app/grid/custom-column-filters';
import { GridCheckboxComponent } from 'src/app/grid/grid-checkbox.component';
import { DialogService } from 'src/app/shared/dialog.service';
import { DialogButtons } from 'src/app/shared/models/dialog-buttons';
import { DialogData } from 'src/app/shared/models/dialog-data';
import { DialogResult } from 'src/app/shared/models/dialog-result';
import { StateService } from 'src/app/state.service';
import { AddRecipeFormComponent } from '../add-recipe-form/add-recipe-form.component';
import { NewRecipe } from '../models/new-recipe';
import { RecipeSummary } from '../models/recipe-summary';
import { RecipeDataService } from '../recipe-data.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  public recipes: Array<RecipeSummary> = [];

  public gridOptions: GridOptions = {
    onRowClicked: this.onRowClicked.bind(this),
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
      width: 200,
      minWidth: 100,
    },
    columnDefs: [
      {
        headerName: 'Recipe',
        field: 'name',
      },
      {
        headerName: 'Vegetarian',
        field: 'isVegetarian',
        width: 105,
        cellRenderer: GridCheckboxComponent,
        filterParams: BooleanColumnFilter,
      },
      {
        headerName: 'Dairy Free',
        field: 'isDairyFree',
        width: 105,
        cellRenderer: GridCheckboxComponent,
        filterParams: BooleanColumnFilter,
      },
      {
        headerName: 'Gluten Free',
        field: 'isGlutenFree',
        width: 115,
        cellRenderer: GridCheckboxComponent,
        filterParams: BooleanColumnFilter,
      },
      {
        headerName: 'Tags',
        field: 'tags',
        sortable: false,
        filter: false,
      },
      {
        headerName: 'Ingredients',
        field: 'ingredients',
        flex: 1,
        sortable: false,
        filter: false,
      },
    ],
  };

  constructor(
    private router: Router,
    private dataService: RecipeDataService,
    private stateService: StateService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.dataService.getRecipes().subscribe((x) => {
      this.recipes = x;
    });
  }

  private onRowClicked(event: RowClickedEvent) {
    this.routeToRecipe(event.data.id);
  }

  private routeToRecipe(id: number) {
    this.router.navigate([`recipe/${id}`]);
  }

  public addRecipe() {
    const formData: NewRecipe = {
      name: '',
    };

    const dialogData: DialogData = {
      title: 'Add Recipe',
      buttons: DialogButtons.YesCancel,
      component: AddRecipeFormComponent,
      componentData: formData,
      yesButtonText: 'Save',
    } as DialogData;

    this.dialogService
      .display(dialogData)
      .pipe(
        concatMap((dialogResult) => {
          if (dialogResult === DialogResult.yes) {
            return this.dataService.addRecipe(formData);
          }
          return of(-1);
        })
      )
      .subscribe((recipeId) => {
        if (recipeId != -1) {
          this.stateService.setStartRecipeInEdit(true);
          this.routeToRecipe(recipeId);
        }
      });
  }
}
