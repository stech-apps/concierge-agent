import { Injectable } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PUBLIC_EVENTS } from './qevents';
import { UserStatusSelectors, ServicePointSelectors } from 'src/store/services';
import { Subscription } from 'rxjs';
import { IServicePoint } from '../../../models/IServicePoint';

declare var require: any;

@Injectable()
export class QEvents {
  private lib: any;
  private cometd: any;
  private servicePointId: number;
  private servicePoints: Array<IServicePoint>;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private userStatusSelectors: UserStatusSelectors,
    private servicePointSelectors: ServicePointSelectors
  ) {
    this.configureCometD();

    const servicePointSubscription = this.userStatusSelectors.servicePoint$.subscribe((spId) => this.servicePointId = spId);
    this.subscriptions.add(servicePointSubscription);

    const servicePointsSubscription = this.servicePointSelectors.servicePoints$.subscribe((sp) => this.servicePoints = sp);
    this.subscriptions.add(servicePointsSubscription);
  }

  configureCometD(){
    // Obtain the CometD APIs.
    this.lib = require('cometd');
    // Create the CometD object.
    this.cometd = new this.lib.CometD();

    // Set transport type
    var transport = new this.lib.Transport();
    transport.registered('long-polling', this.cometd);
    this.cometd.websocketEnabled = false;
    this.cometd.transport = transport;

    // Configure the CometD object.
    this.cometd.configure({
      url: window.location.origin + '/cometd'
    });


  }
 
  handshake(){
    // Handshake with the server.
    this.cometd.handshake(function(h) {
      if (h.successful) {
    
      }
    });
  }

  cc(){
    this.cometd.addListener('/meta/connect', '', function(msg){
      console.log(msg);
    })
  }

  initializeCometD(qeventObj){
    var initCmd = {
      "M": "C",
      "C": {
        "CMD": "INIT",
        "TGT": "CFM",
        "PRM": {
          "uid": "CMB:ServicePoint",
          "type": "90",
          "encoding": "QP_JSON",
          "userName": "kasun"
        }
      },
      "N": "0"
    };
       
    this.cometd.publish('/events/INIT', initCmd, function(m) {
      qeventObj.subscribe(qeventObj);
    });
  }

  subscribe(qeventObj){
    this.cometd.subscribe('/events/CMB/ServicePoint/superadmin', function(m){

    })

    this.cometd.addListener('/events/CMB/ServicePoint/superadmin', '', function(msg){
      qeventObj.receiveEvent(msg);
    })
  }

  unsubscribe(){
    this.cometd.unsubscribe('/events/CMB/ServicePoint/superadmin', function(m){

    })

    this.cometd.clearListeners();
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
            //nativeApi.mobile.logout();
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
