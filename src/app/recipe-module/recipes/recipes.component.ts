import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions, RowClickedEvent } from 'ag-grid-community';
import { concatMap, of } from 'rxjs';
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
      width: 300,
      minWidth: 100,
    },
    columnDefs: [
      {
        headerName: 'Recipe',
        field: 'name',
        sortable: true,
      },
      {
        headerName: 'Tags',
        field: 'tags',
      },
      {
        headerName: 'Ingredients',
        field: 'ingredients',
        flex: 1,
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
        this.stateService.setStartRecipeInEdit(true);
        this.routeToRecipe(recipeId);
      });
  }
}
