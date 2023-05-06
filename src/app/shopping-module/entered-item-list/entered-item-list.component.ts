import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  faCheck,
  faCirclePlus,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { ShoppingCategory } from '../models/shopping-category';
import { EnteredItem } from '../models/shopping-list-dto';

@Component({
  selector: 'app-entered-item-list',
  templateUrl: './entered-item-list.component.html',
  styleUrls: ['./entered-item-list.component.scss'],
})
export class EnteredItemListComponent {
  @Input() heading!: string;
  @Input() list!: Array<EnteredItem>;
  @Input() category!: ShoppingCategory;
  @Output() change = new EventEmitter<void>();

  public editIcon = faPenToSquare;
  public addIcon = faCirclePlus;
  public doneEditingIcon = faCheck;

  public editMade() {
    this.change.next();
  }

  public addItem() {
    this.list.push({
      name: '',
      isChecked: false,
      category: this.category,
      isBeingEdited: true,
    });
    this.editMade();
  }
}
