import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export class AppSettings {
  public apiUri?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  public settingsSubject = new ReplaySubject<AppSettings>();
  public settings: AppSettings = new AppSettings();

  public constructor() {}

  public updateSettings(appSettings: AppSettings): void {
    this.settings = appSettings;
    this.settingsSubject.next(this.settings);
  }
}
