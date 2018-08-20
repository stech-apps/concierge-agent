import { IBranch } from 'src/models/IBranch';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DEBOUNCE_TIME } from './../../../../constants/config';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { IDENTIFY_APPOINTMENT_ANIMATIONS } from 'src/app/animations/identify-appointment.animations';
import { AppointmentDispatchers, BranchSelectors, AppointmentSelectors, ArriveAppointmentDispatchers } from 'src/store';
import { IAppointment } from 'src/models/IAppointment';
import { ICustomer } from 'src/models/ICustomer';

@Component({
  selector: 'qm-identify-appointment',
  templateUrl: './qm-identify-appointment.component.html',
  styleUrls: ['./qm-identify-appointment.component.scss'],

  animations: IDENTIFY_APPOINTMENT_ANIMATIONS

})

export class QmIdentifyAppointmentComponent implements OnInit, OnDestroy {

  tempCustomer:{
  time?:string;
  date?:string;
  id?:string;
  firstName?:string;
  lastName?:string;
  service?:string
}

  showModalBackDrop: boolean;
  tempCustomers:any;
  selectedSearchIcon: string;
  searchPlaceHolderKey: string;
  showSearchInput: boolean;
  searchText: string;
  inputAnimationState: string;
  isSearchInputOpen: boolean;
  fromTime: NgbTimeStruct;
  toTime: NgbTimeStruct;
  inputChanged: Subject<string> = new Subject<string>();
  fromTimeController: FormControl;
  toTimeController: FormControl;
  subscriptions: Subscription = new Subscription();
  searchInputController = new FormControl();
  selectedBranch: IBranch;
  currentSearchState: string;
  readonly SEARCH_STATES = {
    DURATION: 'duration'
  };

  @Output()
  onFlowNext:  EventEmitter<any> = new EventEmitter<any>();

  appointments: IAppointment[] = [];

  height:string;

  constructor(private appointmentDispatchers: AppointmentDispatchers,
    private branchSelectors: BranchSelectors, private appointmentSelectors: AppointmentSelectors,
    private arriveAppointmentDispatchers: ArriveAppointmentDispatchers
  ) { }

  ngOnInit() {
    this.inputAnimationState = 'out';
    this.setInitialTime();
    this.fromTimeController = new FormControl('', (control: FormControl) => {
      return this.getTimeSelectionValidity(control.value, this.toTime);
    });

    this.toTimeController = new FormControl('', (control: FormControl) => {
      return this.getTimeSelectionValidity(this.fromTime, control.value);
    });
    /*this.tempCustomer={time:'11:09',date:'2018-05-10', id:'2096', firstName:'john',lastName:'david',service:'service 1'}
    this.tempCustomers=[this.tempCustomer,this.tempCustomer,this.tempCustomer,this.tempCustomer,
      this.tempCustomer,this.tempCustomer,this.tempCustomer,this.tempCustomer,this.tempCustomer,
      this.tempCustomer,this.tempCustomer,this.tempCustomer,this.tempCustomer,this.tempCustomer,
      this.tempCustomer,this.tempCustomer,this.tempCustomer,this.tempCustomer,this.tempCustomer]
      */
    this.height = 'calc(100vh - 230px)';

    this.inputChanged
      .pipe(distinctUntilChanged(), debounceTime(DEBOUNCE_TIME || 0))
      .subscribe(text => this.searchApointments(text));

    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((br) => {
      this.selectedBranch = br;
    });

    const appointmentSubscription = this.appointmentSelectors.appointments$.subscribe((apps) => {
      this.appointments = apps;
    });

    this.subscriptions.add(branchSubscription);
    this.subscriptions.add(appointmentSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setInitialTime() {
    let currentTime = moment();
    this.fromTime = { hour: parseInt(currentTime.format('HH')), minute: parseInt(currentTime.format('mm')), second: 0 };
    this.toTime = { hour: parseInt(currentTime.format('HH')) + 1, minute: parseInt(currentTime.format('mm')), second: 0 };
  }

  getTime(timeString) {
    return moment(timeString).format('HH:mm');
  }

  getDate(timeString) {
    return moment(timeString).format('YYYY-MM-DD');
  }

  getTimeSelectionValidity(fromTime, toTime) {
    let validationConfig = null;
    if (fromTime.hour > toTime.hour) {
      validationConfig = { invalidTime: true };
    }
    if (fromTime.hour == toTime.hour && fromTime.minute >= toTime.minute) {
      validationConfig = { invalidTime: true };
    }
    return validationConfig;
  }

  onSearchButtonClick(searchButton) {
    this.isSearchInputOpen = !this.isSearchInputOpen;
    this.searchText = '';
    if (searchButton == 'id') {
      this.searchPlaceHolderKey = 'please_enter_id_and_press_enter';
    }
    else if (searchButton === 'customer') {
      this.searchPlaceHolderKey = 'please_enter_customer_attributes';
    }

    if (this.inputAnimationState == 'out') {
      this.inputAnimationState = searchButton;
    } else if (this.inputAnimationState == searchButton) {
      this.inputAnimationState = 'out';
    }
    else {
      this.inputAnimationState = searchButton;
    }

    if (this.selectedSearchIcon != searchButton) {
      this.showModalBackDrop = true;
      this.selectedSearchIcon = searchButton;
      this.currentSearchState = searchButton;
    }
    else {
        this.showModalBackDrop = false;   
        this.selectedSearchIcon = '';   
    }    
  }


  onSelectTime() {
    this.isSearchInputOpen = true;
    this.searchText = `${this.fromTime.hour} : ${this.fromTime.minute} - ${this.toTime.hour} : ${this.toTime.minute}`;
    this.inputAnimationState = 'input';
    this.selectedSearchIcon = '';
    this.searchInputController.setValue( `${this.fromTime.hour} : ${this.fromTime.minute} - ${this.toTime.hour} : ${this.toTime.minute}`);
    this.searchApointments(this.searchText);
    this.showModalBackDrop = false;
    
  }

  searchApointments(searchText) {
    let searchQuery: any = {
      branchId: this.selectedBranch.id
    };

    if (this.currentSearchState === this.SEARCH_STATES.DURATION) {
      searchQuery = {
        ...searchQuery,
        fromDate: `${moment().format('YYYY-MM-DD')}T${this.pad(this.fromTime.hour, 2)}:${this.pad(this.fromTime.minute,2)}`,
        toDate: `${moment().format('YYYY-MM-DD')}T${ this.pad(this.toTime.hour,2)}:${this.pad(this.toTime.minute, 2)}`
      };
    }

    this.appointmentDispatchers.searchAppointments(searchQuery);
  }

  onSearchInputChange() {
    this.inputChanged.next(this.searchText);
  }

  pad(n, width, z = '0') {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  onAppointmentSelect(selectedCustomer: ICustomer){
    this.arriveAppointmentDispatchers.SelectArrivedCustomer(selectedCustomer);
    this.onFlowNext.emit();
  }
}
