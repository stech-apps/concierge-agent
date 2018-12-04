import { Moment } from 'moment';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { CalendarBranchSelectors, CalendarBranchDispatchers, BranchSelectors, BranchDispatchers, CalendarServiceSelectors, CustomerDispatchers, CustomerSelector, ReservationExpiryTimerSelectors,TimeslotSelectors, ServicePointSelectors, TimeslotDispatchers } from './../../../../store/services';
import { IBranch } from 'src/models/IBranch';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { ICalendarBranch } from '../../../../models/ICalendarBranch';
import { ICalendarService } from '../../../../models/ICalendarService';
import { LocalStorage, STORAGE_SUB_KEY } from '../../../../util/local-storage';
import { ICustomer } from '../../../../models/ICustomer';
import { ICalendarBranchViewModel } from 'src/models/ICalendarBranchViewModel';

@Component({
  selector: 'qm-qm-create-appointment',
  templateUrl: './qm-create-appointment.component.html',
  styleUrls: ['./qm-create-appointment.component.scss']
})
export class QmCreateAppointmentComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  currentBranch: IBranch = new IBranch();
  flowType = FLOW_TYPE.CREATE_APPOINTMENT;
  selectedServices: ICalendarService[];
  public showExpiryReservationTime$: Observable<Boolean>;
  public selectedTimeSlot$: Observable<string>;
  public selectedDate$: Observable<Moment>;
  public multiBranchEnabled = true;
  public isFlowSkip = true;
  currentCustomer: ICustomer;
  currentCustomer$: Observable<ICustomer>;

  constructor(
    private calendarBranchSelectors: CalendarBranchSelectors, private calendarBranchDispatchers: CalendarBranchDispatchers,
    private branchSelectors: BranchSelectors, private branchDispatchers: BranchDispatchers,
    private calendarServiceSelectors: CalendarServiceSelectors, private reservationExpiryTimerSelectors: ReservationExpiryTimerSelectors,
    private timeSlotSelectors: TimeslotSelectors, private servicePointSelectors: ServicePointSelectors, private localStorage: LocalStorage,
    private serviceSelectors: CalendarServiceSelectors,
    private customerDispatchers:CustomerDispatchers,
    private customerSelectors:CustomerSelector,
  private timeSlotDispatchers:TimeslotDispatchers) {
         
      this.isFlowSkip = localStorage.getSettingForKey(STORAGE_SUB_KEY.BRANCH_SKIP);
      if(this.isFlowSkip === undefined){
        this.isFlowSkip = true;
      }
      if(this.isFlowSkip === false){
        this.branchHeaderClick();
      }
  
      this.showExpiryReservationTime$ = this.reservationExpiryTimerSelectors.showReservationExpiryTime$;
      this.selectedTimeSlot$ = this.timeSlotSelectors.selectedTime$;
      this.selectedDate$ = this.timeSlotSelectors.selectedDate$;
      const selectedPublicBranchSub = this.calendarBranchSelectors.selectedBranch$.subscribe((sb) => {
        this.currentBranch = sb;      
    });

    this.subscriptions.add(selectedPublicBranchSub);

    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params){
        this.multiBranchEnabled = params.mltyBrnch;
      }
    });

    this.subscriptions.add(servicePointsSubscription);

    const servicesSubscription = this.calendarServiceSelectors.selectedServices$.subscribe((services) => {
      if(services !== null){
        this.selectedServices = services;
      }
    });

    this.subscriptions.add(servicesSubscription);

    const customerSubscription = this.customerSelectors.currentCustomer$.subscribe((customer) => {
      this.currentCustomer = customer;
    });
    this.subscriptions.add(customerSubscription);
  }

  
  ngOnInit() {
    
    const calendarBranchSubscription = this.calendarBranchSelectors.branches$.subscribe((bs) => {
      let calendarBranches = <Array<ICalendarBranchViewModel>>bs;

      this.branchSelectors.selectedBranch$.subscribe((spBranch) => {
        //if flow is skipped then use the service point branch as current branch
        if (this.isFlowSkip) {
          calendarBranches.forEach((cb) => {
            if (spBranch.id === cb.qpId) {
              this.currentBranch = cb;
              this.calendarBranchDispatchers.selectCalendarBranch(cb);
            }
          });
        }        
      });
    }); 

    this.subscriptions.add(calendarBranchSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setPanelClick(){
    
  }

  deselectTime(){}

  setSelectedBranch(){
    const selectedBranchSub = this.branchSelectors.selectedBranch$.subscribe((sb) => {
      this.calendarBranchDispatchers.selectCalendarBranch(sb as ICalendarBranch);
    });
    this.subscriptions.add(selectedBranchSub);
  }

  branchHeaderClick(){
    const publicBranchSubscription = this.calendarBranchSelectors.isPublicBranchesLoaded$.subscribe((val) => {
      if(!val){
        this.calendarBranchDispatchers.fetchPublicCalendarBranches();
      }
    });
    this.subscriptions.add(publicBranchSubscription);
  }

  moveReservationTimer($event) {
  }
  
  // deselectTime(){
  //   this.timeSlotDispatchers.deselectTimeslot();
  // }
}
