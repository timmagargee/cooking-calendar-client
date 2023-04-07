import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomInputsModule } from '../custom-inputs/custom-inputs.module';
import { CreateAccountComponent } from './create-account/create-account.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LoginComponent, CreateAccountComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    MatSnackBarModule,
    LoginRoutingModule,
    CommonModule,
    CustomInputsModule,
    FormsModule,
    NgbModule,
  ],
})
export class LoginModule {}
