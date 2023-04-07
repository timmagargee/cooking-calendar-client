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
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  createAccount(user: User) {
    return this.http.post(`${this.serverUri}/create`, user);
  }

  // getAll() {
  //   return this.http.get<User[]>(`${this.serverUri}/users`);
  // }

  // getById(id: string) {
  //   return this.http.get<User>(`${this.serverUri}/${id}`);
  // }

  // update(id: string, params: any) {
  //   return this.http.put(`${this.serverUri}/users/${id}`, params).pipe(
  //     map((x) => {
  //       // update stored user if the logged in user updated their own record
  //       if (id == this.userValue?.id) {
  //         // update local storage
  //         const user = { ...this.userValue, ...params };
  //         localStorage.setItem('user', JSON.stringify(user));

  //         // publish updated user to subscribers
  //         this.userSubject.next(user);
  //       }
  //       return x;
  //     })
  //   );
  // }

  // delete(id: string) {
  //   return this.http.delete(`${this.serverUri}/users/${id}`).pipe(
  //     map((x) => {
  //       // auto logout if the logged in user deleted their own record
  //       if (id == this.userValue?.id) {
  //         this.logout();
  //       }
  //       return x;
  //     })
  //   );
  // }
}
