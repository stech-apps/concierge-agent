import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { DataServiceError, servicePoint } from 'src/store/services/data.service';
import { GlobalErrorHandler } from '../../../util/services/global-error-handler.service';
import { IService } from '../../../models/IService';
import { IBranch } from '../../../models/IBranch';
import { IServicePoint } from '../../../models/IServicePoint';
import { IAccount } from '../../../models/IAccount';
import { ICustomer } from '../../../models/ICustomer';
import { Util } from '../../util';
import { NOTIFICATION_TYPE } from './calendar.service';
import { VIP_LEVEL } from '../../flow-state';


@Injectable()
export class SPService implements OnDestroy {

  constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler, private util: Util) {
    
  }

  ngOnDestroy() {
    
  }

  fetchUserStatus() {
    return this.http
      .get(`${servicePoint}/user/status`);
  }

  fetchWorkstationStatus(branch: IBranch, selectedServicePoint: IServicePoint) {
    return this.http
        .get(`${servicePoint}/branches/${branch.id}/servicePoints/${selectedServicePoint.id}`);
  }

  getWorkstationUsers(branch: IBranch, selectedServicePoint: IServicePoint){
    return this.http
        .get(`${servicePoint}/branches/${branch.id}/servicePoints/${selectedServicePoint.id}/users`);
  }

  logout(force: boolean) {
    return this.http
        .put(`${servicePoint}/logout?force=${force}`, {})
        .pipe(
          catchError(this.errorHandler.handleError())
        );
  }

  login(branch: IBranch, selectedServicePoint: IServicePoint, user: IAccount) {
    return this.http
        .put(`${servicePoint}/branches/${branch.id}/servicePoints/${selectedServicePoint.id}/users/${user.userName}`, {})
        .pipe(
          catchError(this.errorHandler.handleError())
        );
  }

  removeWorkProfile(branch: IBranch, user: IAccount){
    return this.http
        .delete(`${servicePoint}/branches/${branch.id}/users/${user.userName}/workProfile`, {})
        .pipe(
          catchError(this.errorHandler.handleError())
        );
  }

  quickServe(branch: IBranch, openServicePoint: IServicePoint, service : IService){
    var requestBody = {
      "services": [service.id.toString()],
      "parameters":{
        "print":"0"
      }
    }
    return this.http
        .post(`${servicePoint}/branches/${branch.id}/servicePoints/${openServicePoint.id}/visits/createAndEnd`, requestBody)
        .pipe(
          catchError(this.errorHandler.handleError())
        );
  }

  createVisit(branch: IBranch, selectedServicePoint: IServicePoint, services: IService[], notes: string, vipLevel: VIP_LEVEL, customer: ICustomer, sms: string, isTicketPrint: boolean, tempCustomer: ICustomer, notificationType: NOTIFICATION_TYPE){
    var body = { 
        "services" : this.buildService(services), 
        "customers" : customer ? [customer.id] : [], 
        "parameters" : this.buildParametersObject(sms, isTicketPrint, notes, vipLevel, tempCustomer, notificationType) }
  return this.http
   .post(`${servicePoint}/branches/${branch.id}/servicePoints/${selectedServicePoint.id}/visit/create`, body);
  }

  private buildParametersObject(sms: string, isTicketPrint: boolean, notes: string, vipLevel: VIP_LEVEL, tempCustomer: ICustomer, notificationType: NOTIFICATION_TYPE){
    var params = { 
      "notificationType" : notificationType, 
      "appId" : "concierge", 
      "print" : isTicketPrint ? "1" : "0" }
    
    if(sms && sms.length > 0){
      params["phoneNumber"] = this.util.buildPhoneNumber(sms);
    }
    if(notes && notes.length > 0){
      params["custom1"] = this.util.replaceCharcter(notes);
    }
    if(vipLevel !== VIP_LEVEL.NONE){
      params["level"] = vipLevel;
    }
    if((sms && sms.length === 0) || tempCustomer && tempCustomer.phone && tempCustomer.phone.length > 0){
      params["phoneNumber"] = this.util.buildPhoneNumber(tempCustomer.phone);
    }
    if(tempCustomer && tempCustomer.email && tempCustomer.email.length > 0){
      params["email"] = tempCustomer.email;
    }
    if(tempCustomer && ((tempCustomer.firstName && tempCustomer.firstName.length > 0) || (tempCustomer.lastName && tempCustomer.lastName.length > 0))){
      params["customers"] = tempCustomer.firstName + " " + tempCustomer.lastName;
    }

    return params;
  }

  buildService(services: IService[]){
    var tempArr = [];
    services.forEach(val => {
      tempArr.push(val.id);
    });

    return tempArr;
  }

}
