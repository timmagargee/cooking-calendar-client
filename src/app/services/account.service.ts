import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  login(user: User) {
    return this.http.post<LoginDto>(`${this.serverUri}/login`, user).pipe(
      map((dto) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', dto.token);
        this.tokenSubject.next(dto.token);
        return dto.token;
      })
    );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  createAccount(user: User) {
    return this.http.post(`${this.serverUri}/create`, user);
  }
}
