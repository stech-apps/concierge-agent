import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { qsystemEndpoint,restEndpoint, DataServiceError } from '../data.service';
import { ILicense } from './../../../models/ILicense';
import { GlobalErrorHandler } from 'src/util/services/global-error-handler.service';

const CONCIERGE_COMPONENT = 'Concierge';

@Injectable()
export class LicenseDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) {}

  getInfo(): Observable<Object> {
    return this.http
      .get<Object>(`${restEndpoint}/license`).pipe(map((res: {components: [ILicense]}) => {
        const isValidLicense = res.components.reduce((result, next) => {
               if (next.name === CONCIERGE_COMPONENT) {
                   result = result || (+next.licensedAmount > 0);
               }  
               return result;
          }, false);
          return isValidLicense;
      }), catchError(this.errorHandler.handleError()));
  }
}
