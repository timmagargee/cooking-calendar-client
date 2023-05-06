import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ShoppingRoutingModule } from './shopping-routing.module';
import { ShoppingComponent } from './shopping/shopping.component';
import { EnteredItemListComponent } from './entered-item-list/entered-item-list.component';

@NgModule({
  declarations: [ShoppingComponent, EnteredItemListComponent],
  imports: [CommonModule, ShoppingRoutingModule, SharedModule],
})
export class ShoppingModule {}
