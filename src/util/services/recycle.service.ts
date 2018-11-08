import { Injectable } from '@angular/core';
import { CustomerDispatchers, CalendarServiceDispatchers, TimeslotDispatchers, ServiceDispatchers, CalendarBranchSelectors, BranchSelectors, ArriveAppointmentDispatchers, CalendarServiceSelectors, ReservationExpiryTimerDispatchers, ReserveDispatchers, QueueDispatchers, ServicePointPoolDispatchers, StaffPoolDispatchers, NativeApiDispatchers } from '../../store/index';
import { Subscription } from 'rxjs';
import { Visit } from '../../models/IVisit';

@Injectable()
export class Recycle {
    private subscriptions: Subscription = new Subscription();

  constructor(
    private customerDispatcher: CustomerDispatchers,
    private calendarServiceDispatcher: CalendarServiceDispatchers,
    private timeSlotDispatchers: TimeslotDispatchers,
    private serviceDispatcher: ServiceDispatchers,
    private arriveAppointmentDispatcher: ArriveAppointmentDispatchers,
    private expireTimer: ReservationExpiryTimerDispatchers,
    private reserveDispatcher: ReserveDispatchers,
    private queueDispatchers:QueueDispatchers,
    private servicePoolDispatcher:ServicePointPoolDispatchers,
    private staffPoolDispatchers:StaffPoolDispatchers,
    private nativeApiDispatchers: NativeApiDispatchers,
    private reserveDispatchers:ReserveDispatchers
  ) {
  
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  clearCache(){
      this.customerDispatcher.resetCurrentCustomer();
      this.customerDispatcher.resetTempCustomer();
      this.timeSlotDispatchers.resetTimeslots();
      this.serviceDispatcher.setSelectedServices([]);
      this.arriveAppointmentDispatcher.deselectAppointment();
      this.expireTimer.hideReservationExpiryTimer();
      this.reserveDispatcher.resetReserveAppointment();
      this.calendarServiceDispatcher.removeFetchService();
      this.calendarServiceDispatcher.setSelectedServices([]);
      this.queueDispatchers.setectVisit(null);
      this.queueDispatchers.resetSelectedQueue();
      this.servicePoolDispatcher.resetServicePointPool();
      this.staffPoolDispatchers.resetStaffPool();
      this.nativeApiDispatchers.resetQRCodeInfo();
      this.customerDispatcher.editCustomerMode(false);
      // this.reserveDispatchers.unreserveAppointment();
      this.customerDispatcher.resetCustomerSearchText();
      this.customerDispatcher.resetCustomers();
  }

  removeAppCache(){
    this.calendarServiceDispatcher.resetInitialService();
    this.serviceDispatcher.removeFetchServiceList();
  }
}