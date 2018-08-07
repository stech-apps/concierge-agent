import { IService } from './../../../../models/IService';
import { ICalendarBranch } from './../../../../models/ICalendarBranch';
import { IBookingInformation } from './../../../../models/IBookingInformation';
import { TimeslotSelectors } from './../../../../store/services/timeslot/timeslot.selectors';
import { CalendarDate } from './../../containers/qm-calendar/qm-calendar.component';
import { IBranch } from 'src/models/IBranch';
import { Subscription } from 'rxjs';
import { BranchSelectors, TimeslotDispatchers, CalendarBranchSelectors, ServiceSelectors } from 'src/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingHelperService } from 'src/util/services/booking-helper.service';

@Component({
  selector: 'qm-appointment-time-select',
  templateUrl: './qm-appointment-time-select.component.html',
  styleUrls: ['./qm-appointment-time-select.component.scss']
})
export class QmAppointmentTimeSelectComponent implements OnInit, OnDestroy {

  noOfCustomers: number = 1;
  private subscriptions: Subscription = new Subscription();
  selectedBranch: ICalendarBranch = new ICalendarBranch();
  selectedServices: IService[] = [];

  private selectedTime: string;

  constructor(private branchSelectors: BranchSelectors, private timeSlotSelectors: TimeslotSelectors, private timeSlotDispatchers: TimeslotDispatchers,
              private bookingHelperService: BookingHelperService, private calendarBranchSelectors: CalendarBranchSelectors,
              private serviceSelectors: ServiceSelectors) {
    const branchSubscription = this.calendarBranchSelectors.selectedBranch$.subscribe((cb)=> {
      this.selectedBranch = cb;
    });

    const serviceSubscription = this.serviceSelectors.selectedServices$.subscribe((s)=> {
      this.selectedServices = s;
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
    const bookingInformation: IBookingInformation = {
      branchPublicId: this.selectedBranch.publicId,
      serviceQuery: this.getServicesQueryString(),
      numberOfCustomers: this.noOfCustomers,
      date: date.mDate.format('YYYY-MM-DD'),
      time: this.selectedTime
    };

    this.timeSlotDispatchers.getTimeslots(bookingInformation);
  }

  getServicesQueryString(): string {
    return this.selectedServices.reduce((queryString, service: IService) => {
      return queryString + `;servicePublicId=${service.id}`;
    }, '');
  }

  changeCustomerCount(step){
    this.noOfCustomers += step;
  }
}
