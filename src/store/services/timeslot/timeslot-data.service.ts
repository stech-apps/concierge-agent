import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import {Observable} from 'rxjs';

import { calendarPublicEndpointV2, DataServiceError } from '../data.service';
import { IBookingInformation } from '../../../models/IBookingInformation';
import { ITimeSlotResponse } from '../../../models/ITimeSlotResponse';
import { GlobalErrorHandler } from '../../../util/services/global-error-handler.service';

@Injectable()
export class TimeslotDataService {
  constructor(private http: HttpClient,private errorHandler:GlobalErrorHandler) {}

  getTimeslots(bookingInformation: IBookingInformation): Observable<ITimeSlotResponse> {
    return this.http
      .get<ITimeSlotResponse>
      (
        `${calendarPublicEndpointV2}/branches/`
        + `${bookingInformation.branchPublicId}/dates/`
        + `${bookingInformation.date}/times`
        + `${bookingInformation.serviceQuery}`
        + `;numberOfCustomers=${bookingInformation.numberOfCustomers}`
      ).pipe(
        catchError(this.errorHandler.handleError(true))
      );
  }
}
