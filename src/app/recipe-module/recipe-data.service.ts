import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { IdNameDto } from '../models/IdNameDto';
import { AppSettingsService } from '../services/app-settings.service';
import { NewRecipe } from './models/new-recipe';
import { Recipe } from './models/recipe';
import { RecipeSummary } from './models/recipe-summary';
import { TagDto } from './models/tag-dto';

@Injectable({
  providedIn: 'root',
})
export class RecipeDataService {
  private serverUri: string = '';

  constructor(
    private settingsService: AppSettingsService,
    private http: HttpClient
  ) {
    this.settingsService.settingsSubject.subscribe((x) => {
      this.serverUri = `${x.apiUri as string}/recipes`;
    });
  }

  public getRecipes(): Observable<Array<RecipeSummary>> {
    return this.http.get<Array<RecipeSummary>>(`${this.serverUri}`);
  }

  public getRecipe(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.serverUri}/${id}`);
  }

  public addRecipe(newRecipe: NewRecipe): Observable<number> {
    return this.http
      .post<number>(`${this.serverUri}`, newRecipe)
      .pipe(catchError(() => of(-1)));
  }

  public updateRecipe(recipe: Recipe): Observable<boolean> {
    return this.http
      .put<boolean>(`${this.serverUri}/${recipe.id!}`, recipe)
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  public deleteRecipe(recipeId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.serverUri}/${recipeId}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public addTag(newTag: TagDto): Observable<number> {
    return this.http
      .post<number>(`${this.serverUri}/tags`, newTag)
      .pipe(catchError(() => of(-1)));
  }

  public getTags(): Observable<Array<IdNameDto>> {
    return this.http.get<Array<IdNameDto>>(`${this.serverUri}/tags`);
  }
}
