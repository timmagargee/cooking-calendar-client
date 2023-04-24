import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Platform } from '@angular/cdk/platform';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  NativeDateAdapter,
} from '@angular/material/core';
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
import { ShellComponent } from './shell/shell.component';
import { ToastComponent } from './toast/toast.component';
import { JwtInterceptor } from './utilities/jwt.interceptor';

export function appInit(settingsHttpService: AppSettingsHttpService): any {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return () => settingsHttpService.initializeApp();
}

export class AppDateAdapter extends NativeDateAdapter {
  public override format(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
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
    MatNativeDateModule,
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
        verticalPosition: 'bottom',
      },
    },
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
      deps: [MAT_DATE_LOCALE, Platform],
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AccountService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
