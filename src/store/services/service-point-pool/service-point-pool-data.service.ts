import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Observable } from 'rxjs';
import { IServicePointPool } from '../../../models/IServicePointPool';
import { catchError, map } from 'rxjs/operators';
import {
    servicePoint,
    DataServiceError
} from '../data.service';

@Injectable()
export class ServicePointPoolDataService {
    constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) { }
    getServicePoints(branchId: number): Observable<IServicePointPool[]> {
        return this.http  
        .get<IServicePointPool[]>(`${servicePoint}/branches/${branchId}/servicePoints/validForServicePointPoolTransfer`)
        .pipe(catchError(this.errorHandler.handleError()));
    }
}