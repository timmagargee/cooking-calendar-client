import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DialogComponent } from './dialog/dialog.component';
import { DialogData } from './models/dialog-data';
import { DialogResult } from './models/dialog-result';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogRef: MatDialogRef<DialogComponent, any> | undefined;

  public constructor(private dialog: MatDialog) {}

  public display(dialogData: DialogData): Observable<DialogResult> {
    this.dialogRef = this.dialog.open(DialogComponent, {
      data: dialogData,
      disableClose: true,
    });
    this.dialogRef.updateSize(dialogData.width, dialogData.height);

    return this.dialogRef.beforeClosed().pipe(
      map((x) => {
        if (dialogData.beforeCloseCallback) {
          dialogData.beforeCloseCallback(x as DialogResult);
        }
        return x as DialogResult;
      })
    );
  }

  public closeAll(): void {
    this.dialog.closeAll();
  }
}
