import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IStaffPool } from '../../../models/IStaffPool';

import { calendarPublicEndpoint, DataServiceError, servicePoint } from '../data.service';

@Injectable()
export class StaffPoolDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) {}

  getStaffPool(branchId: number): Observable<IStaffPool[]> {
    return this.http
      .get<IStaffPool[]>(`${servicePoint}/branches/${branchId}/users/validForUserPoolTransfer/`)
      .pipe(catchError(this.errorHandler.handleError()));
  }
}