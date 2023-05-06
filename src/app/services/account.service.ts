import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ChangePasswordDto } from '../account-module/models/change-password-dto';
import {
  USER_SETTINGS,
  USER_TOKEN,
} from '../models/enums/local-storage-constants';
import { LoginDto } from '../models/login-dto';
import { User } from '../models/user';
import { AppSettingsService } from './app-settings.service';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<String | null>;
  private serverUri: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private settingsService: AppSettingsService
  ) {
    this.settingsService.settingsSubject.subscribe((x) => {
      this.serverUri = `${x.apiUri as string}/auth`;
    });
    this.tokenSubject = new BehaviorSubject(localStorage.getItem('token'));
    this.token = this.tokenSubject.asObservable();
  }

  public get tokenValue() {
    return this.tokenSubject.value;
  }

  public login(user: User): Observable<string | boolean> {
    return this.http.post<LoginDto>(`${this.serverUri}/login`, user).pipe(
      map((dto) => {
        this.storeToken(dto);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  public logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem(USER_TOKEN);
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  public createAccount(user: User): Observable<string | boolean> {
    return this.http.post<LoginDto>(`${this.serverUri}/create`, user).pipe(
      map((dto) => {
        this.storeToken(dto);
        return true;
      }),
      catchError((x) => of(x.error))
    );
  }

  public changePassword(form: ChangePasswordDto): Observable<string | boolean> {
    return this.http
      .put<boolean>(`${this.serverUri}/update/password`, form)
      .pipe(
        map((x) => of(true)),
        catchError((x) => {
          return of(x.error);
        })
      );
  }

  private storeToken(dto: LoginDto) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.removeItem(USER_SETTINGS);
    localStorage.setItem(USER_TOKEN, dto.token);
    this.tokenSubject.next(dto.token);
  }
}
