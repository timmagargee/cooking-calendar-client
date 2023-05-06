import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgGridModule } from 'ag-grid-angular';
import { GridCheckboxComponent } from './grid-checkbox.component';

@NgModule({
  declarations: [GridCheckboxComponent],
  imports: [CommonModule, AgGridModule, FontAwesomeModule],
  exports: [AgGridModule, GridCheckboxComponent],
})
export class GridModule {}
