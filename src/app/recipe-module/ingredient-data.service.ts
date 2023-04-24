import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { AppSettingsService } from '../services/app-settings.service';
import { Ingredient, IngredientBase } from './models/ingredient';

@Injectable({
  providedIn: 'root',
})
export class IngredientDataService {
  private serverUri: string = '';

  constructor(
    private settingsService: AppSettingsService,
    private http: HttpClient
  ) {
    this.settingsService.settingsSubject.subscribe((x) => {
      this.serverUri = `${x.apiUri as string}/ingredients`;
    });
  }

  public getIngredients(): Observable<Array<IngredientBase>> {
    return this.http.get<Array<IngredientBase>>(`${this.serverUri}`);
  }

  public addIngredient(ing: Ingredient): Observable<number> {
    return this.http
      .post<number>(`${this.serverUri}`, ing)
      .pipe(catchError(() => of(-1)));
  }

  public addUserIngredient(ingredientId: number): Observable<number> {
    return this.http
      .post<number>(`${this.serverUri}/user`, { id: ingredientId })
      .pipe(catchError(() => of(-1)));
  }
}
