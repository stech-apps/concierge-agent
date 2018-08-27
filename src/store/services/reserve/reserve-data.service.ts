import { IBookingInformation } from './../../../models/IBookingInformation';
import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {
  calendarPublicEndpointV2,
  calendarPublicEndpoint,
  DataServiceError
} from '../data.service';  

import { IAppointment } from '../../../models/IAppointment';


@Injectable()
export class ReserveDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) {}

  reserveAppointment(
    bookingInformation: IBookingInformation,
    appointment: IAppointment
  ): Observable<IAppointment> {
    return this.http
            .post<IAppointment>(
              `${calendarPublicEndpointV2}`
              + `/branches/${bookingInformation.branchPublicId}`
              + `/dates/${bookingInformation.date}`
              + `/times/${bookingInformation.time}/reserve;`
              + `numberOfCustomers=${bookingInformation.numberOfCustomers}`, appointment
            )
            .pipe(catchError(this.errorHandler.handleError({bookingInformation: bookingInformation, appointment: appointment})));
  }

  unreserveAppointment(reservationPublicId: string) {
    return this.http
            .delete<IAppointment>(`${calendarPublicEndpoint}/appointments/${reservationPublicId}`)
            .pipe(catchError(this.errorHandler.handleError()));
  }

  fetchReservableDates(bookingInformation: IBookingInformation): any {
    return this.http
            .get<IAppointment>(
              `${calendarPublicEndpointV2}`
              + `/branches/${bookingInformation.branchPublicId}/`
              + `dates;`
              + `${bookingInformation.serviceQuery};` 
              + `numberOfCustomers=${bookingInformation.numberOfCustomers}`
            )
            .pipe(catchError(this.errorHandler.handleError()));
  }
}
