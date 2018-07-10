import { UserRole } from 'src/models/UserPermissionsEnum';
import { GlobalErrorHandler } from './../../../util/services/global-error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IAccount } from './../../../models/IAccount';
import { servicePoint, DataServiceError } from './../data.service';
import {
  VISIT_USER_ROLE,
  APPOINTMENT_USER_ROLE,
  NO_ROLE
} from '../../reducers/user-role.reducer';

const CONCIERGE_ROLE = 'concierge';
const CONNECT_CONCIERGE_ROLE = 'connectconcierge';
const APPOINTMENT_ROLE = 'appointment';
const SERVICEPOINT_ROLE = 'servicePoint';
const CALENDAR_ROLE = 'calendar-client';
const SUPER_ADMIN_ROLE = '*';

@Injectable()
export class UserRoleDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) { }

  getUserRoleInfo(): Observable<UserRole> {
    return this.http
      .get<IAccount>(`${servicePoint}/account`)
      .pipe(map((res: { modules: string[] }) => {
        let isVisitUserRole = false;
        let isAppointmentUser = false;
        let isSuperAdminUser = false;

        if (res.modules.includes(SUPER_ADMIN_ROLE)) {
          isVisitUserRole = true;
          isAppointmentUser = true;
          isSuperAdminUser = true;
        }
        else if (res.modules.includes(CONCIERGE_ROLE) || res.modules.includes(CONNECT_CONCIERGE_ROLE)) {
          isVisitUserRole = res.modules.includes(SERVICEPOINT_ROLE);
          isAppointmentUser = res.modules.includes(CALENDAR_ROLE);
        }

        let userRole = UserRole.None;
        userRole = isVisitUserRole || isSuperAdminUser ? userRole & UserRole.VisitUserRole : userRole;
        userRole = isAppointmentUser || isSuperAdminUser ? userRole & UserRole.AppointmentUserRole : userRole;
        return userRole;
      }))
      .pipe(catchError(this.errorHandler.handleError()));
  }
}
