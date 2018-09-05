import { IAppointment } from 'src/models/IAppointment';
import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { calendarPublicEndpoint, DataServiceError, restEndpoint, calendarEndpoint } from '../data.service';
import { IAppointmentResponse } from '../../../models/IAppointmentResponse';
import { Observable } from 'rxjs';


@Injectable()
export class AppointmentDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) {}

  getAppointments(publicId: string): Observable<IAppointmentResponse> {
    return this.http
      .get<IAppointmentResponse>(`${calendarPublicEndpoint}/customers/${publicId}/appointments`)
      .pipe(catchError(this.errorHandler.handleError()));
  }

  searchAppointments(appointmentSearch: any): Observable<IAppointmentResponse> {
    let searchQuery =  `${restEndpoint}/appointment/appointments/search?branchId=${appointmentSearch.branchId}`;

    if(appointmentSearch.fromDate) {
      searchQuery += `&fromDate=${appointmentSearch.fromDate}`;
    }

    if(appointmentSearch.toDate) {
      searchQuery += `&toDate=${appointmentSearch.toDate}`;
    }

    if(appointmentSearch.id) {
      searchQuery = `${restEndpoint}/appointment/branches/${appointmentSearch.branchId}/appointments/${appointmentSearch.id}`;
    }

    if(appointmentSearch.customerId) {
      searchQuery = `${restEndpoint}/appointment/customers/${appointmentSearch.customerId}/appointments`;
    }
    
    return this.http
      .get<IAppointmentResponse>(searchQuery)
      .pipe((catchError)(this.errorHandler.handleError()));
  }

  rescheduleAppointment(appointment: IAppointment) {
    let url = `${calendarPublicEndpoint}/appointments/${appointment.publicId}/reschedule?end=${appointment.end}&start=${appointment.start}`;
      return this.http.put(url, null).pipe((catchError)(this.errorHandler.handleError()));
  }


  searchCalendarAppointments(appointmentSearch: any): Observable<IAppointmentResponse> {
    let searchQuery =  `${calendarEndpoint}/appointments?branch=${appointmentSearch.branchId}`;

    if(appointmentSearch.fromDate) {
      searchQuery += `&start=${appointmentSearch.fromDate}`;
    }

    if(appointmentSearch.toDate) {
      searchQuery += `&end=${appointmentSearch.toDate}`;
    }

    if(appointmentSearch.id) {
      searchQuery = `${calendarEndpoint}/appointments/search?qpId=${appointmentSearch.id}`;
    }

    if(appointmentSearch.customerId) {
      searchQuery = `${calendarEndpoint}/appointment/customers/${appointmentSearch.customerId}/appointments`;
    }
    
    return this.http
      .get<IAppointmentResponse>(searchQuery)
      .pipe((catchError)(this.errorHandler.handleError()));
  }

  deleteAppointment(appointment: IAppointment) {
    return this.http
      .delete(`${calendarPublicEndpoint}/appointments/${appointment.publicId}`)
      .pipe(catchError(this.errorHandler.handleError()));
  }
}
