import { DialogData } from '../models/dialog-data';

export abstract class IDialogFormData {
  public abstract setDialogData?(dialogData: DialogData): void;
  public abstract setFormData?(formData: any): void;
}
