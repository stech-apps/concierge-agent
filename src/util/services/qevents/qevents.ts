export enum PUBLIC_EVENTS {
    VISIT_CALL = "VISIT_CALL",
    USER_SERVICE_POINT_SESSION_END = "USER_SERVICE_POINT_SESSION_END",
    USER_SESSION_END = "USER_SESSION_END",
    PRINTER_ISSUE = "PRINTER_ISSUE",
    CREATE_APPOINTMENT = "CREATE_APPOINTMENT",
    UPDATE_APPOINTMENT = "UPDATE_APPOINTMENT",
    DELETE_APPOINTMENT = "DELETE_APPOINTMENT",
    VISIT_CREATE = "VISIT_CREATE",
    RESET = "RESET"
}

import { Injectable } from '@angular/core';
import { NativeApiService } from '../../services/native-api.service'
import { LOGOUT_URL } from '../../url-helper';

@Injectable()
export class QEventsHelper {
  constructor(
    private nativeApi: NativeApiService
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
        case PUBLIC_EVENTS.VISIT_CREATE:
            //appointment.updateAppointmentList(processedEvent);
            break;
        default:
            break;
      }
  }
}