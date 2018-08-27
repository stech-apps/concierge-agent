import { ToastService } from './../../../../util/services/toast.service';
import { SelectAppointment } from './../../../../store/actions/arrive-appointment.actions';
import { IBranch } from 'src/models/IBranch';
import { Subscription, Observable } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DEBOUNCE_TIME } from './../../../../constants/config';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { IDENTIFY_APPOINTMENT_ANIMATIONS } from 'src/app/animations/identify-appointment.animations';
import {
  AppointmentDispatchers, BranchSelectors, AppointmentSelectors, ArriveAppointmentDispatchers,
  ServicePointSelectors, CustomerDispatchers, CustomerSelector, UserSelectors, ArriveAppointmentSelectors
} from 'src/store';
import { IAppointment } from 'src/models/IAppointment';
import { ICustomer } from 'src/models/ICustomer';
import { filter } from 'rxjs/internal/operators/filter';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'qm-identify-appointment',
  templateUrl: './qm-identify-appointment.component.html',
  styleUrls: ['./qm-identify-appointment.component.scss'],

  animations: IDENTIFY_APPOINTMENT_ANIMATIONS

})

export class QmIdentifyAppointmentComponent implements OnInit, OnDestroy {

  tempCustomer: {
    time?: string;
    date?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    service?: string
  }

  showModalBackDrop: boolean;
  searchedCustomers: ICustomer[] = [];
  tempCustomers: any;
  selectedSearchIcon: string;
  searchPlaceHolderKey: string;
  showSearchInput: boolean;
  searchText: string;
  inputAnimationState: string;
  isSearchInputOpen: boolean;
  fromTime: NgbTimeStruct;
  toTime: NgbTimeStruct;
  inputChanged: Subject<any> = new Subject<any>();
  customerInputChanged: Subject<any> = new Subject<any>();
  fromTimeController: FormControl;
  toTimeController: FormControl;
  subscriptions: Subscription = new Subscription();
  selectedAppointment: IAppointment;
  searchInputController = new FormControl();
  selectedBranch: IBranch;
  showAppointmentCollection: boolean = true;
  currentSearchState: string;
  readonly INITIAL_ANIMATION_STATE = 'out';
  isSearchInputReadOnly: boolean = false;
  showCustomerResults: boolean = false;
  enableAppointmentLoad: boolean = true;
  userDirection$: Observable<string> = new Observable<string>();
  selectedCustomer:ICustomer;
  invalidDateSelected: boolean;

  readonly SEARCH_STATES = {
    DURATION: 'duration',
    INITIAL: 'initial',
    CUSTOMER: 'customer',
    REFRESH: 'refresh',
    ID: 'id'
  };

  readonly CREATED_APPOINTMENT_STATE = 'CREATED';

  isFetchBlock: boolean = false;

  @Output()
  onFlowNext: EventEmitter<any> = new EventEmitter<any>();

  appointments: IAppointment[] = [];

  height: string;

  constructor(private appointmentDispatchers: AppointmentDispatchers,
    private branchSelectors: BranchSelectors, private appointmentSelectors: AppointmentSelectors,
    private arriveAppointmentDispatchers: ArriveAppointmentDispatchers,
    private servicePointSelectors: ServicePointSelectors,
    private toastService: ToastService, private translateService: TranslateService,
    private customerDispatchers: CustomerDispatchers, private customerSelectors: CustomerSelector,
    private userSelectors: UserSelectors,
    private arriveAppointmentSelectors:ArriveAppointmentSelectors
    
  ) {

    this.currentSearchState = this.SEARCH_STATES.INITIAL;
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngOnInit() {
    const selectedAppointmentSub = this.arriveAppointmentSelectors.selectedAppointment$.subscribe(appointment => {
      if(appointment && appointment.customers ){
        this.selectedCustomer = appointment.customers[0];
      }
    });
    this.subscriptions.add(selectedAppointmentSub);

    this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
    this.setDefaultDuration();
    this.fromTimeController = new FormControl('', (control: FormControl) => {
      return this.getTimeSelectionValidity(control.value, this.toTime);
    });

    this.toTimeController = new FormControl('', (control: FormControl) => {
      return this.getTimeSelectionValidity(this.fromTime, control.value);
    });
    this.height = 'calc(100vh - 230px)';

    this.inputChanged
      .subscribe(text => this.searchAppointments());

    this.customerInputChanged
      .pipe(debounceTime(500 || 0))
      .subscribe(text => this.showCustomerAutoComplete());

    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((br) => {
      this.selectedBranch = br;
    });

    const appointmentSubscription = this.appointmentSelectors.appointments$.subscribe((apps) => {
      this.handleAppointmentResponse(apps);
    });

    const uttSubscription = this.servicePointSelectors.uttParameters$
    .subscribe(uttParameters => {
      if (uttParameters) {
        this.enableAppointmentLoad = uttParameters.fetchAppointment;
      }
    });

  this.subscriptions.add(uttSubscription);

    const appointmentErrorSub = this.appointmentSelectors.appointmentsError$.subscribe((error: any) => {
      if (error && error.responseData && error.responseData['status'] === 404) {
        this.translateService.get('appointment_not_found').subscribe(
          (notfoundString: string) => {
            this.toastService.infoToast(notfoundString);
          }
        ).unsubscribe();
      }
    });

    const customerSearchSubscription = this.customerSelectors.appointmentSearchCustomers$.subscribe((customers) => {
      this.searchedCustomers = customers;
    });

    this.subscriptions.add(branchSubscription);
    this.subscriptions.add(appointmentSubscription);
    this.subscriptions.add(appointmentErrorSub);
    this.subscriptions.add(customerSearchSubscription);

    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
     this.readAppointmentFetchTimePeriodFromUtt(params);
    });

    this.subscriptions.add(servicePointsSubscription);
    this.searchAppointments();
  }

  readAppointmentFetchTimePeriodFromUtt(params: any) {
    if (params) {
      this.fromTime.hour = parseInt(moment().add(-1 * params.gapFromTime, 'minutes').format('HH'));
      this.fromTime.minute = parseInt(moment().add(-1 * params.gapFromTime, 'minutes').format('mm'));

      this.toTime.hour = parseInt(moment().add(params.gapToTime, 'minutes').format('HH'));
      this.toTime.minute = parseInt(moment().add(params.gapToTime, 'minutes').format('mm'));
    }
  }

  handleAppointmentResponse(apps: IAppointment[]) {

    if(apps && apps.length > 0) {
      this.appointments = apps.filter(ap=> ap.status === this.CREATED_APPOINTMENT_STATE);
    }
    else {
      this.appointments = [];
    }

    // in id selection go to 
    if (this.SEARCH_STATES.ID == this.currentSearchState &&  this.appointments.length === 1) {
      this.selectedAppointment = apps[0];
      this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
      this.showAppointmentCollection = false;
      this.onAppointmentSelect(this.selectedAppointment);
      this.showModalBackDrop = false;
    }

    if ((!this.appointments || !this.appointments.length)) {
      if (this.currentSearchState === this.SEARCH_STATES.CUSTOMER) {
        this.translateService.get('no_appointments_for_customer').subscribe(
          (noappointments: string) => {
            this.toastService.infoToast(noappointments);
          }
        ).unsubscribe();
      }
      else if (this.currentSearchState === this.SEARCH_STATES.DURATION || this.currentSearchState == this.SEARCH_STATES.REFRESH) {
        this.translateService.get('no_appointments').subscribe(
          (noappointments: string) => {
            this.toastService.infoToast(noappointments);
          }
        ).unsubscribe();
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.customerInputChanged.unsubscribe();
    this.inputChanged.unsubscribe();
  }

  setDefaultDuration() {
    let currentTime = moment();
    this.fromTime = { hour: parseInt(currentTime.format('HH')), minute: parseInt(currentTime.format('mm')), second: 0 };
    this.toTime = { hour: parseInt(currentTime.format('HH')) + 1, minute: parseInt(currentTime.format('mm')), second: 0 };
    this.invalidDateSelected = false;
  }

  getTime(timeString) {
    return moment(timeString).format('HH:mm');
  }

  getDate(timeString) {
    return moment(timeString).format('YYYY-MM-DD');
  }

  getTimeSelectionValidity(fromTime, toTime, isFromTime = true) {
    let validationConfig = null;
    if (fromTime.hour > toTime.hour) {
      validationConfig = { invalidTime: true };
      this.invalidDateSelected = true;
    }
    else if (fromTime.hour == toTime.hour && fromTime.minute >= toTime.minute) {
      validationConfig = { invalidTime: true };
      this.invalidDateSelected = true;
    }
    else {
      this.invalidDateSelected = false;
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
    else if (searchButton === 'duration') {
     this.setDefaultDuration();
    }

    if (this.inputAnimationState == this.INITIAL_ANIMATION_STATE) {
      this.inputAnimationState = searchButton;
    } else if (this.inputAnimationState == searchButton) {
      this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
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

    this.selectedAppointment = null;
    this.isSearchInputReadOnly = false;
    this.arriveAppointmentDispatchers.deselectAppointment();
  }


  onSelectTime() {
    this.isSearchInputOpen = true;
    this.searchText = `${this.pad(this.fromTime.hour, 2)}:${this.pad(this.fromTime.minute, 2)} - ${this.pad(this.toTime.hour, 2)}:${this.pad(this.toTime.minute, 2)}`;
    this.inputAnimationState = 'input';
    this.selectedSearchIcon = '';
    this.searchInputController.setValue(`${this.pad(this.fromTime.hour, 2)}:${ this.pad(this.fromTime.minute, 2)} - ${this.pad(this.toTime.hour, 2)}:${this.pad(this.toTime.minute,2 )}`);
    this.searchAppointments();
    this.showModalBackDrop = false;
  }

  clearInput() {
    this.searchText = '';
    this.showModalBackDrop = false;
    this.isSearchInputOpen = false;
    this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
    this.selectedSearchIcon = '';
    this.isSearchInputReadOnly = false;
    this.appointments = [];
  }

  searchAppointments() {
    let searchQuery: any = {
      branchId: this.selectedBranch.id
    };

    if (this.currentSearchState === this.SEARCH_STATES.DURATION || this.currentSearchState === this.SEARCH_STATES.INITIAL || 
      this.currentSearchState === this.SEARCH_STATES.REFRESH) {
      searchQuery = {
        ...searchQuery,
        fromDate: `${moment().format('YYYY-MM-DD')}T${this.pad(this.fromTime.hour, 2)}:${this.pad(this.fromTime.minute, 2)}`,
        toDate: `${moment().format('YYYY-MM-DD')}T${this.pad(this.toTime.hour, 2)}:${this.pad(this.toTime.minute, 2)}`
      };
    }
    else if (this.currentSearchState === this.SEARCH_STATES.ID) {
      searchQuery = {
        ...searchQuery,
        id: (this.searchText || '').trim()
      };
    }

    this.appointmentDispatchers.searchAppointments(searchQuery);
  }

  onEnterPressed() {
    if (this.currentSearchState !== this.SEARCH_STATES.CUSTOMER) {
      this.inputChanged.next(this.searchText);
    }
  }

  onSeachTextChanged() {
    if (this.currentSearchState === this.SEARCH_STATES.CUSTOMER) {
      this.customerInputChanged.next();
    }
  }

  showCustomerAutoComplete() {
    this.showCustomerResults = true;
    this.customerDispatchers.fetchAppointmentCustomers(this.searchText);
  }
  onSearchInputChange() {
    this.inputChanged.next(this.searchText);
  }

  pad(n, width, z = '0') {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  onAppointmentSelect(appointment: IAppointment) {
    this.arriveAppointmentDispatchers.selectAppointment(appointment);
    this.selectedAppointment = appointment;
    this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
    this.selectedSearchIcon = '';
    this.onFlowNext.emit();
  }

  getSelectedAppointmentInfo() {
    let animationInfo = '';

    if (this.selectedAppointment) {
      animationInfo = `${this.selectedAppointment.customers[0].firstName} `;
      animationInfo += `${this.selectedAppointment.customers[0].lastName} - `;
      animationInfo += `${this.selectedAppointment.startTime.replace('T', ' ')}`;
    }
    return animationInfo;
  }

  deselectAppointment() {
    this.selectedAppointment = null;
    this.arriveAppointmentDispatchers.deselectAppointment();
    this.showAppointmentCollection = true;
  }

  onCustomerSelect(customer: ICustomer) {
    this.searchText = `${customer.firstName} ${customer.lastName}`;
    this.showCustomerResults = false;
    this.showModalBackDrop = false;
    this.isSearchInputReadOnly = true;
    this.appointmentDispatchers.searchAppointments({
      customerId: customer.id
    })
  }

  refreshAppointments() {
    if(this.isFetchBlock === false) {
      this.selectedSearchIcon = '';
      this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
      const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
        this.readAppointmentFetchTimePeriodFromUtt(params);

        this.currentSearchState = this.SEARCH_STATES.REFRESH;
        this.searchAppointments();
        setTimeout(() => {    //<<<---    using ()=> syntax
          this.isFetchBlock = false;
        }, 30000);
    
        this.isFetchBlock = true;
       }).unsubscribe();
    }
  }

  onDone(){
    this.onFlowNext.emit();   
  }

  onCancel(){
    this.inputAnimationState = '';
     this.selectedSearchIcon = '';
     this.showModalBackDrop = false;
  }
}
