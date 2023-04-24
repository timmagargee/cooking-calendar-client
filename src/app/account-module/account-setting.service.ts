import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  public getSettings() {
    return this.http.get<UserSettingsDto>(`${this.serverUri}/login`);
  }
}
