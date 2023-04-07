import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { AccountService } from './services/account.service';
import { AppSettingsHttpService } from './services/app-settings-http.service';
import { ToastService } from './services/toast.service';
import { ShellComponent } from './shell/shell.component';
import { ToastComponent } from './toast/toast.component';
import { JwtInterceptor } from './utilities/jwt.interceptor';

export function appInit(settingsHttpService: AppSettingsHttpService): any {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return () => settingsHttpService.initializeApp();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ToastComponent,
    ShellComponent,
    MenuComponent,
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    MatSidenavModule,
    MatMenuModule,
    ScrollingModule,
    AppRoutingModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    NgbModule,
    MatSnackBarModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      deps: [AppSettingsHttpService],
      multi: true,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ToastService,
    AccountService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
