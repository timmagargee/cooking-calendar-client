import { TemplateRef, Type } from '@angular/core';

import { DialogButtons } from './dialog-buttons';
import { DialogResult } from './dialog-result';

export interface DialogData {
  title?: string;
  message?: string;
  template?: TemplateRef<any>;
  component?: Type<any>;
  componentData?: any;
  buttons: DialogButtons;

  yesButtonText?: string;
  noButtonText?: string;
  cancelButtonText?: string;

  width?: string;
  height?: string;

  validityCallback?: () => boolean;
  beforeCloseCallback?: (result: DialogResult) => void;
}

export function GetDeleteDialog(itemToDelete: string): DialogData {
  return {
    title: `Delete ${itemToDelete}`,
    message: 'Are you sure?',
    buttons: DialogButtons.YesCancel,
    yesButtonText: 'Delete',
  };
}
