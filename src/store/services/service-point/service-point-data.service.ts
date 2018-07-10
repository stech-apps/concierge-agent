import { IServicePoint } from './../../../models/IServicePoint';
import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
    servicePoint,
    DataServiceError
} from '../data.service';

import { IServicePointResponse } from 'src/models/IServicePointResponse';

@Injectable()
export class ServicePointDataService {
    constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) { }

    getServicePoints(): Observable<IServicePointResponse> {
        return this.http
            .get<Array<IServicePoint>>(`${servicePoint}/branches/1/servicePoints/deviceTypes/SW_CONNECT_CONCIERGE/full`)
            .pipe(map(sps => {
                return {
                    servicePoints: sps
                };
            }))
            .pipe(catchError(this.errorHandler.handleError()));
    }
}
