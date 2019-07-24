import { Moment } from 'moment';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { CalendarBranchSelectors, CalendarBranchDispatchers, BranchSelectors, BranchDispatchers, CalendarServiceSelectors, CustomerDispatchers, CustomerSelector, ReservationExpiryTimerSelectors, TimeslotSelectors, ServicePointSelectors, TimeslotDispatchers, UserSelectors } from './../../../../store/services';
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
  DraggablepositionX: number;
  DraggablepositionY: number;
  inBounds = true;
  TimerViewExpanded: boolean = true;
  isDraggable: boolean = true;
  TimerSide: string;
  userDirection$: Observable<string>;
  userDirection: string;

  constructor(
    private calendarBranchSelectors: CalendarBranchSelectors, private calendarBranchDispatchers: CalendarBranchDispatchers,
    private branchSelectors: BranchSelectors, private branchDispatchers: BranchDispatchers,
    private calendarServiceSelectors: CalendarServiceSelectors, private reservationExpiryTimerSelectors: ReservationExpiryTimerSelectors,
    private timeSlotSelectors: TimeslotSelectors, private servicePointSelectors: ServicePointSelectors, private localStorage: LocalStorage,
    private serviceSelectors: CalendarServiceSelectors,
    private customerDispatchers: CustomerDispatchers,
    private customerSelectors: CustomerSelector,
    private timeSlotDispatchers: TimeslotDispatchers,
    private userSelectors: UserSelectors) {

    this.DraggablepositionX = 0;
    this.DraggablepositionY = 60;

    this.userDirection$ = this.userSelectors.userDirection$;
    this.userDirection$.subscribe((ud) => {
      this.userDirection = ud;
      this.userDirection = this.userDirection.toLowerCase();
    })
    if (this.userDirection == 'ltr') {
      this.TimerSide = 'right';
    } else {
      this.TimerSide = 'left';
    }
    this.isFlowSkip = localStorage.getSettingForKey(STORAGE_SUB_KEY.BRANCH_SKIP);
    if (this.isFlowSkip === undefined) {
      this.isFlowSkip = true;
    }
    if (this.isFlowSkip === false) {
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
      if (params) {
        this.multiBranchEnabled = params.mltyBrnch;
      }
    });

    this.subscriptions.add(servicePointsSubscription);

    const servicesSubscription = this.calendarServiceSelectors.selectedServices$.subscribe((services) => {
      if (services !== null) {
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

  setPanelClick() {

  }

  deselectTime() { }

  setSelectedBranch() {
    const selectedBranchSub = this.branchSelectors.selectedBranch$.subscribe((sb) => {
      this.calendarBranchDispatchers.selectCalendarBranch(sb as ICalendarBranch);
    });
    this.subscriptions.add(selectedBranchSub);
  }

  branchHeaderClick() {
    const publicBranchSubscription = this.calendarBranchSelectors.isPublicBranchesLoaded$.subscribe((val) => {
      if (!val) {
        this.calendarBranchDispatchers.fetchPublicCalendarBranches();
      }
    });
    this.subscriptions.add(publicBranchSubscription);
  }

  moveReservationTimer($event) {
  }

  onDragEnd($event) {
    this.DraggablepositionX = parseInt($event.x);
    this.DraggablepositionY = parseInt($event.y);
    var draggableTimerElement = document.getElementById('draggable-timer');
    if (this.userDirection == 'ltr' || this.userDirection == 'LTR') {
      if (this.DraggablepositionX < -(window.innerWidth - 199) / 2) {
        if (this.TimerViewExpanded == true) { 
          this.DraggablepositionX = -window.innerWidth + 199;
        } else {
          this.DraggablepositionX = -window.innerWidth + 40;
        }
       
        this.TimerSide = 'left';
      } else {
        this.DraggablepositionX = 8;
        this.TimerSide = 'right';

      }
    } else {
      if (this.DraggablepositionX < (window.innerWidth - 199) / 2) {
        this.DraggablepositionX = 0;
        this.TimerSide = 'left';
      } else {
        if (this.TimerViewExpanded == true) { 
        this.DraggablepositionX = window.innerWidth - 199;
        } else {
          this.DraggablepositionX = window.innerWidth - 40;
        }
        this.TimerSide = 'right';
      }

    }
  }
  // deselectTime(){
  //   this.timeSlotDispatchers.deselectTimeslot();
  // }

  ExpandCollapseTimer() {
    this.TimerViewExpanded = !this.TimerViewExpanded;
    if (this.userDirection == 'ltr' && this.TimerSide == 'left' && this.TimerViewExpanded == false) {
      this.DraggablepositionX = this.DraggablepositionX - 159
    } else if (this.userDirection == 'ltr' && this.TimerSide == 'left' && this.TimerViewExpanded == true) {
      this.DraggablepositionX = this.DraggablepositionX + 159
    }
    else if (this.userDirection == 'rtl' && this.TimerSide == 'right' && this.TimerViewExpanded == false) {
      this.DraggablepositionX = this.DraggablepositionX + 159
    }
    else if (this.userDirection == 'rtl' && this.TimerSide == 'right' && this.TimerViewExpanded == true) {
      this.DraggablepositionX = this.DraggablepositionX - 159
    }
  }
  GoToEdge() {
    if (this.userDirection == 'ltr' && this.TimerSide == 'left' && this.TimerViewExpanded == false) {
      this.DraggablepositionX = this.DraggablepositionX - 159
    } else if (this.userDirection == 'ltr' && this.TimerSide == 'left' && this.TimerViewExpanded == true) {
      this.DraggablepositionX = this.DraggablepositionX + 159
    }
    else if (this.userDirection == 'rtl' && this.TimerSide == 'right' && this.TimerViewExpanded == false) {
      this.DraggablepositionX = this.DraggablepositionX + 159
    }
    else if (this.userDirection == 'rtl' && this.TimerSide == 'right' && this.TimerViewExpanded == true) {
      this.DraggablepositionX = this.DraggablepositionX - 159
    }  
  }
  DraggableChangeButton() {
    this.isDraggable = !this.isDraggable;
  }
  ThirtySecondsGone() {
    console.log("thirty min gone");
    
    this.TimerViewExpanded = false;
    this.GoToEdge();
  }
  ExpandtheTimer($event) {
    if($event == 'TwoMins') {
      this.TimerViewExpanded = true;
      this.GoToEdge();
    } else if ($event == 'EveryTwoMins' && this.TimerViewExpanded == false) {
      this.TimerViewExpanded = true;
      this.GoToEdge();
      setTimeout(() => {
        this.TimerViewExpanded = false;
        this.GoToEdge(); 
      }, 10000);
    }
    else if ('initial') {
      this.TimerViewExpanded = true;
      this.GoToEdge();   
    }
  }
}
