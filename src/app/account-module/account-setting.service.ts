import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map, of, tap } from 'rxjs';
import { USER_SETTINGS } from '../models/enums/local-storage-constants';
import { AppSettingsService } from '../services/app-settings.service';
import { UserSettingsDto } from './models/user-settings-dto';

@Injectable({ providedIn: 'root' })
export class AccountSettingsService {
  private serverUri: string = '';

  constructor(
    private http: HttpClient,
    private settingsService: AppSettingsService
  ) {
    this.settingsService.settingsSubject.subscribe((x) => {
      this.serverUri = `${x.apiUri as string}/settings`;
    });
  }

  public getSettings(): Observable<UserSettingsDto> {
    const settingsJson = localStorage.getItem(USER_SETTINGS);
    console.log(settingsJson);
    if (settingsJson) {
      return of(JSON.parse(settingsJson));
    }
    return this.http
      .get<UserSettingsDto>(`${this.serverUri}`)
      .pipe(tap((x) => localStorage.setItem(USER_SETTINGS, JSON.stringify(x))));
  }

  public getDoesUsernameExist(username: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.serverUri}/username/${username}/valid`
    );
  }

  public updateSettings(settings: UserSettingsDto): Observable<boolean> {
    return this.http.put(`${this.serverUri}`, settings).pipe(
      map(() => {
        localStorage.setItem(USER_SETTINGS, JSON.stringify(settings));
        return true;
      }),
      catchError(() => of(false))
    );
  }

  public deleteUser() {
    return this.http.delete(`${this.serverUri}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
