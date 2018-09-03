import { ReserveSelectors } from './../../../../store/services/reserve/reserve.selectors';
import { IService } from './../../../../models/IService';
import { ICalendarBranch } from './../../../../models/ICalendarBranch';
import { IBookingInformation } from './../../../../models/IBookingInformation';
import { TimeslotSelectors } from './../../../../store/services/timeslot/timeslot.selectors';
import { CalendarDate } from './../../containers/qm-calendar/qm-calendar.component';
import { IBranch } from 'src/models/IBranch';
import { Subscription, Observable } from 'rxjs';
import {
  BranchSelectors, TimeslotDispatchers, CalendarBranchSelectors, ServiceSelectors, CalendarServiceSelectors,
  ReserveDispatchers, ReservationExpiryTimerDispatchers, CalendarSettingsSelectors, ReservationExpiryTimerSelectors, 
  CalendarSettingsDispatchers,UserSelectors
} from 'src/store';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { BookingHelperService } from 'src/util/services/booking-helper.service';
import { ICalendarService } from 'src/models/ICalendarService';
import * as moment from 'moment';
import { concat } from 'rxjs/internal/operators/concat';
import { ITimeSlot } from 'src/models/ITimeSlot';
import { IAppointment } from 'src/models/IAppointment';
import { Moment } from 'moment';

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
  private reservedAppointment$: Observable<IAppointment>;
  private currentlyActiveDate: CalendarDate;
  private getExpiryReservationTime$: Observable<Number>;
  private settingReservationExpiryTime: number;
  public showExpiryReservationTime$: Observable<Boolean>;
    public reservableDates: moment.Moment[] = [];
  public userDirection$: Observable<string>;
  selectedTime$: Observable<Moment>;

  selectedServices: ICalendarService[] = [];
  selectedDates: CalendarDate[] = [{
    mDate: moment(),
    selected: true
  }];

  selectedTime: string;

  @Output()
  onFlowNext: EventEmitter<any> = new EventEmitter();

  constructor(private branchSelectors: BranchSelectors, private timeSlotSelectors: TimeslotSelectors, private timeSlotDispatchers: TimeslotDispatchers,
    private bookingHelperService: BookingHelperService, private calendarBranchSelectors: CalendarBranchSelectors,
    private calendarServiceSelectors: CalendarServiceSelectors, private reserveDispatchers: ReserveDispatchers,
    private calendarSettingsSelectors: CalendarSettingsSelectors, private reserveSelectors: ReserveSelectors,
    private reservationExpiryTimerDispatchers: ReservationExpiryTimerDispatchers, private calendarSettingsDispatchers: CalendarSettingsDispatchers,
  private userSelectors: UserSelectors) {

    this.branchSubscription$ = this.calendarBranchSelectors.selectedBranch$;
    this.serviceSubscription$ = this.calendarServiceSelectors.selectedServices$;
    this.reservedAppointment$ = this.reserveSelectors.reservedAppointment$;
    this.getExpiryReservationTime$ = this.calendarSettingsSelectors.getReservationExpiryTime$;
    this.userDirection$ = this.userSelectors.userDirection$;


    const branchSubscription = this.branchSubscription$.subscribe((cb) => {
      this.selectedBranch = cb;
    });


    const serviceSubscription = this.serviceSubscription$.subscribe((s) => {
      this.selectedServices = s;
    });

    const reservableDatesSub = this.reserveSelectors.reservableDates$.subscribe((dates: moment.Moment[])=> {
        this.reservableDates = dates;
    });

    const serviceSelectionSubscription = this.calendarServiceSelectors.isCalendarServiceSelected$.subscribe((val) => {
      if (val && this.selectedServices.length > 0 && this.selectedBranch && this.selectedBranch.id) {
        this.fetchReservableDates();
      }
    });
   
    this.subscriptions.add(branchSubscription);
    this.subscriptions.add(serviceSubscription);
    this.subscriptions.add(reservableDatesSub);
    this.subscriptions.add(serviceSelectionSubscription);
  }

  ngOnInit() {
    const expiryReservationCalendarSettingSubscription = this.getExpiryReservationTime$.subscribe(
      (time: number) => {
        this.settingReservationExpiryTime = time;
      }
    );

    const appointmentSubscription = this.reservedAppointment$.subscribe(
      (app: IAppointment) => {
        if (app) {

          this.reservationExpiryTimerDispatchers.hideReservationExpiryTimer();
          this.calendarSettingsDispatchers.fetchCalendarSettingsInfo();
          this.reservationExpiryTimerDispatchers.showReservationExpiryTimer();
          this.reservationExpiryTimerDispatchers.setReservationExpiryTimer(
            this.settingReservationExpiryTime
          );
        } else {
          this.reservationExpiryTimerDispatchers.hideReservationExpiryTimer();
        }
      }
    );


    const timeSlotSubscription = this.timeSlotSelectors.selectedTime$.subscribe((st: string)=> {
      this.selectedTime = st;
    });

    this.subscriptions.add(appointmentSubscription);
    this.subscriptions.add(timeSlotSubscription);
    this.timeSlotDispatchers.selectTimeslotDate(this.selectedDates[0].mDate);

    this.reserveSelectors.reservedAppointment$.subscribe((alreadyReserved)=> {
      if(alreadyReserved) {
        this.onFlowNext.emit();
      }
    });
  }

  fetchReservableDates() {
    const bookingInformation: IBookingInformation = {
      branchPublicId: this.selectedBranch.publicId,
      serviceQuery: this.getServicesQueryString(),
      numberOfCustomers: this.noOfCustomers
    };

    this.reserveDispatchers.fetchReservableDates(bookingInformation);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSelectDate(date: CalendarDate) {
    if(this.selectedServices && this.selectedServices.length > 0){
      this.currentlyActiveDate = date;
      this.timeSlotDispatchers.selectTimeslotDate(date.mDate);
      this.getTimeSlots();
      this.reservationExpiryTimerDispatchers.hideReservationExpiryTimer();
      this.timeSlotDispatchers.selectTimeslot(null);
    }
  }

  doneButtonClick() {
    this.onFlowNext.emit();
  }

  onTimeSlotSelect(timeSlot: ITimeSlot) {
    this.selectedTime = timeSlot.title;
    const bookingInformation: IBookingInformation = {
      branchPublicId: this.selectedBranch.publicId,
      serviceQuery: this.getServicesQueryString(),
      numberOfCustomers: this.noOfCustomers,
      date: this.currentlyActiveDate.mDate.format('YYYY-MM-DD'),
      time: timeSlot.title
    };

    const appointment: IAppointment = {
      services: this.selectedServices
    };

    this.timeSlotDispatchers.selectTimeslot(timeSlot.title);
    this.reserveDispatchers.reserveAppointment(bookingInformation, appointment);

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

  changeCustomerCount(step) {
    if ((this.noOfCustomers + step) == 0) {
      return;
    }
    this.noOfCustomers += step;
    this.getTimeSlots();
    this.reservationExpiryTimerDispatchers.hideReservationExpiryTimer();
    this.timeSlotDispatchers.selectTimeslot(null);
  }
}
