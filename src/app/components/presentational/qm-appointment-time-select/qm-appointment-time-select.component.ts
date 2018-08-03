import { IBookingInformation } from './../../../../models/IBookingInformation';
import { TimeslotSelectors } from './../../../../store/services/timeslot/timeslot.selectors';
import { CalendarDate } from './../../containers/qm-calendar/qm-calendar.component';
import { IBranch } from 'src/models/IBranch';
import { Subscription } from 'rxjs';
import { BranchSelectors, TimeslotDispatchers } from 'src/store';
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
  selectedBranch: IBranch = new IBranch();

  private selectedTime: string;

  constructor(private branchSelectors: BranchSelectors, private timeSlotSelectors: TimeslotSelectors, private timeSlotDispatchers: TimeslotDispatchers,
              private bookingHelperService: BookingHelperService) {
    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((sb) => {
        this.selectedBranch = sb;
    });

    this.subscriptions.add(branchSubscription);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
      this.subscriptions.unsubscribe();
  }

  onSelectDate(date: CalendarDate) {
    const bookingInformation: IBookingInformation = {
      branchPublicId: '',
      serviceQuery: '',
      numberOfCustomers: this.noOfCustomers,
      date: date.mDate.toString(),
      time: this.selectedTime
    };

    this.timeSlotDispatchers.getTimeslots(bookingInformation);
  }

  changeCustomerCount(step){
    this.noOfCustomers += step;
  }
}
