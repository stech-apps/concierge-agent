import { catchError } from 'rxjs/operators';
import { GlobalErrorHandler } from '../../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { DataServiceError, servicePoint } from '../data.service';

import { IUserStatus } from '../../../models/IUserStatus';

@Injectable()
export class UserStatusDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) {}

  getUserStatus(): Observable<IUserStatus> {
    return this.http
      .get<IUserStatus>(`${servicePoint}/user/status`)
      .pipe(catchError(this.errorHandler.handleError()));
  }
}
