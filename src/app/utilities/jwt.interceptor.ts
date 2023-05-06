import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { USER_TOKEN } from '../models/enums/local-storage-constants';
import { AppSettingsService } from '../services/app-settings.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private settingsService: AppSettingsService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const token = localStorage.getItem(USER_TOKEN);
    //const token = this.accountService.tokenValue;
    const isLoggedIn = token !== null;
    const isApiUrl = request.url.startsWith(
      this.settingsService.settings.apiUri!
    );
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
