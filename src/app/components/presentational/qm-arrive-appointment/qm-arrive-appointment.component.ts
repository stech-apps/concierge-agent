import { Subscription, Observable } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { ICustomer } from './../../../../models/ICustomer';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { ArriveAppointmentSelectors, UserSelectors } from 'src/store';
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
  userDirection$: Observable<string>;

  constructor(private arriveAppointmentSelectors: ArriveAppointmentSelectors, private userSelectors: UserSelectors) {

    const selectedAppointmentSub = this.arriveAppointmentSelectors.selectedAppointment$.subscribe(appointment => {
      if(appointment && appointment.customers ){
        this.selectedCustomer = appointment.customers[0];
        this.selectedServices = appointment.services;
        this.isServiceHeaderVisibe = true;
      }
    });

    this.subscriptions.add(selectedAppointmentSub);
    this.userDirection$ = userSelectors.userDirection$;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  branchHeaderClick() { }
}
