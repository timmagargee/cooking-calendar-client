import { Component } from '@angular/core';
import { NewRecipe } from '../models/new-recipe';

@Component({
  selector: 'app-add-recipe-form',
  templateUrl: './add-recipe-form.component.html',
  styleUrls: ['./add-recipe-form.component.scss'],
})
export class AddRecipeFormComponent {
  public formData!: NewRecipe;
  public setFormData(formData: NewRecipe): void {
    this.formData = formData;
  }
}
