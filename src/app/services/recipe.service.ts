import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { AppSettingsService } from './app-settings.service';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private serverUri: string;

  constructor(
    private http: HttpClient,
    private settingsService: AppSettingsService
  ) {
    this.serverUri = `${
      this.settingsService.settings.apiUri as string
    }/recipes`;
  }

  public getRecipe(id: number) {
    return this.http.get(`${this.serverUri}/${id}`).pipe(
      map((test) => {
        return test;
      })
    );
  }
}
