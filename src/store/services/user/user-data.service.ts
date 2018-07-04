import { catchError } from 'rxjs/operators';
import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable} from 'rxjs';
import { DataServiceError, restEndpoint } from '../data.service';

import { IUser } from '../../../models/IUser';

@Injectable()
export class UserDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) {}

  getUserInfo(): Observable<IUser> {
    return this.http
      .get<IUser>(`${restEndpoint}/user`)
      .pipe(catchError(this.errorHandler.handleError()));
  }
}
