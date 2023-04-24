import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { HomeComponent } from './home/home.component';
import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./account-module/account.module').then(
            (x) => x.AccountModule
          ),
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('./calendar-module/calendar.module').then(
            (x) => x.CalendarModule
          ),
      },
      {
        path: 'recipe',
        loadChildren: () =>
          import('./recipe-module/recipe.module').then((x) => x.RecipeModule),
      },
      {
        path: 'shopping',
        loadChildren: () =>
          import('./shopping-module/shopping.module').then(
            (x) => x.ShoppingModule
          ),
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login-module/login.module').then((x) => x.LoginModule),
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
