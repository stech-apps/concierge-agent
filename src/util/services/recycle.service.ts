import { ToastService } from './toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SPService } from '../services/rest/sp.service';
import { CustomerDispatchers, CalendarServiceDispatchers, TimeslotDispatchers, ServiceDispatchers, CalendarBranchSelectors, BranchSelectors, ArriveAppointmentDispatchers } from '../../store/index';
import { ICalendarBranch } from '../../models/ICalendarBranch';
import { IBranch } from '../../models/IBranch';
import { Subscription } from 'rxjs';

@Injectable()
export class Recycle {
    private subscriptions: Subscription = new Subscription();
    private selectedCalendarBranch: ICalendarBranch;
    private selectedBranch: IBranch

  constructor(
    private customerDispatcher: CustomerDispatchers,
    private calendarServiceDispatcher: CalendarServiceDispatchers,
    private timeSlotDispatchers: TimeslotDispatchers,
    private serviceDispatcher: ServiceDispatchers,
    private calendarBranchSelector: CalendarBranchSelectors,
    private branchSelectors: BranchSelectors,
    private arriveAppointmentDispatcher: ArriveAppointmentDispatchers
  ) {
    var branchSubscription = this.branchSelectors.selectedBranch$.subscribe((spBranch)=> {this.selectedBranch = spBranch});
    var calendarBranchSubscription = this.calendarBranchSelector.selectedBranch$.subscribe((branch)=> {this.selectedCalendarBranch = branch});

    this.subscriptions.add(branchSubscription);
    this.subscriptions.add(calendarBranchSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  clearCache(){
      this.customerDispatcher.resetCurrentCustomer();
      this.customerDispatcher.resetTempCustomer();
      this.timeSlotDispatchers.resetTimeslots();
      this.calendarServiceDispatcher.setSelectedServices([]);
      this.serviceDispatcher.setSelectedServices([]);
      this.arriveAppointmentDispatcher.deselectAppointment();
      if(this.selectedCalendarBranch && this.selectedCalendarBranch.qpId !== this.selectedBranch.id){
        this.calendarServiceDispatcher.removeFetchService();
      }
  }
}