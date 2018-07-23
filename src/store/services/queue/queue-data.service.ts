import { UserRole } from './../../../models/UserPermissionsEnum';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IAccount } from './../../../models/IAccount';
import { managementEndpoint, DataServiceError } from './../data.service';
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
      .pipe(map((data: any) => {
        return this.processQueueInfo(data);
      }))
      .pipe(catchError(this.errorHandler.handleError()));
  }

  private processEstWaitingTime(time) {
    var tmp = time
    var bounds = {upper: undefined, lower: undefined, single: undefined};
    var counter = 0;
    var factor = 5	

    if (tmp < 5) {
        bounds.single = "< 5";
        return bounds.single;
    }

    while (tmp % factor > 0) {
        counter++;
        tmp--;
    }

 //handle cases dividable by 5
    if (counter === 0 && tmp % factor === 0) {
        bounds.lower = tmp;
        bounds.upper = tmp+factor;
        return bounds.lower + "-" + bounds.upper;
    }

    bounds.lower = tmp;
    tmp = time
    while (tmp % factor > 0) {
        tmp++;
    }

    bounds.upper = tmp;
    return bounds.lower + "-" + bounds.upper;
}


  private processQueueInfo(queueInfo) {
    var data = { queues: null, totalCustomersWaiting: null, maxWaitingTime: null }
    var queueInformation = [];
    var customerCount = 0;
    var est_w_time = undefined;
    var maxWT = 0;
    for (var i = 0; i < queueInfo.length; i++) {
      if (queueInfo[i].queueType === "APPOINTMENT_QUEUE") {
        continue;
      }
      customerCount = customerCount + queueInfo[i].customersWaiting;
      est_w_time = (queueInfo[i].estimatedWaitingTime === -1) ? "-" : this.processEstWaitingTime(
        Math.round(queueInfo[i].estimatedWaitingTime / 60));
      queueInformation.push({
        queue: queueInfo[i].name,
        customers: queueInfo[i].customersWaiting,
        max_w_time: Math.round(queueInfo[i].waitingTime / 60) == 0 ? "-" : Math.round(queueInfo[i].waitingTime / 60),
        est_w_time: est_w_time,
        waitingTime: queueInfo[i].waitingTime,
        serviceLevel: queueInfo[i].serviceLevel,
        id: queueInfo[i].id

      });

      var tmpMaxWT = Math.round(queueInfo[i].waitingTime / 60);
      if (tmpMaxWT > maxWT) {
        maxWT = Math.round(queueInfo[i].waitingTime / 60);
      }
    }

    data.queues = queueInformation
    data.totalCustomersWaiting = customerCount;
    data.maxWaitingTime = maxWT;
    return data;
  }
}
