import { Subscription, Observable } from 'rxjs';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { IBranch } from 'src/models/IBranch';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { ICalendarBranch } from '../../../../models/ICalendarBranch';
import { ICalendarService } from '../../../../models/ICalendarService';
import { ReservationExpiryTimerSelectors, CalendarBranchSelectors, CalendarBranchDispatchers, 
         BranchSelectors, BranchDispatchers, CalendarServiceSelectors, TimeslotSelectors } from 'src/store';

@Component({
  selector: 'qm-qm-create-appointment',
  templateUrl: './qm-create-appointment.component.html',
  styleUrls: ['./qm-create-appointment.component.scss']
})
export class QmCreateAppointmentComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  selectedBranch: IBranch = new IBranch();
  flowType = FLOW_TYPE.CREATE_APPOINTMENT;
  selectedServices: ICalendarService[];
  public showExpiryReservationTime$: Observable<Boolean>;
  public selectedTimeSlot$: Observable<string>;

  constructor(
    private calendarBranchSelectors: CalendarBranchSelectors, private calendarBranchDispatchers: CalendarBranchDispatchers,
    private branchSelectors: BranchSelectors, private branchDispatchers: BranchDispatchers,
    private calendarServiceSelectors: CalendarServiceSelectors, private reservationExpiryTimerSelectors: ReservationExpiryTimerSelectors,
    private timeSlotSelectors: TimeslotSelectors) {
      
      this.showExpiryReservationTime$ = this.reservationExpiryTimerSelectors.showReservationExpiryTime$; 
      
      this.selectedTimeSlot$ = this.timeSlotSelectors.selectedTime$;
      const selectedPublicBranchSub = this.calendarBranchSelectors.selectedBranch$.subscribe((sb) => {
      if (sb === undefined || sb.publicId.length === 0){
        this.setSelectedBranch();
      }
      else {
        this.selectedBranch = sb;
      }
    });

    this.subscriptions.add(selectedPublicBranchSub);

    const servicesSubscription = this.calendarServiceSelectors.selectedServices$.subscribe((services) => {
      if(services !== null){
        this.selectedServices = services;
      }
    });

    this.subscriptions.add(servicesSubscription);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setPanelClick(){
    
  }

  setSelectedBranch(){
    const selectedBranchSub = this.branchSelectors.selectedBranch$.subscribe((sb) => {
      this.calendarBranchDispatchers.selectCalendarBranch(sb as ICalendarBranch);
    });
    this.subscriptions.add(selectedBranchSub);
  }

  branchHeaderClick(){
    const serviceLoadedSubscription = this.calendarBranchSelectors.isPublicBranchesLoaded$.subscribe((val) => {
      if(!val){
        this.calendarBranchDispatchers.fetchPublicCalendarBranches();
      }
    });
    this.subscriptions.add(serviceLoadedSubscription);
  }
}
