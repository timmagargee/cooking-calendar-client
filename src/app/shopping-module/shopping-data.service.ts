import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, of } from 'rxjs';
import { DateFilters } from '../calendar-module/models/date-filters';
import { GetMeasurementString } from '../models/enums/measurement-type';
import { AppSettingsService } from '../services/app-settings.service';
import { RoundNumber } from '../utilities/number-utility';
import { ShoppingListDto } from './models/shopping-list-dto';

@Injectable({ providedIn: 'root' })
export class ShoppingDataService {
  private serverUri: string = '';

  constructor(
    private http: HttpClient,
    private settingsService: AppSettingsService
  ) {
    this.settingsService.settingsSubject.subscribe((x) => {
      this.serverUri = `${x.apiUri as string}/shopping`;
    });
  }

  public getShoppingList() {
    return this.http.get<ShoppingListDto>(`${this.serverUri}`).pipe(
      map((x) => {
        if (x) {
          x.generatedItems.forEach((item) => {
            item.measLabel = `${RoundNumber(
              item.amount
            )} ${GetMeasurementString(item.measurementType)}`;
          });
        }
        return x;
      })
    );
  }

  public generateShoppingList(filters: DateFilters) {
    return this.http.post<boolean>(`${this.serverUri}`, filters).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public updateShoppingList(list: ShoppingListDto) {
    return this.http.put<boolean>(`${this.serverUri}`, list).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  public clearCheckedItems(id: number) {
    return this.http.delete<boolean>(`${this.serverUri}/${id}/checked`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
