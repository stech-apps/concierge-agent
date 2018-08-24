import { ToastService } from './toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SPService } from '../services/rest/sp.service';
import { CustomerDispatchers, CalendarServiceDispatchers, TimeslotDispatchers, ServiceDispatchers, CalendarBranchSelectors, BranchSelectors, ArriveAppointmentDispatchers, CalendarServiceSelectors, ReservationExpiryTimerDispatchers, ReserveDispatchers } from '../../store/index';
import { ICalendarBranch } from '../../models/ICalendarBranch';
import { IBranch } from '../../models/IBranch';
import { Subscription } from 'rxjs';

@Injectable()
export class Recycle {
    private subscriptions: Subscription = new Subscription();
    private selectedCalendarBranch: ICalendarBranch;
    private selectedBranch: IBranch;
    private isCalendarServiceSelected: boolean;

  constructor(
    private customerDispatcher: CustomerDispatchers,
    private calendarServiceDispatcher: CalendarServiceDispatchers,
    private timeSlotDispatchers: TimeslotDispatchers,
    private serviceDispatcher: ServiceDispatchers,
    private calendarBranchSelector: CalendarBranchSelectors,
    private branchSelectors: BranchSelectors,
    private arriveAppointmentDispatcher: ArriveAppointmentDispatchers,
    private calendarServiceSelectors: CalendarServiceSelectors,
    private expireTimer: ReservationExpiryTimerDispatchers,
    private reserveDispatcher: ReserveDispatchers
  ) {
    var branchSubscription = this.branchSelectors.selectedBranch$.subscribe((spBranch)=> this.selectedBranch = spBranch);
    var calendarBranchSubscription = this.calendarBranchSelector.selectedBranch$.subscribe((branch)=> this.selectedCalendarBranch = branch);
    var calendarServiceSubscription = this.calendarServiceSelectors.selectedServices$.subscribe((services)=> {
      if(services && services.length > 0){
        this.isCalendarServiceSelected = true;
      }
      else{
        this.isCalendarServiceSelected = false;
      }
    });

    this.subscriptions.add(branchSubscription);
    this.subscriptions.add(calendarBranchSubscription);
    this.subscriptions.add(calendarServiceSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  clearCache(){
    if(this.selectedCalendarBranch && this.selectedCalendarBranch.qpId !== this.selectedBranch.id || this.isCalendarServiceSelected){
      this.calendarServiceDispatcher.removeFetchService();
    }
      this.customerDispatcher.resetCurrentCustomer();
      this.customerDispatcher.resetTempCustomer();
      this.timeSlotDispatchers.resetTimeslots();
      this.calendarServiceDispatcher.setSelectedServices([]);
      this.serviceDispatcher.setSelectedServices([]);
      this.arriveAppointmentDispatcher.deselectAppointment();
      this.expireTimer.hideReservationExpiryTimer();
  }
}