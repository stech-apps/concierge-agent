import { ICustomer } from 'src/models/ICustomer';
import { IAppointment } from './../../../../models/IAppointment';
import { Subscription } from 'rxjs';
import { ICalendarBranch } from './../../../../models/ICalendarBranch';
import { Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSelectors, CalendarBranchSelectors, ReserveSelectors } from 'src/store';
import * as moment from 'moment';

@Component({
  selector: 'qm-edit-appointment',
  templateUrl: './qm-edit-appointment.component.html',
  styleUrls: ['./qm-edit-appointment.component.scss']
})
export class QmEditAppointmentComponent implements OnInit, OnDestroy {

  userDirection$: Observable<string>;
  private branchSubscription$: Observable<ICalendarBranch>;
  selectedBranch: ICalendarBranch;
  subscriptions: Subscription  = new Subscription();
  selectedAppointment: IAppointment;
  selectedCustomer: ICustomer;
  
  constructor(private userSelectors: UserSelectors, private  calendarBranchSelectors: CalendarBranchSelectors,
    private reserveSelectors: ReserveSelectors) {
    this.branchSubscription$ = this.calendarBranchSelectors.selectedBranch$;
   }

  ngOnInit() {
    this.userDirection$ = this.userDirection$;

    const branchSubscription = this.branchSubscription$.subscribe((cb) => {
      this.selectedBranch = cb;
    });

    this.subscriptions.add(branchSubscription);
  }

  onAppointmentSelect(appointment: IAppointment) {
    this.selectedAppointment = appointment;
    this.selectedCustomer = appointment.customers[0];
  }

  onAppointmentDeselected(appointment: IAppointment) {
    this.selectedAppointment = null;
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
