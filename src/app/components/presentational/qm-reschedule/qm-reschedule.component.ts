import { QmModalService } from './../qm-modal/qm-modal.service';
import { IAppointment } from './../../../../models/IAppointment';
import { ICalendarService } from './../../../../models/ICalendarService';
import { IBranch } from './../../../../models/IBranch';
import {
  CalendarBranchSelectors, UserSelectors, BranchSelectors, ReserveDispatchers,
  ReserveSelectors, TimeslotDispatchers, ReservationExpiryTimerDispatchers,
  AppointmentDispatchers, AppointmentSelectors
} from './../../../../store';
import { ICalendarBranch } from './../../../../models/ICalendarBranch';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, SimpleChanges, EventEmitter, Output} from '@angular/core';
import { CalendarDate } from 'src/app/components/containers/qm-calendar/qm-calendar.component';
import * as moment from 'moment';
import { IBookingInformation } from 'src/models/IBookingInformation';
import { CalendarServiceSelectors } from 'src/store/services';


enum RescheduleState {
  Default = 1,
  OnDeletion
}

@Component({
  selector: 'qm-reschedule',
  templateUrl: './qm-reschedule.component.html',
  styleUrls: ['./qm-reschedule.component.scss']
})
export class QmRescheduleComponent implements OnInit, OnDestroy {
  currentlyActiveDate: CalendarDate;
  selectedServices: any;

  private subscriptions: Subscription = new Subscription();
  private branchSubscription$: Observable<ICalendarBranch | IBranch>;
  selectedBranch: ICalendarBranch | IBranch;
  public reservableDates: moment.Moment[] = [];
  private serviceSubscription$: Observable<ICalendarService[]>;
  noOfCustomers: number = 1;
  currentRescheduleState: RescheduleState = RescheduleState.Default;
  selectedDates: CalendarDate[] = [{
    mDate: moment(),
    selected: true
  }];

  @Input()
  editAppointment: IAppointment;

  @Output()
  onFlowExit: EventEmitter<any> = new EventEmitter();

  constructor(private userSelectors: UserSelectors, private branchSelectors: BranchSelectors,
    private reserveSelectors: ReserveSelectors, private reserveDispatchers: ReserveDispatchers,
    private calendarServiceSelectors: CalendarServiceSelectors, private timeSlotDispatchers: TimeslotDispatchers,
    private qmModalService: QmModalService, private reservationExpiryTimerDispatchers: ReservationExpiryTimerDispatchers,
    private appointmentDispatchers: AppointmentDispatchers, private appointmentSelectors: AppointmentSelectors) {

    this.branchSubscription$ = this.branchSelectors.selectedBranch$;
    this.serviceSubscription$ = this.calendarServiceSelectors.selectedServices$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editAppointment'] && this.editAppointment) {
      this.fetchReservableDates();
    }
  }

  ngOnInit() {
    const branchSubscription = this.branchSubscription$.subscribe((cb) => {
      this.selectedBranch = cb;
    });

    const reservableDatesSub = this.reserveSelectors.reservableDates$.subscribe((dates: moment.Moment[]) => {
      this.reservableDates = dates;
    });

    const serviceSubscription = this.serviceSubscription$.subscribe((s) => {
      this.selectedServices = s;
    });

    /*const appointmentLoadingSub = this.appointmentSelectors.appointmentsLoading$.subscribe((loading) => {
      if (!loading && this.currentRescheduleState == RescheduleState.OnDeletion) {
        this.currentRescheduleState = RescheduleState.Default;
        this.appointmentSelectors.appointmentsError$.subscribe((err) => {
          if (err === null) {
              
          }
        }).unsubscribe();
      }
    });
    */

    this.subscriptions.add(branchSubscription);
    this.subscriptions.add(reservableDatesSub);
    this.subscriptions.add(serviceSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  fetchReservableDates() {
    const bookingInformation: IBookingInformation = {
      branchPublicId: this.editAppointment.branch.publicId,
      serviceQuery: this.getServicesQueryString(),
      numberOfCustomers: this.noOfCustomers
    };

    this.reserveDispatchers.fetchReservableDates(bookingInformation);
  }

  onSelectDate(date: CalendarDate) {
    if (this.editAppointment.services && this.editAppointment.services.length > 0) {
      this.currentlyActiveDate = date;
      this.timeSlotDispatchers.selectTimeslotDate(date.mDate);
      this.getTimeSlots();
      this.reservationExpiryTimerDispatchers.hideReservationExpiryTimer();
      this.timeSlotDispatchers.selectTimeslot(null);
    }
  }

  onTimeSlotSelect(time: CalendarDate){

  }

  private getTimeSlots() {
    const bookingInformation: IBookingInformation = {
      branchPublicId: this.editAppointment.branch.publicId,
      serviceQuery: this.getServicesQueryString(),
      numberOfCustomers: this.noOfCustomers,
      date: this.currentlyActiveDate.mDate.format('YYYY-MM-DD'),
      time: this.editAppointment.startTime
    };

    this.timeSlotDispatchers.getTimeslots(bookingInformation);
  }

  getServicesQueryString(): string {
    return this.editAppointment.services.reduce((queryString, service: ICalendarService) => {
      return queryString + `;servicePublicId=${service.publicId}`;
    }, '');
  }

  onDeleteAppointment() {
    this.qmModalService.openForTransKeys('', 'confirm_delete', 'yes', 'no', (result) => {
      if (result) {
        this.appointmentDispatchers.deleteAppointment(this.editAppointment, ()=>{
          this.onFlowExit.next(true);
        });
      }
    }, () => {

    });


  }

  onRescheduleAppointment() {

  }
}
