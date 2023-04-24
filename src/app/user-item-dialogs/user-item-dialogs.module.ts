import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { IngredientComponent } from './ingredient/ingredient.component';
import { UserItemService } from './user-item.service';

@NgModule({
  declarations: [IngredientComponent],
  providers: [UserItemService],
  imports: [CommonModule, SharedModule, MatDialogModule, FontAwesomeModule],
})
export class UserItemDialogsModule {}
