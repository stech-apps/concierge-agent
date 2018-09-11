import { UserRole } from './../../../models/UserPermissionsEnum';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IAccount } from './../../../models/IAccount';
import { managementEndpoint, DataServiceError, servicePoint } from './../data.service';
import { GlobalErrorHandler } from '../../../util/services//global-error-handler.service';
import { userRoleFactory } from 'src/helpers/user-role-factory';

const CONNECT_CONCIERGE = 'connectconcierge';
const CONCIERGE = 'concierge';
const STAFF_SUPER_ADMIN_ROLE = '*';

@Injectable()
export class QueueDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) { }

  getQueueInformation(branchId: number): Observable<any> {
    return this.http
      .get<IAccount>(`${managementEndpoint}/branches/${branchId}/queues`)
      .pipe(catchError(this.errorHandler.handleError()));
  }

  getSelectedVist(branchId: number, searchText:string): Observable<any> {
    return this.http
      .get<IAccount>(`${servicePoint}/branches/${branchId}/visits;ticketId=${searchText}`)
      .pipe(catchError(this.errorHandler.handleError()));
  }
}
