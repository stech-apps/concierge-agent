import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
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
import { SystemInfoSelectors } from '../system-info';

@Injectable()
export class CalendarServiceDataService {
  hostAddress: string;
  private subscriptions: Subscription = new Subscription();

  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler, private systemInfoSelector: SystemInfoSelectors) {
    const hostSubscription = this.systemInfoSelector.centralHostAddress$.subscribe((info) => this.hostAddress = info);
    this.subscriptions.add(hostSubscription);
  }

  getCalendarServices(branch: ICalendarBranch): Observable<ICalendarServiceResponse> {
    return this.http
      .get<ICalendarServiceResponse>(`${this.hostAddress}${calendarPublicEndpointV2}/branches/${branch.publicId}/services/groups`)
      .pipe(catchError(this.errorHandler.handleError()));
  }

  getServiceGroups(services: ICalendarService[], branch: ICalendarBranch, isMultiServiceEnabled = true): Observable<ICalendarServiceResponse> {
    let serviceIds = "";

    if(isMultiServiceEnabled) {
      services.forEach(val => {
        serviceIds = serviceIds + 'servicePublicId=' + val.publicId + ';';
      });
    }
    
    return this.http
      .get<ICalendarServiceResponse>(`${this.hostAddress}${calendarPublicEndpointV2}/branches/${branch.publicId}/services/groups;${serviceIds}`)
      .pipe(catchError(this.errorHandler.handleError()));
  }


}
