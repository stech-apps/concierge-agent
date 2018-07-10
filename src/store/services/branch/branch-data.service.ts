import { IBranch } from './../../../models/IBranch';
import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { calendarPublicEndpoint, DataServiceError, servicePoint } from '../data.service';



@Injectable()
export class BranchDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) {}

  getBranches(): Observable<IBranch[]> {
    return this.http
      .get<IBranch[]>(`${servicePoint}/branches/`)
      .pipe(catchError(this.errorHandler.handleError()));
  }
}
