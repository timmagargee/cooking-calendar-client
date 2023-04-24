import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomInputsModule } from '../custom-inputs/custom-inputs.module';
import { DialogHostDirective } from './dialog-host.directive';
import { DialogService } from './dialog.service';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [DialogComponent, DialogHostDirective],
  providers: [DialogService],
  imports: [
    CommonModule,
    MatDialogModule,
    CustomInputsModule,
    FormsModule,
    FontAwesomeModule,
    MatSnackBarModule,
  ],
  exports: [
    MatDialogModule,
    DialogComponent,
    CustomInputsModule,
    FormsModule,
    FontAwesomeModule,
    MatSnackBarModule,
  ],
})
export class SharedModule {}
