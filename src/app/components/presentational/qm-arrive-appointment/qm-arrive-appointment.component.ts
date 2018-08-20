import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { ICustomer } from './../../../../models/ICustomer';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { ArriveAppointmentSelectors } from 'src/store';
import { ICalendarService } from '../../../../models/ICalendarService';

@Component({
  selector: 'qm-qm-arrive-appointment',
  templateUrl: './qm-arrive-appointment.component.html',
  styleUrls: ['./qm-arrive-appointment.component.scss']
})
export class QmArriveAppointmentComponent implements OnInit, OnDestroy {

  flowType = FLOW_TYPE.ARRIVE_APPOINTMENT;
  selectedCustomer: ICustomer;
  selectedServices: ICalendarService[] = [];
  subscriptions = new Subscription();
  isServiceHeaderVisibe: boolean;

  @ViewChild('f') f: any;
  @ViewChild('ps') ps: any;
  @ViewChild('px') px: any;

  constructor(private arriveAppointmentSelectors: ArriveAppointmentSelectors) {

    const selectedCustomerSub = this.arriveAppointmentSelectors.selectedAppointment$.subscribe(appointment => {
      if(appointment){
        this.selectedCustomer = appointment.customers[0];
        this.selectedServices = appointment.services;
        this.isServiceHeaderVisibe = true;
      }
    });

    this.subscriptions.add(selectedCustomerSub)
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  branchHeaderClick() { }
}
