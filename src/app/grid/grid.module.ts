import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [],
  imports: [CommonModule, AgGridModule],
  exports: [AgGridModule],
})
export class GridModule {}
