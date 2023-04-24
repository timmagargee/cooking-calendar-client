import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { AgGridModule } from 'ag-grid-angular';
import { GridModule } from '../grid/grid.module';
import { SharedModule } from '../shared/shared.module';
import { UserItemDialogsModule } from '../user-item-dialogs/user-item-dialogs.module';
import { AddRecipeFormComponent } from './add-recipe-form/add-recipe-form.component';
import { IngredientFormComponent } from './ingredient-form/ingredient-form.component';
import { RecipeRoutingModule } from './recipe-routing.module';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipesComponent } from './recipes/recipes.component';

@NgModule({
  declarations: [
    RecipeComponent,
    RecipesComponent,
    AddRecipeFormComponent,
    IngredientFormComponent,
  ],
  imports: [
    CommonModule,
    RecipeRoutingModule,
    GridModule,
    AgGridModule,
    SharedModule,
    MatChipsModule,
    DragDropModule,
    MatButtonToggleModule,
    UserItemDialogsModule,
  ],
})
export class RecipeModule {}
