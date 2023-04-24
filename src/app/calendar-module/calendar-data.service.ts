import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, of } from 'rxjs';
import { Category } from '../models/category-dto';
import { AppSettingsService } from '../services/app-settings.service';
import { AssignMealDto } from './models/assign-meal-dto';
import { CalendarDto } from './models/calendar-dto';
import { DateFilters } from './models/date-filters';
import { MealDto } from './models/meal-dto';

@Injectable({ providedIn: 'root' })
export class CalendarDataService {
  private serverUri: string = '';

  constructor(
    private http: HttpClient,
    private settingsService: AppSettingsService
  ) {
    this.settingsService.settingsSubject.subscribe((x) => {
      this.serverUri = `${x.apiUri as string}/calendars`;
    });
  }

  public getCalendar() {
    return this.http.get<CalendarDto>(`${this.serverUri}`);
  }

  public getCalendarMeals(id: number, filters: DateFilters) {
    const options = {
      params: new HttpParams()
        .set('startDate', filters.startDate.toISOString())
        .set('endDate', filters.endDate.toISOString()),
    };
    return this.http.get<Array<MealDto>>(
      `${this.serverUri}/${id}/meals`,
      options
    );
  }

  public updateCategory(calId: number, cat: Category) {
    return this.http.put(`${this.serverUri}/${calId}/category`, cat).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public assignMealToDate(meal: AssignMealDto) {
    return this.http.put(`${this.serverUri}/meal`, meal).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public generateMealPlan(calId: number, filters: DateFilters) {
    return this.http.post(`${this.serverUri}/${calId}/generate`, filters).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
