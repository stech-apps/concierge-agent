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

  getQueueVisitInformation(branchId: number,queueId:number): Observable<Visit[]> {
    return this.http
      .get<Visit[]>(`${servicePoint}/branches/${branchId}/queues/${queueId}/visits/full`)
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

private formatHHMMSSIntoHHMM (time:string) {
  return time.substring(0,5);
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

private processQueueInfo( data:Visit[]){
  var visitList:Visit[]=[];
  for (var i = 0; i < data.length; i++) {
    var visit = data[i];
    visit.customerName = visit.parameterMap.customers;
    visit.serviceName = visit.currentVisitService.serviceExternalName;
    visit.waitingTimeStr = this.formatTimeHHMM(visit.waitingTime);
   visit.appointmentTime? visit.appointmentTime = this.formatHHMMSSIntoHHMM(visit.appointmentTime.split("T")[1]):null;
    this.addHyphonIfInvalidValue(visit);
    visitList.push(visit);
  }


return visitList; 
}
}





