export enum PUBLIC_EVENTS {
    VISIT_CALL = "VISIT_CALL",
    USER_SERVICE_POINT_SESSION_END = "USER_SERVICE_POINT_SESSION_END",
    USER_SESSION_END = "USER_SESSION_END",
    PRINTER_ISSUE = "PRINTER_ISSUE",
    CREATE_APPOINTMENT = "CREATE_APPOINTMENT",
    UPDATE_APPOINTMENT = "UPDATE_APPOINTMENT",
    DELETE_APPOINTMENT = "DELETE_APPOINTMENT",
    VISIT_CREATE = "VISIT_CREATE",
    RESET = "RESET",
    VISIT_RECYCLE = "VISIT_RECYCLE",
    VISIT_NEXT = "VISIT_NEXT",
    VISIT_REMOVE = "VISIT_REMOVE",
    VISIT_TRANSFER_TO_QUEUE = "VISIT_TRANSFER_TO_QUEUE",
    VISIT_TRANSFER_TO_SERVICE_POINT_POOL = "VISIT_TRANSFER_TO_SERVICE_POINT_POOL",
    VISIT_TRANSFER_TO_USER_POOL = "VISIT_TRANSFER_TO_USER_POOL",
    VISIT_END_TRANSACTION = "VISIT_END_TRANSACTION"
}

import { Injectable } from '@angular/core';
import { NativeApiService } from '../../services/native-api.service'
import { LOGOUT_URL } from '../../url-helper';
import { Visit } from '../../../models/IVisit';
import { QueueDispatchers, ServicePointSelectors } from '../../../store';
import { servicePoint } from '../../../store/services/data.service';
import { IServicePoint } from '../../../models/IServicePoint';

@Injectable()
export class QEventsHelper {
    currentServicePoint:IServicePoint
    previousServicePoint:IServicePoint
  constructor(
    private nativeApi: NativeApiService,
    private queueDispatchers: QueueDispatchers,
    private ServicePointSelectors:ServicePointSelectors
  ) {
  }

  getChannelStr(str){
    return str.replace(new RegExp(':', 'g'), '/');
  }

  checkServerStatus(msg){
      if(msg.successful){
          console.log("done")
      }
      else{
          console.log("no");
      }
  }

  receiveEvent(msg){
    var processedEvent;
      try {
        processedEvent = JSON.parse(msg.data);
      } catch (err) {
          return;
      }

      if (typeof processedEvent.E === "undefined"
        || typeof processedEvent.E.evnt === "undefined") {
        return;
      }
      
      this.ServicePointSelectors.previousServicePoint$.subscribe((val)=>{
          this.previousServicePoint = val;
      });
      this.ServicePointSelectors.openServicePoint$.subscribe((val)=>{
        this.currentServicePoint = val;
      })
      
      switch (processedEvent.E.evnt) {
        case PUBLIC_EVENTS.USER_SERVICE_POINT_SESSION_END:   
                if(this.currentServicePoint==this.previousServicePoint){
                    if(this.nativeApi.isNativeBrowser()){
                        this.nativeApi.logOut();
                    }
                    else{
                        window.location.href =  LOGOUT_URL;
                    }
                }
                break;
        case PUBLIC_EVENTS.USER_SESSION_END:
        case PUBLIC_EVENTS.RESET:
           
            if(this.nativeApi.isNativeBrowser()){
                this.nativeApi.logOut();
            }
            else{
                window.location.href =  LOGOUT_URL;
            }
            break;  
        case PUBLIC_EVENTS.PRINTER_ISSUE:
            var errorCode = processedEvent.E.prm.error_code;
            var errorMsg = processedEvent.E.prm.error_msg;
            //errorHandler.notifyError(errorCode, errorMsg);
            break;
        case PUBLIC_EVENTS.CREATE_APPOINTMENT:
        case PUBLIC_EVENTS.UPDATE_APPOINTMENT:
        case PUBLIC_EVENTS.DELETE_APPOINTMENT:
            //appointment.updateAppointmentList(processedEvent);
            break;
        case PUBLIC_EVENTS.VISIT_CREATE:
            //appointment.updateAppointmentList(processedEvent);
            this.queueDispatchers.updateQueueInfo(this.buildVisitObject(processedEvent.E.prm, false), true);
            break;
        case PUBLIC_EVENTS.VISIT_NEXT:
        case PUBLIC_EVENTS.VISIT_REMOVE:
            this.queueDispatchers.updateQueueInfo(this.buildVisitObject(processedEvent.E.prm, false), false);
            break;
        case PUBLIC_EVENTS.VISIT_TRANSFER_TO_QUEUE:
            this.queueDispatchers.updateQueueInfo(this.buildVisitObject(processedEvent.E.prm, false), true);
            if(this.isUpdateBothQueues(processedEvent.E.prm)){
                this.queueDispatchers.updateQueueInfo(this.buildVisitObject(processedEvent.E.prm, true), false);
            }
            break;
        case PUBLIC_EVENTS.VISIT_TRANSFER_TO_SERVICE_POINT_POOL:
        case PUBLIC_EVENTS.VISIT_TRANSFER_TO_USER_POOL:
            this.queueDispatchers.updateQueueInfo(this.buildVisitObject(processedEvent.E.prm, false), false);
            break;    
        default:
            break;
      }
  }

isUpdateBothQueues(eventData){
    if(eventData.eventSiblings.includes(PUBLIC_EVENTS.VISIT_END_TRANSACTION)){
        return false;
    }
    else{
        return true;
    }
}  

buildVisitObject(eventData, isOriginQueue) : Visit{
    let queueId = eventData.queueLogicId;
    if(isOriginQueue){
        queueId = eventData.fromQueueLogicId;
    }
    let visit : Visit = {
        ticketId: eventData.ticket,
        visitId: eventData.visitId,
        waitingTime: eventData.waitingTime,
        totalWaitingTime: eventData.totWaitTime,
        appointmentId: eventData.appointmentId,
        appointmentTime: eventData.appointmentTime,
        queueId: queueId
    };
    return visit;
  }
}