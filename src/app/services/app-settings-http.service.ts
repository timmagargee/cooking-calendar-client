import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom } from 'rxjs';

import { AppSettings, AppSettingsService } from './app-settings.service';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsHttpService {
  public constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}

  public initializeApp(): Promise<any> {
    return new Promise<void>((resolve) => {
      let params: HttpParams = new HttpParams();
      //params = params.set('NO_TOKEN', 'true');
      var test = this.http
        .get<AppSettings>('assets/settings.local.json', { params })
        .pipe(
          catchError(() =>
            this.http.get<AppSettings>('assets/settings.json', { params })
          )
        );

      firstValueFrom(test).then((response) => {
        console.log('RESPONSE FROM ASSETS/SETTING.JSON');
        console.log(response);
        this.appSettingsService.updateSettings(response as AppSettings);
        resolve();
      });
    });
  }
}
