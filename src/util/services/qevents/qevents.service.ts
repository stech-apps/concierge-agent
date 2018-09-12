import { Injectable } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PUBLIC_EVENTS, QEventsHelper } from './qevents';
import { UserStatusSelectors, ServicePointSelectors, UserSelectors, SystemInfoSelectors } from 'src/store/services';
import { Subscription } from 'rxjs';
import { IServicePoint } from '../../../models/IServicePoint';
import { AutoClose} from './../autoclose.service';
import { Util } from '../../util';
import { ORCHESTRA_VERSIONS } from '../../version-handller';

declare var require: any;

@Injectable()
export class QEvents {
  private lib: any;
  private cometd: any;
  private openServicePoint: IServicePoint;
  private userName: string;
  private productVersion: string;

  private subscriptions: Subscription = new Subscription();
  private subscribeChannel: any;

  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private userSelectors: UserSelectors,
    private qEventHelper: QEventsHelper,
    private autoClose: AutoClose,
    private systemInfoSelector: SystemInfoSelectors,
    private util: Util
  ) {
    this.configureCometD();

    const userSubscription = this.userSelectors.userUserName$.subscribe((name) => this.userName = name);
    this.subscriptions.add(userSubscription);

    const systmeInfoSubscription = this.systemInfoSelector.systemInfoProductVersion$.subscribe((version) => this.productVersion = version);
    this.subscriptions.add(userSubscription);

    const servicePointsSubscription = this.servicePointSelectors.openServicePoint$.subscribe((sp) => {
      if(sp){
        if(this.openServicePoint && (sp !== this.openServicePoint)){
          this.unsubscribe();
        }
        this.openServicePoint = sp;
        this.initializeCometD(this);
      }
      else if(this.openServicePoint){
        this.unsubscribe();
      }
    });

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
 
  handshake(currentObj){
    // Handshake with the server.
    this.cometd.handshake(function(h) {
      if (h.successful) {
        currentObj.checkServerStatus(currentObj);
      }
    });
  }

  checkServerStatus(currentObj){
    this.cometd.addListener('/meta/connect', '', function(msg){
      currentObj.qEventHelper.checkServerStatus(msg);
    })
  }

  initializeCometD(currentObj){
    var initCmd = {
      "M": "C",
      "C": {
        "CMD": "INIT",
        "TGT": "CFM",
        "PRM": {
          "uid": "",
          "type": "90",
          "encoding": "QP_JSON",
          "userName": ""
        }
      },
      "N": "0"
    };

    initCmd.C.PRM.userName = this.userName;
    initCmd.C.PRM.uid = this.openServicePoint.unitId;
       
    this.cometd.publish('/events/INIT', initCmd, function(m) {
      currentObj.subscribe(currentObj);
    });
  }

  subscribe(currentObj){
    var chanel = this.qEventHelper.getChannelStr(this.openServicePoint.unitId)
    this.subscribeChannel = this.cometd.subscribe('/events/' + chanel + '/' + this.userName, function(m){
      
    })

    this.setChannelStatus();

    this.cometd.addListener('/events/' + chanel + '/' + this.userName, '', function(msg){
      currentObj.qEventHelper.receiveEvent(msg);
    })
  }

  setChannelStatus(){
    var deviceType = "SW_CONNECT_CONCIERGE";
    var isUserChannelEnable = true;
    var status = 0;
    try {
      status = this.util.compareVersions(ORCHESTRA_VERSIONS.MULTIPLE_SESSION_SUPPORTED, this.productVersion);
    }
    catch (err) {
      status = 0;
    }
    if(status <= 0) {
        isUserChannelEnable = true;
    }
    var setChannelEvent = {
      M: "E",
      E: {
          evnt: "SET_CHANNEL_STATUS",
          type: "APPLICATION",
          prm: { "userName": this.userName,
                 "isUserChannel": isUserChannelEnable,
                 "uid": ""
               }
      }
    };
    setChannelEvent.E.prm.uid = this.openServicePoint.unitId + ':' + deviceType;
    this.cometd.publish('/events/APPLICATION', setChannelEvent, function(m) {
      
    });
  }

  unsubscribe(){
    if(this.subscribeChannel){
      var chanel = this.qEventHelper.getChannelStr(this.openServicePoint.unitId);
      this.cometd.unsubscribe(this.subscribeChannel, function(m){
      
      })

      this.cometd.clearListeners();
    }
  }



}
