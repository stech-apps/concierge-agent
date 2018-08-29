import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandler } from '../../../util/services/global-error-handler.service';
import { DataServiceError, calendarEndpoint, calendarPublicEndpoint, calendarPublicEndpointV2 } from 'src/store/services/data.service';
import { IAppointment } from '../../../models/IAppointment';
import { ICustomer } from '../../../models/ICustomer';
import { Util } from '../../util';
import * as moment from 'moment-timezone';
import { ICalendarBranchCentralResponse } from '../../../models/ICalendarBranchCentralResponse';

export enum NOTIFICATION_TYPE {
  email = "email",
  sms = "sms",
  both = "both",
  none = "none"
}

@Injectable()
export class CalendarService implements OnDestroy {

  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler, private util: Util) {
    
  }

  ngOnDestroy() {
    
  }

  createAppointment(appointment: IAppointment, notes: string, customer: ICustomer, email: string, sms: string, notificationType: NOTIFICATION_TYPE){
      var body = { 
          "title" : "appointment", 
          "notes" : this.util.replaceCharcter(notes), 
          "customers" : [this.buildCustomerObject(customer)], 
          "custom" : this.buildCustomObject(email, sms, notificationType) }
    return this.http
     .post(`${calendarPublicEndpointV2}/branches/appointments/${appointment.publicId}/confirm`, body);
  }

  bookAppointment(appointment: IAppointment, notes: string, customer: ICustomer, email: string, sms: string, notificationType: NOTIFICATION_TYPE){
    var body = { 
        "title" : "appointment", 
        "notes" : this.util.replaceCharcter(notes), 
        "services" : appointment.services,
        "customers" : [this.buildCustomerObject(customer)], 
        "custom" : this.buildCustomObject(email, sms, notificationType) }
  return this.http
   .post(`${calendarPublicEndpointV2}/branches/${appointment.branch.publicId}/dates/${this.buildDate(appointment)}/times/${this.buildTime(appointment)}/book`, body);
}

private buildDate(appointment: IAppointment){
    let dateObj = moment(appointment.start).tz(appointment.branch.fullTimeZone).format("YYYY-MM-DD");
    return dateObj;
}

private buildTime(appointment: IAppointment){
    let timeObj = moment(appointment.start).tz(appointment.branch.fullTimeZone).format("HH:mm");
    return timeObj;
}

  private buildCustomObject(email: string, sms: string, notificationType: NOTIFICATION_TYPE){
    var custom = "{\"notificationType\":\"" + notificationType +  "\"";
    if(sms && sms.length > 0){
      custom = custom + ",\"phoneNumber\":\"" + this.util.buildPhoneNumber(sms) + "\"";
    }
    if(email && email.length > 0){
      custom = custom + ",\"email\":\"" + email + "\"";
    }
    custom = custom + ",\"appId\":\"concierge\"}";

    return custom;
  }

  // There are two different responses when we compare create a customer and search customer response. Want modify customer object according to the response.
  private buildCustomerObject(customer: ICustomer){
    var customerInfo = {} as ICustomer;

    customerInfo.qpId = customer.id;
    customerInfo.lastName = customer.lastName;
    if(customer.firstName !== undefined){
      customerInfo.firstName = customer.firstName;
    }
    else if(customer.name !== undefined){
        customerInfo.firstName = customer.name;
    }
    if(customer.email !== undefined){
        customerInfo.email = customer.email;
    }
    else if(customer.properties && customer.properties.email !== undefined){
        customerInfo.email = customer.properties.email;
    }
    if(customer.phone !== undefined){
        customerInfo.phone = customer.phone;
    }
    else if(customer.properties && customer.properties.phoneNumber !== undefined){
        customerInfo.phone = customer.properties.phoneNumber;
    }
    if(customer.publicId !== undefined){
        customerInfo.publicId = customer.publicId;
    }
    else if(customer.properties && customer.properties.publicId){
        customerInfo.publicId = customer.properties.publicId;
    }
    if(customer.identificationNumber !== undefined){
        customerInfo.identificationNumber = customer.identificationNumber;
    }
    else if(customerInfo.cardNumber !== undefined){
        customerInfo.identificationNumber = customer.cardNumber;
    }
    if(customer.created !== undefined){
        customerInfo.created = customer.created;
    }
    else if(customer.properties && customer.properties.created !== undefined){
        customerInfo.created = customer.properties.created;
    }

    return customerInfo;
  }

  getBranchWithPublicId(branchId:number){
  return this.http
  .get<ICalendarBranchCentralResponse>(`${calendarEndpoint}/branches/${branchId}`)
}
}