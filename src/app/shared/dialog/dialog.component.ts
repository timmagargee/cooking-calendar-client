import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogHostDirective } from '../dialog-host.directive';
import { DialogButtons } from '../models/dialog-buttons';
import { DialogData } from '../models/dialog-data';
import { DialogResult } from '../models/dialog-result';
import { IDialogFormData } from './dialog-form-data';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @ViewChild(DialogHostDirective, { static: true })
  private dialogHost!: DialogHostDirective;

  public yesButtonText: string;
  public noButtonText: string;
  public cancelButtonText: string;

  public showYesButton: boolean;
  public showNoButton: boolean;
  public showCancelbutton: boolean;

  public result = DialogResult;

  public constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.yesButtonText = data.yesButtonText || 'Yes';
    this.noButtonText = data.noButtonText || 'No';
    this.cancelButtonText = data.cancelButtonText || 'Cancel';
    this.showYesButton = true;

    switch (data.buttons) {
      case DialogButtons.YesNo:
        this.showNoButton = true;
        this.showCancelbutton = false;
        break;
      case DialogButtons.YesCancel:
        this.showNoButton = false;
        this.showCancelbutton = true;
        break;
      case DialogButtons.YesNoCancel:
        this.showNoButton = true;
        this.showCancelbutton = true;
        break;
      default:
        this.showNoButton = false;
        this.showCancelbutton = false;
    }
  }

  public ngOnInit(): void {
    if (this.data.component) {
      const viewContainerRef = this.dialogHost.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent<IDialogFormData>(
        this.data.component
      );
      if (componentRef.instance.setDialogData) {
        componentRef.instance.setDialogData(this.data);
      }
      if (componentRef.instance.setFormData && this.data.componentData) {
        componentRef.instance.setFormData(this.data.componentData);
      }
    }
  }

  public isValid(): boolean {
    if (this.data.validityCallback) {
      return this.data.validityCallback();
    }

    return true;
  }
}
