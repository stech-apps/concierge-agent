import { IAppointment } from 'src/models/IAppointment';
import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retryWhen, flatMap } from 'rxjs/operators';

import { calendarPublicEndpoint, DataServiceError, restEndpoint, calendarEndpoint } from '../data.service';
import { IAppointmentResponse } from '../../../models/IAppointmentResponse';
import { Observable, interval, throwError, of, Subscription } from 'rxjs';
import { SystemInfoSelectors } from '../system-info';


@Injectable()
export class AppointmentDataService {
  hostAddress: string;
  private subscriptions: Subscription = new Subscription();
  authorizationHeader: HttpHeaders;

  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler, private systemInfoSelector : SystemInfoSelectors) {
    const hostSubscription = this.systemInfoSelector.centralHostAddress$.subscribe((info) => this.hostAddress = info);
    this.subscriptions.add(hostSubscription);
    const authorizationSubscription = this.systemInfoSelector.authorizationHeader$.subscribe((info) => this.authorizationHeader = info);
    this.subscriptions.add(authorizationSubscription);
  }

  getAppointments(publicId: string): Observable<IAppointmentResponse> {
    return this.http
      .get<IAppointmentResponse>(`${this.hostAddress}${calendarPublicEndpoint}/customers/${publicId}/appointments`)
      .pipe(catchError(this.errorHandler.handleError(true)));
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
      .pipe(catchError(this.errorHandler.handleError(true)));
  }

  rescheduleAppointment(appointment: IAppointment) {
    let url = `${this.hostAddress}${calendarPublicEndpoint}/appointments/${appointment.publicId}/reschedule?end=${appointment.end}&start=${appointment.start}`;
      return this.http.put(url, null).pipe((catchError)(this.errorHandler.handleError(true)));
  }


  searchCalendarAppointments(appointmentSearch: any): Observable<IAppointmentResponse> {
    let searchQuery =  `${this.hostAddress}${calendarEndpoint}/appointments?branch=${appointmentSearch.branchId}`;

    if(appointmentSearch.fromDate) {
      searchQuery += `&start=${appointmentSearch.fromDate}`;
    }

    if(appointmentSearch.toDate) {
      searchQuery += `&end=${appointmentSearch.toDate}`;
    }

    if(appointmentSearch.id) {
      searchQuery = `${this.hostAddress}${calendarEndpoint}/appointments/search?qpId=${appointmentSearch.id}`;
    }

    if(appointmentSearch.customerId) {
      searchQuery = `${this.hostAddress}${calendarEndpoint}/appointments/customer/${appointmentSearch.customerId}/appointments`;
    }
    else {
      searchQuery += `&timeZoneBranchId=${appointmentSearch.branchId}`;
    }
    
    return this.http
      .get<IAppointmentResponse>(searchQuery, {headers : this.authorizationHeader })
      .pipe(this.retryForRobustness(), (catchError)(this.errorHandler.handleError(true)));
  }

  deleteAppointment(appointment: IAppointment) {
    return this.http
      .delete(`${this.hostAddress}${calendarPublicEndpoint}/appointments/${appointment.publicId}`)
      .pipe(catchError(this.errorHandler.handleError(true)));
  }

  retryForRobustness(maxRetry: number = 3, delayMs: number = 2000) {
    return (src: Observable<any>) => src.pipe(
      retryWhen(_ => {
        return interval(delayMs).pipe(
          flatMap(count => count == maxRetry ? throwError("Giving up") : of(count))
        )
      }),
    )
  }

  isNativeBrowser(): boolean {
    if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
      return true;
    }
    else {
      return false;
    }
  }
}
