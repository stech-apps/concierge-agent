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
    VISIT_TRANSFER_TO_USER_POOL = "VISIT_TRANSFER_TO_USER_POOL"
}

import { Injectable } from '@angular/core';
import { NativeApiService } from '../../services/native-api.service'
import { LOGOUT_URL } from '../../url-helper';
import { Visit } from '../../../models/IVisit';
import { QueueDispatchers } from '../../../store';

@Injectable()
export class QEventsHelper {
  constructor(
    private nativeApi: NativeApiService,
    private queueDispatchers: QueueDispatchers
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

      switch (processedEvent.E.evnt) {
        case PUBLIC_EVENTS.USER_SERVICE_POINT_SESSION_END:
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
        case PUBLIC_EVENTS.VISIT_RECYCLE:
            this.queueDispatchers.updateQueueInfo(this.buildVisitObject(processedEvent.E.prm, false), true);
            break;
        case PUBLIC_EVENTS.VISIT_NEXT:
        case PUBLIC_EVENTS.VISIT_REMOVE:
            this.queueDispatchers.updateQueueInfo(this.buildVisitObject(processedEvent.E.prm, false), false);
            break;
        case PUBLIC_EVENTS.VISIT_TRANSFER_TO_QUEUE:
            this.queueDispatchers.updateQueueInfo(this.buildVisitObject(processedEvent.E.prm, true), true);
            this.queueDispatchers.updateQueueInfo(this.buildVisitObject(processedEvent.E.prm, false), false);
            break;
        case PUBLIC_EVENTS.VISIT_TRANSFER_TO_SERVICE_POINT_POOL:
        case PUBLIC_EVENTS.VISIT_TRANSFER_TO_USER_POOL:
            this.queueDispatchers.updateQueueInfo(this.buildVisitObject(processedEvent.E.prm, false), false);
            break;    
        default:
            break;
      }
  }

buildVisitObject(eventData, isOriginQueue) : Visit{
    let queueId = eventData.fromQueueLogicId;
    if(isOriginQueue){
        queueId = eventData.toQueueLogicId;
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