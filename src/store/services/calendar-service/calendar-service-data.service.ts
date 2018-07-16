import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  calendarEndpoint,
  calendarPublicEndpoint,
  DataServiceError,
  servicePoint
} from '../data.service';

import { IServiceGroup } from '../../../models/IServiceGroup';
import { ICalendarServiceResponse } from '../../../models/ICalendarServiceResponse';

@Injectable()
export class CalendarServiceDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) {}

  getCalendarServices(): Observable<ICalendarServiceResponse> {
    return this.http
      .get<ICalendarServiceResponse>(`${calendarPublicEndpoint}/services/`)
      .pipe(catchError(this.errorHandler.handleError()));
  }

  getServiceGroups(servicePublicIds: string): Observable<IServiceGroup[]> {
    return this.http
      .get<IServiceGroup[]>(`${calendarPublicEndpoint}/services/groups${servicePublicIds}`)
      .pipe(catchError(this.errorHandler.handleError()));
  }
}
