import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private accountService: AccountService,
    private recipeService: RecipeService
  ) {}

  public callGetRecipe() {
    this.recipeService.getRecipe(1).subscribe();
  }
}
