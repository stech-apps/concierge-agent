import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import {Observable} from 'rxjs';

import { calendarPublicEndpointV2, DataServiceError } from '../data.service';
import { IBookingInformation } from '../../../models/IBookingInformation';
import { ITimeslotResponse } from '../../../models/ITimeslotResponse';

@Injectable()
export class TimeslotDataService {
  constructor(private http: HttpClient) {}

  getTimeslots(bookingInformation: IBookingInformation): Observable<ITimeslotResponse> {
    return this.http
      .get<ITimeslotResponse>
      (
        `${calendarPublicEndpointV2}/branches/`
        + `${bookingInformation.branchPublicId}/dates/`
        + `${bookingInformation.date}/times`
        + `${bookingInformation.serviceQuery}`
        + `;numberOfCustomers=${bookingInformation.numberOfCustomers}`
      );
  }
}
