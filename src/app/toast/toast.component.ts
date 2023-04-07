import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  public message!: string;
  public constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {
    this.message = data;
  }
}
