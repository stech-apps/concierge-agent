import { IService } from './../../../../models/IService';
import { ICalendarBranch } from './../../../../models/ICalendarBranch';
import { IBookingInformation } from './../../../../models/IBookingInformation';
import { TimeslotSelectors } from './../../../../store/services/timeslot/timeslot.selectors';
import { CalendarDate } from './../../containers/qm-calendar/qm-calendar.component';
import { IBranch } from 'src/models/IBranch';
import { Subscription, Observable } from 'rxjs';
import { BranchSelectors, TimeslotDispatchers, CalendarBranchSelectors, ServiceSelectors, CalendarServiceSelectors } from 'src/store';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BookingHelperService } from 'src/util/services/booking-helper.service';
import { ICalendarService } from 'src/models/ICalendarService';
import * as moment from 'moment';
import { concat } from 'rxjs/internal/operators/concat';

@Component({
  selector: 'qm-appointment-time-select',
  templateUrl: './qm-appointment-time-select.component.html',
  styleUrls: ['./qm-appointment-time-select.component.scss']
})
export class QmAppointmentTimeSelectComponent implements OnInit, OnDestroy {

  noOfCustomers: number = 1;
  private subscriptions: Subscription = new Subscription();
  selectedBranch: ICalendarBranch = new ICalendarBranch();
  private branchSubscription$: Observable<ICalendarBranch>;
  private serviceSubscription$: Observable<ICalendarService[]>;
  private currentlyActiveDate: CalendarDate;
  selectedServices: ICalendarService[] = [];
  selectedDates: CalendarDate[] = [{
    mDate: moment(),
    selected: true
  }];

  private selectedTime: string;

  @Output()
  onFlowNext: EventEmitter<any> = new EventEmitter();

  constructor(private branchSelectors: BranchSelectors, private timeSlotSelectors: TimeslotSelectors, private timeSlotDispatchers: TimeslotDispatchers,
              private bookingHelperService: BookingHelperService, private calendarBranchSelectors: CalendarBranchSelectors,
              private calendarServiceSelectors: CalendarServiceSelectors) {
    this.branchSubscription$ = this.calendarBranchSelectors.selectedBranch$;
    this.serviceSubscription$ = this.calendarServiceSelectors.selectedServices$;

    const branchSubscription = this.branchSubscription$.subscribe((cb)=> {
      this.selectedBranch = cb;
    });



    const serviceSubscription = this.serviceSubscription$.subscribe((s)=> {
      this.selectedServices = s;
      if(this.selectedServices.length > 0) {
        this.onSelectDate(this.selectedDates[0]);
      }
    });

    this.subscriptions.add(branchSubscription);
    this.subscriptions.add(serviceSubscription);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
      this.subscriptions.unsubscribe();
  }

  onSelectDate(date: CalendarDate) {
    this.currentlyActiveDate = date;
    this.getTimeSlots();
  }

  onTimeSlotSelect(timeSlot) {
    console.log('time slot selected');

    this.onFlowNext.emit();
  }

  private getTimeSlots() {
    const bookingInformation: IBookingInformation = {
      branchPublicId: this.selectedBranch.publicId,
      serviceQuery: this.getServicesQueryString(),
      numberOfCustomers: this.noOfCustomers,
      date: this.currentlyActiveDate.mDate.format('YYYY-MM-DD'),
      time: this.selectedTime
    };

    this.timeSlotDispatchers.getTimeslots(bookingInformation);
  }

  getServicesQueryString(): string {
    return this.selectedServices.reduce((queryString, service: ICalendarService) => {
      return queryString + `;servicePublicId=${service.publicId}`;
    }, '');
  }

  changeCustomerCount(step){
    if((this.noOfCustomers + step) ==0 ) {
      return;
    }
    this.noOfCustomers += step;
    this.getTimeSlots();
  }
}
