import { QmModalService } from './../qm-modal/qm-modal.service';
import { IAppointment } from './../../../../models/IAppointment';
import { ICalendarService } from './../../../../models/ICalendarService';
import { IBranch } from './../../../../models/IBranch';
import {
  CalendarBranchSelectors, UserSelectors, BranchSelectors, ReserveDispatchers,
  ReserveSelectors, TimeslotDispatchers, ReservationExpiryTimerDispatchers,
  AppointmentDispatchers, AppointmentSelectors, InfoMsgDispatchers
} from './../../../../store';
import { ICalendarBranch } from './../../../../models/ICalendarBranch';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { CalendarDate } from 'src/app/components/containers/qm-calendar/qm-calendar.component';
import * as moment from 'moment';
import { IBookingInformation } from 'src/models/IBookingInformation';
import { CalendarServiceSelectors, ServicePointSelectors } from 'src/store/services';
import { TranslateService } from '@ngx-translate/core';


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
  public reservableDates: moment.Moment[] = [];
  private serviceSubscription$: Observable<ICalendarService[]>;
  public selectedCalendarBranch: ICalendarBranch;
  private rescheduleTime: string;
  noOfCustomers: number = 1;
  originalAppointmentTime: string;
  enableReschedule: boolean = false;
  selectedBranch: ICalendarBranch | IBranch;
  isRescheduleEnabledInUtt: boolean = true;
  isDeleteEnabledInUtt: boolean = true;
  isOriginalAppointmentTimeChanged = false;

  currentRescheduleState: RescheduleState = RescheduleState.Default;
  selectedDates: CalendarDate[]

  @Input()
  editAppointment: IAppointment;

  @Output()
  onFlowExit: EventEmitter<any> = new EventEmitter();

  constructor(private userSelectors: UserSelectors, private branchSelectors: BranchSelectors,
    private reserveSelectors: ReserveSelectors, private reserveDispatchers: ReserveDispatchers,
    private calendarServiceSelectors: CalendarServiceSelectors, private timeSlotDispatchers: TimeslotDispatchers,
    private qmModalService: QmModalService, private reservationExpiryTimerDispatchers: ReservationExpiryTimerDispatchers,
    private appointmentDispatchers: AppointmentDispatchers, private appointmentSelectors: AppointmentSelectors,
    private calendarBranchSelectors: CalendarBranchSelectors, private infoMessageDispatchers: InfoMsgDispatchers,
    private translationService: TranslateService, private servicePointSelectors: ServicePointSelectors) {

    this.branchSubscription$ = this.branchSelectors.selectedBranch$;
    this.serviceSubscription$ = this.calendarServiceSelectors.selectedServices$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['editAppointment'] && this.editAppointment) {
      this.enableReschedule = false;
      window['moment'] = moment;
      const calculatedAppointmentTime = moment(this.editAppointment.start).tz(this.selectedCalendarBranch.fullTimeZone);
      if(calculatedAppointmentTime.isAfter(moment.now())) {
        this.originalAppointmentTime = calculatedAppointmentTime.format('HH:mm');
        this.selectedDates = [{selected: true, mDate: calculatedAppointmentTime}];
        this.isOriginalAppointmentTimeChanged = false;
      }
      this.fetchReservableDates();
      
    }
  }

  ngOnInit() {
    const branchSubscription = this.branchSubscription$.subscribe((cb) => {
      this.selectedBranch = cb;
    });
    

    const reservableDatesSub = this.reserveSelectors.reservableDates$.subscribe((dates: moment.Moment[]) => {
      this.reservableDates = dates;
      if(this.editAppointment){
          if(this.reservableDates[0].isAfter(this.editAppointment.start)){
            this.selectedDates =  [{
              mDate: this.reservableDates[0],
              selected: true
            }];
      }else{
         this.selectedDates =  [{
              mDate: moment(this.editAppointment.start),
              selected: true
            }];
      }
      }
    
    
 
    });

    const serviceSubscription = this.serviceSubscription$.subscribe((s) => {
      this.selectedServices = s;
    });

    const uttSubscription = this.servicePointSelectors.uttParameters$
    .subscribe(uttParameters => {
      if (uttParameters) {
        this.isRescheduleEnabledInUtt = uttParameters.reSheduleAppointment;
        this.isDeleteEnabledInUtt = uttParameters.delAppointment;
      }
    })
    .unsubscribe();

    const calendarBranchsSub = this.calendarBranchSelectors.branches$.subscribe((bs) => {
      if(this.selectedBranch) {
        this.selectedCalendarBranch = bs.find(x => x.qpId == this.selectedBranch.id);
      }
  }); 

  this.subscriptions.add(calendarBranchsSub);

   this.subscriptions.add(uttSubscription);
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
    if (this.editAppointment && this.editAppointment.services && this.editAppointment.services.length > 0) {
      this.currentlyActiveDate = date;
      this.timeSlotDispatchers.selectTimeslotDate(date.mDate);
      this.getTimeSlots();
      this.reservationExpiryTimerDispatchers.hideReservationExpiryTimer();
      this.timeSlotDispatchers.selectTimeslot(null);
      if(moment(this.editAppointment.start).date() !== date.mDate.date()) {
        this.originalAppointmentTime = null;
      }
    }
  }

  onTimeSlotSelect(time: { title: string }) {
    this.rescheduleTime = time.title;
    this.enableReschedule = moment(this.editAppointment.start).tz(this.selectedCalendarBranch.fullTimeZone).format('YYYY-MM-DD HH:mm') != (this.currentlyActiveDate.mDate.clone().format('YYYY-MM-DD') + ' ' + time.title);
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
        this.appointmentDispatchers.deleteAppointment(this.editAppointment, () => {
        },
          (error) => {
          }
        );
        this.onFlowExit.next(true);
      }
    }, () => {
      this.onFlowExit.next(true);
    });
  }

  onRescheduleAppointment() {
    if (this.enableReschedule) {
      this.qmModalService.openForTransKeys('', 'confirm_reschedule', 'yes', 'no', (result) => {
        if (result) {
          let rescheduleAppointment = this.editAppointment;
          const originalAppointmentStartTime = this.editAppointment.start;
          rescheduleAppointment.start = `${this.currentlyActiveDate.mDate.format('YYYY-MM-DD')}T${this.rescheduleTime}`;

          const timeDiff = moment.duration(moment(this.editAppointment.end).diff(originalAppointmentStartTime));
          let endTime = moment(rescheduleAppointment.start).add(timeDiff.asMinutes(), 'minutes');
          rescheduleAppointment.end = `${endTime.format('YYYY-MM-DD')}T${endTime.format('HH:mm')}`;
          this.appointmentDispatchers.rescheduleAppointment(rescheduleAppointment);
          this.onFlowExit.next(true);
        }
      }, () => {

      });
    }
  }
}
