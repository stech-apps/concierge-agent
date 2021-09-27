import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';

import { calendarPublicEndpointV2, DataServiceError } from '../data.service';
import { IBookingInformation } from '../../../models/IBookingInformation';
import { ITimeSlotResponse } from '../../../models/ITimeSlotResponse';
import { GlobalErrorHandler } from '../../../util/services/global-error-handler.service';
import { SystemInfoSelectors } from '../system-info';

@Injectable()
export class TimeslotDataService {
  hostAddress: string;
  private subscriptions: Subscription = new Subscription();

  constructor(private http: HttpClient,private errorHandler:GlobalErrorHandler, private systemInfoSelector: SystemInfoSelectors) {
    const hostSubscription = this.systemInfoSelector.centralHostAddress$.subscribe((info) => this.hostAddress = info);
    this.subscriptions.add(hostSubscription);
  }

  getTimeslots(bookingInformation: IBookingInformation): Observable<ITimeSlotResponse> {
    return this.http
      .get<ITimeSlotResponse>
      (
        `${this.hostAddress}${calendarPublicEndpointV2}/branches/`
        + `${bookingInformation.branchPublicId}/dates/`
        + `${bookingInformation.date}/times`
        + `${bookingInformation.serviceQuery}`
        + `;numberOfCustomers=${bookingInformation.numberOfCustomers}`
      ).pipe(
        catchError(this.errorHandler.handleError(true))
      );
  }
  getTimeslotsByVistors(bookingInformation: IBookingInformation): Observable<ITimeSlotResponse> {
    return this.http
      .get<ITimeSlotResponse>
      (
        `${this.hostAddress}${calendarPublicEndpointV2}/branches/`
        + `${bookingInformation.branchPublicId}/dates/`
        + `${bookingInformation.date}/times`
        + `${bookingInformation.serviceQuery}`
        + `;customSlotLength=${bookingInformation.customSlotLength}`
      ).pipe(
        catchError(this.errorHandler.handleError(true))
      );
  }
}
