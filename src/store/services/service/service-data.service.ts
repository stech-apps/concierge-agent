import { forkJoin } from 'rxjs';
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

import { IServiceResponse } from '../../../models/IServiceResponse';
import { IServiceGroup } from '../../../models/IServiceGroup';
import { ICalendarServiceResponse } from '../../../models/ICalendarServiceResponse';
import { IBranch } from '../../../models/IBranch';
import { IService } from '../../../models/IService';
import { IServiceConfiguration } from '../../../models/IServiceConfiguration';

@Injectable()
export class ServiceDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) {}

  getServices(branch: IBranch): Observable<IService[]> {
    return this.http
      .get<IService[]>(`${servicePoint}/branches/${branch.id}/services/`)
      .pipe(catchError(this.errorHandler.handleError()));
  }

  getServicesConfiguration(branch: IBranch, services: IService[]): Observable<IServiceConfiguration[]> {
    const fetchRequests = Object.keys(services).map((key, index) => {
      return this.http.get<IServiceConfiguration>(`${servicePoint}/branches/${branch.id}/services/${services[index].id}/configuration`);
    });

     return forkJoin(
       fetchRequests.slice(0)
      )
      .pipe(
        catchError(this.errorHandler.handleError())
      );
  }
}
