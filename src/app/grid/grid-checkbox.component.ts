import { Component } from '@angular/core';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Observable, of } from 'rxjs';

export interface IGridCheckboxParams {
  invert: boolean;
  readonly?: Observable<boolean> | boolean;
}

@Component({
  selector: 'app-grid-checkbox',
  template: `
    <input
      *ngIf="!(isReadonly() | async); else readonlyCheck"
      type="checkbox"
      [checked]="checked"
      (change)="onChange($event)"
      class="grid-checkbox pointer"
    />
    <ng-template #readonlyCheck>
      <fa-icon
        *ngIf="checked; else unchecked"
        [icon]="faCheckSquare"
        size="lg"
        style="color: #767676"
      ></fa-icon>
    </ng-template>
    <ng-template #unchecked>
      <fa-icon
        #unchecked
        [icon]="faSquare"
        size="lg"
        style="color: #767676"
      ></fa-icon>
    </ng-template>
  `,
})
export class GridCheckboxComponent implements ICellRendererAngularComp {
  public params!: ICellRendererParams & IGridCheckboxParams;
  public checked = false;

  public faCheckSquare = faCheckSquare;
  public faSquare = faSquare;

  private fieldName = '';

  public agInit(params: ICellRendererParams & IGridCheckboxParams): void {
    this.params = params;
    this.fieldName = params.colDef?.field || '';
    this.setChecked(params);
  }

  public onChange(event: Event): void {
    const checked = (event?.target as HTMLInputElement)?.checked;
    this.params.setValue!(this.params.invert ? !checked : checked);
  }

  public refresh(params: ICellRendererParams & IGridCheckboxParams): boolean {
    this.setChecked(params);
    return true;
  }

  public isReadonly(): Observable<boolean> {
    if (!this.params?.readonly) {
      return of(true);
    }

    if (typeof this.params.readonly == 'boolean') {
      return of(this.params.readonly);
    } else {
      return this.params.readonly;
    }
  }

  private setChecked(params: ICellRendererParams & IGridCheckboxParams): void {
    const value = params.data[this.fieldName];
    this.checked = params.invert ? !value : value;
  }
}
