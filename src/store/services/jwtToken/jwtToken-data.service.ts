import { catchError } from 'rxjs/operators';
import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { DataServiceError, restEndpoint } from '../data.service';

import { IJWTToken } from '../../../models/IJWTToken';

@Injectable()
export class JWTTokenDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) {}

  getJWTToken(): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http
      .get(`${restEndpoint}/security/jwt/`, { headers, responseType: 'text'})
      .pipe();
  }
}
