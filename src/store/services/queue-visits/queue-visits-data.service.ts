import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Visit } from './../../../models/IVisit';
import { servicePoint } from './../data.service';
import { GlobalErrorHandler } from '../../../util/services//global-error-handler.service';




@Injectable()
export class QueueVisitsDataService {
  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler) { }

  getQueueVisitInformation(branchId: number,queueId:number): Observable<any> {
    return this.http
      .get(`${servicePoint}/branches/${branchId}/queues/${queueId}/visits/full`)
      .pipe(map((data) => {
        return this.processQueueInfo(data);
      }))
      .pipe(catchError(this.errorHandler.handleError()));
  }


  
  private formatTimeHHMM(totalSeconds) {
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);

    var result = (hours < 10 ? "0" + hours : hours);
    result += ":" + (minutes < 10 ? "0" + minutes : minutes);
    return result;
} 

private addHyphonIfInvalidValue(visit) {
  for (var key in visit) {
      if (visit.hasOwnProperty(key)) {
          if (visit[key] == undefined || visit[key] == "") {
              visit[key] = "-";
          }
      }
  }
}

private processQueueInfo( data){
  var visitList=[];
  for (var i = 0; i < data.length; i++) {
    var visit = data[i];
    visit.customerName = visit.parameterMap.customers;
    visit.serviceName = visit.currentVisitService.serviceExternalName;
    visit.waitingTime = this.formatTimeHHMM(visit.waitingTime);
    visit.ticketNumber = visit.ticketId;
    this.addHyphonIfInvalidValue(visit);
    visitList.push(visit);
  }


return visitList; 
}
}





