import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  calendarEndpoint,
  calendarPublicEndpoint,
  DataServiceError,
  servicePoint,
  calendarPublicEndpointV2
} from '../data.service';

import { IServiceGroup } from '../../../models/IServiceGroup';
import { ICalendarServiceResponse } from '../../../models/ICalendarServiceResponse';
import { ICalendarBranch } from '../../../models/ICalendarBranch';
import { ICalendarService } from '../../../models/ICalendarService';

@Injectable()
export class CalendarServiceDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) {}

  getCalendarServices(branch: ICalendarBranch): Observable<ICalendarServiceResponse> {
    return this.http
      .get<ICalendarServiceResponse>(`${calendarPublicEndpointV2}/branches/${branch.publicId}/services/groups`)
      .pipe(catchError(this.errorHandler.handleError()));
  }

  getServiceGroups(services: ICalendarService[], branch: ICalendarBranch): Observable<ICalendarServiceResponse> {
    var serviceIds = ""
    services.forEach(val => {
      serviceIds = serviceIds + 'servicePublicId=' + val.publicId + ';';
    })
    return this.http
      .get<ICalendarServiceResponse>(`${calendarPublicEndpointV2}/branches/${branch.publicId}/services/groups;${serviceIds}`)
      .pipe(catchError(this.errorHandler.handleError()));
  }
}
