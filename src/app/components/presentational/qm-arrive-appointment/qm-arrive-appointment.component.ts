import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { ICustomer } from './../../../../models/ICustomer';
import { Component, OnInit } from '@angular/core';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { ArriveAppointmentSelectors } from 'src/store';

@Component({
  selector: 'qm-qm-arrive-appointment',
  templateUrl: './qm-arrive-appointment.component.html',
  styleUrls: ['./qm-arrive-appointment.component.scss']
})
export class QmArriveAppointmentComponent implements OnInit, OnDestroy {

  flowType = FLOW_TYPE.ARRIVE_APPOINTMENT;
  selectedCustomer: ICustomer;
  subscriptions = new Subscription();

  constructor(private arriveAppointmentSelectors: ArriveAppointmentSelectors) {

    const selectedCustomerSub = this.arriveAppointmentSelectors.arrivedCustomer$.subscribe(cust => {
      this.selectedCustomer = cust;
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
