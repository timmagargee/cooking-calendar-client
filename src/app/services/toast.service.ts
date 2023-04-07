import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public constructor(private snackBar: MatSnackBar, private zone: NgZone) {}

  public showToast(message: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: message,
      panelClass: ['snackbar-gray'],
    });
  }
}
