import { IAppointment } from './../../../../models/IAppointment';
import { ICalendarService } from './../../../../models/ICalendarService';
import { IBranch } from './../../../../models/IBranch';
import { CalendarBranchSelectors, UserSelectors, BranchSelectors, ReserveDispatchers,
         ReserveSelectors} from './../../../../store';
import { ICalendarBranch } from './../../../../models/ICalendarBranch';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { CalendarDate } from 'src/app/components/containers/qm-calendar/qm-calendar.component';
import * as moment from 'moment';
import { IBookingInformation } from 'src/models/IBookingInformation';
import { CalendarServiceSelectors } from 'src/store/services';

@Component({
  selector: 'qm-reschedule',
  templateUrl: './qm-reschedule.component.html',
  styleUrls: ['./qm-reschedule.component.scss']
})
export class QmRescheduleComponent implements OnInit, OnDestroy {
  selectedServices: any;

  private subscriptions: Subscription = new Subscription();
  private branchSubscription$: Observable<ICalendarBranch | IBranch>;
  selectedBranch: ICalendarBranch | IBranch;
  public reservableDates: moment.Moment[] = [];
  private serviceSubscription$: Observable<ICalendarService[]>;
  noOfCustomers : number = 1;
  selectedDates: CalendarDate[] = [{
    mDate: moment(),
    selected: true
  }];

  @Input()
  editAppointment: IAppointment

  constructor(private userSelectors: UserSelectors, private branchSelectors: BranchSelectors,
    private reserveSelectors: ReserveSelectors, private reserveDispatchers: ReserveDispatchers,
    private calendarServiceSelectors: CalendarServiceSelectors) {
    this.branchSubscription$ = this.branchSelectors.selectedBranch$;
    this.serviceSubscription$ = this.calendarServiceSelectors.selectedServices$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['editAppointment'] && this.editAppointment) {
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
    if(this.selectedServices && this.selectedServices.length > 0){

    }
  }

  onTimeSlotSelect(time: CalendarDate){

  }

  getServicesQueryString(): string {
    return this.editAppointment.services.reduce((queryString, service: ICalendarService) => {
      return queryString + `;servicePublicId=${service.publicId}`;
    }, '');
  }
}
