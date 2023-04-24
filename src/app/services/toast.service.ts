import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionType } from '../models/enums/action-type';
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

  public showActionToast(action: ActionType, success: boolean) {
    this.snackBar.openFromComponent(ToastComponent, {
      data: `${this.getActionString(action)} ${
        success ? 'Successful' : 'Failed'
      }`,
      panelClass: ['snackbar-gray'],
    });
  }

  private getActionString(action: ActionType): string {
    switch (action) {
      case ActionType.delete:
        return 'Delete';
      case ActionType.generate:
        return 'Generation';
      default:
        return 'Save';
    }
  }
}
