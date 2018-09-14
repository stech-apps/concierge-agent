import { SortColumns } from './sort-columns.enum';
import { IAppointment } from './../../../../models/IAppointment';
import { ToastService } from './../../../../util/services/toast.service';
import { SelectAppointment } from './../../../../store/actions/arrive-appointment.actions';
import { IBranch } from 'src/models/IBranch';
import { Subscription, Observable } from 'rxjs';
import { OnDestroy, Input } from '@angular/core';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DEBOUNCE_TIME } from './../../../../constants/config';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Component, OnInit, Output, EventEmitter, ApplicationRef } from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { IDENTIFY_APPOINTMENT_ANIMATIONS } from 'src/app/animations/identify-appointment.animations';
import {
  AppointmentDispatchers, BranchSelectors, AppointmentSelectors,
  ServicePointSelectors, CustomerDispatchers, CustomerSelector, UserSelectors, CalendarBranchSelectors, NativeApiSelectors,
} from 'src/store';
import { ICustomer } from 'src/models/ICustomer';
import { filter } from 'rxjs/internal/operators/filter';
import { TranslateService } from '@ngx-translate/core';
import { Moment } from 'moment-timezone';
import { CalendarDate } from 'src/app/components/containers/qm-calendar/qm-calendar.component';
import { ICalendarBranch } from 'src/models/ICalendarBranch';
import { NativeApiService } from '../../../../util/services/native-api.service';

@Component({
  selector: 'qm-identify-appointment',
  templateUrl: './qm-identify-appointment.component.html',
  styleUrls: ['./qm-identify-appointment.component.scss'],

  animations: IDENTIFY_APPOINTMENT_ANIMATIONS

})

export class QmIdentifyAppointmentComponent implements OnInit, OnDestroy {
  selectedDate: CalendarDate;

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
  defaultAppointmentCollection: IAppointment[];
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
  customerNotFound: boolean = false;
  selectedCustomer: ICustomer;
  invalidDateSelected: boolean;
  isLoaded: boolean;
  isLoading: boolean;
  isSearchedCustomerLoaded: boolean;
  isSearchedCustomerLoading: boolean;
  white: string = "white";
  black: string = "black";
  uttFromTime: Moment;
  uttToTime: Moment;
  isInDateDurationSelection: boolean = true;
  selectedCalendarBranch: ICalendarBranch;
  sortColumn: string = SortColumns.startTime;
  isDescending: boolean = false;
  selectedDates: CalendarDate[] = [{
    mDate: moment(),
    selected: true
  }];
  qrCodeValue: string;

  selectedBranchFormatted = { selectedBranch: ''} ;

  readonly SEARCH_STATES = {
    DURATION: 'duration',
    DURATION_WITH_DATE: 'durationWithDate',
    INITIAL: 'initial',
    CUSTOMER: 'customer',
    REFRESH: 'refresh',
    ID: 'id',
    QR: 'qr'
  };

  readonly CREATED_APPOINTMENT_STATE = 'CREATED';
  readonly CREATED_APPOINTMENT_STATE_ID = 20;
  readonly ARRIVED_APPOINTMENT_STATE_ID = 30;
  readonly ARRIVED_APPOINTMENT_STATE = 'ARRIVED';

  isFetchBlock: boolean = false;

  @Output()
  onFlowNext: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  useCalendarEndpoint: boolean = false;

  @Input()
  enableSearchByDay: boolean = false;

  @Output()
  appointmentSelected: EventEmitter<IAppointment> = new EventEmitter<IAppointment>();

  @Output()
  appointmentDeselected: EventEmitter<any> = new EventEmitter();

  appointments: IAppointment[] = [];

  height: string;

  constructor(private appointmentDispatchers: AppointmentDispatchers,
    private branchSelectors: BranchSelectors, private appointmentSelectors: AppointmentSelectors,
    private servicePointSelectors: ServicePointSelectors,
    private toastService: ToastService, private translateService: TranslateService,
    private customerDispatchers: CustomerDispatchers, private customerSelectors: CustomerSelector,
    private calendarBranchSelectors: CalendarBranchSelectors,
    private userSelectors: UserSelectors,
    private nativeApi: NativeApiService,
    private nativeApiSelector: NativeApiSelectors,
    private applicationRef: ApplicationRef
  ) {

    this.currentSearchState = this.SEARCH_STATES.INITIAL;
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngOnInit() {

    const customerSearchLoadedSubscription = this.customerSelectors.customerLoaded$.subscribe((value) => {
      this.isSearchedCustomerLoaded = value;
    });

    const customerSearchLoadingSubscription = this.customerSelectors.customerLoading$.subscribe((value) => {
      this.isSearchedCustomerLoading = value;
    });

    this.subscriptions.add(customerSearchLoadedSubscription);
    this.subscriptions.add(customerSearchLoadingSubscription);

    const loadedSubscription = this.appointmentSelectors.appointmentsLoaded$.subscribe((load) => {
      this.isLoaded = load;
    })
    this.subscriptions.add(loadedSubscription);

    const loadingSubscription = this.appointmentSelectors.appointmentsLoading$.subscribe((load) => {
      this.isLoading = load;
    })
    this.subscriptions.add(loadingSubscription);

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
      this.selectedBranchFormatted.selectedBranch = br.name;     
    });


    if (this.useCalendarEndpoint) {
      const calendarAppointmentSubscription = this.appointmentSelectors.calendarAppointments$.subscribe((apps) => {
        this.calendarBranchSelectors.branches$.subscribe((bs)=> {
          this.selectedCalendarBranch = bs.find(x=> x.id == this.selectedBranch.id);
          this.handleAppointmentResponse(apps);
        }).unsubscribe();       
      });

      this.subscriptions.add(calendarAppointmentSubscription);
    }
    else {
      const appointmentSubscription = this.appointmentSelectors.appointments$.subscribe((apps) => {
        this.handleAppointmentResponse(apps);
      });

      this.subscriptions.add(appointmentSubscription);
    }


    const uttSubscription = this.servicePointSelectors.uttParameters$
      .subscribe(uttParameters => {
        if (uttParameters) {
          this.enableAppointmentLoad = uttParameters.fetchAppointment;
        }
      });

    this.subscriptions.add(uttSubscription);

    const appointmentErrorSub = this.appointmentSelectors.appointmentsError$.subscribe((error: any) => {
      if (error && error.responseData && error.responseData['status'] === 404) {
        this.showAppointmentNotFoundError();
      }
    });

    if(this.useCalendarEndpoint) {
      const customersFromAllDates = this.customerSelectors.customer$.subscribe((customers) => {
        if (!customers || customers.length === 0 && this.currentSearchState === this.SEARCH_STATES.CUSTOMER) {
          this.customerNotFound = true;
        }
        else {
          this.customerNotFound = false;
        }
        this.searchedCustomers = customers;
      });
  
      this.subscriptions.add(customersFromAllDates);
    }
    else {
      const customerSearchSubscription = this.customerSelectors.appointmentSearchCustomers$.subscribe((customers) => {
        if (!customers || customers.length === 0 && this.currentSearchState === this.SEARCH_STATES.CUSTOMER) {
          this.customerNotFound = true;
        }
        else {
          this.customerNotFound = false;
        }
        this.searchedCustomers = customers;
      });
  
      this.subscriptions.add(customerSearchSubscription);
    }

    this.subscriptions.add(branchSubscription);
    this.subscriptions.add(appointmentErrorSub);

    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      this.readAppointmentFetchTimePeriodFromUtt(params);
        this.searchAppointments();
    });

    this.subscriptions.add(servicePointsSubscription);

    const appointmentsLoadedSub = this.appointmentSelectors.appointmentsLoaded$.subscribe(isLoaded => {
      if (isLoaded && (this.currentSearchState === this.SEARCH_STATES.INITIAL) && this.appointments.length === 0) {
        this.translateService.get('no_appointments').subscribe(
          (noappointments: string) => {
            this.toastService.infoToast(noappointments);
          }
        ).unsubscribe();
      }
    });
    this.subscriptions.add(appointmentsLoadedSub);

    const calendarBranchsSub = this.calendarBranchSelectors.branches$.subscribe((bs) => {
        this.selectedCalendarBranch = bs.find(x=> x.id == this.selectedBranch.id);
    });

    this.subscriptions.add(calendarBranchsSub);

    const qrCodeSubscription = this.nativeApiSelector.qrCode$.subscribe((value) => {
      if(value != null){
        try{
          this.currentSearchState = this.SEARCH_STATES.QR;
          var jsonObject = JSON.parse(value);
          this.qrCodeValue = jsonObject.appointment_id;
          this.searchAppointments();
        }
        catch(err){
          this.showQRCodeError();
        }
      }
    });
    this.subscriptions.add(qrCodeSubscription);
    this.sortColumn =  this.useCalendarEndpoint ?  SortColumns.start : SortColumns.startTime;
  }

  showQRCodeError(){
    this.translateService.get('appointment_not_found_qr').subscribe(
      (noappointments: string) => {
        this.toastService.infoToast(noappointments);
      }
    ).unsubscribe();
  }

  showAppointmentNotFoundError() {
    this.translateService.get('appointment_not_found').subscribe(
      (notfoundString: string) => {
        this.toastService.infoToast(notfoundString);
      }
    ).unsubscribe();
  }

  readAppointmentFetchTimePeriodFromUtt(params: any) {
    if (params) {
      this.uttFromTime = moment().subtract(params.gapFromTime, 'minutes');
      this.uttToTime = moment().add(params.gapFromTime, 'minutes');
    }
  }

  applyAppointmentFilters(appointments: IAppointment[]) {
    if (this.useCalendarEndpoint) {
      return appointments.filter(ap => ap.status === this.CREATED_APPOINTMENT_STATE_ID && this.selectedCalendarBranch && ap.branch.qpId === this.selectedCalendarBranch.qpId);
    } else {
      return appointments.filter(ap => ap.status === this.CREATED_APPOINTMENT_STATE && ap.branchId === this.selectedBranch.id);
    }
  }

  toggleDurationSelection(isDateHeaderClicked) {
    this.isInDateDurationSelection = !!isDateHeaderClicked;
  }

  handleAppointmentResponse(apps: IAppointment[]) {
    if (apps && apps.length > 0) {
      this.appointments = this.applyAppointmentFilters(apps);
    }
    else {
      this.appointments = [];
    }

    // in id search handle id search cases
    if (this.SEARCH_STATES.ID == this.currentSearchState || this.SEARCH_STATES.QR === this.currentSearchState) {
      if (this.appointments.length === 1) {
        this.selectedAppointment = apps[0];
        this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
        this.showAppointmentCollection = false;
        this.onAppointmentSelect(this.selectedAppointment);
        this.showModalBackDrop = false;
        this.applicationRef.tick();
      }

      // search appointment is already arrived? then notifiy user
      if (apps.filter(ap => ap.status === this.ARRIVED_APPOINTMENT_STATE).length > 0 || (this.useCalendarEndpoint && apps.filter(ap => ap.status === this.ARRIVED_APPOINTMENT_STATE_ID).length > 0 )) {
        this.translateService.get('appointment_arrived').subscribe(
          (noappointments: string) => {
            this.toastService.infoToast(noappointments);
          }
        ).unsubscribe();
      }
    }
    else if (this.currentSearchState === this.SEARCH_STATES.INITIAL || this.currentSearchState == this.SEARCH_STATES.REFRESH) {
      this.defaultAppointmentCollection = this.appointments;
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
      else if(this.currentSearchState === this.SEARCH_STATES.ID && this.useCalendarEndpoint && apps.filter(ap => ap.status === this.ARRIVED_APPOINTMENT_STATE_ID).length === 0) {
        this.showAppointmentNotFoundError();
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
    this.selectedDates = [{ mDate: moment(), selected: true }];
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
    this.showAppointmentCollection = true;

    if (searchButton == this.SEARCH_STATES.ID) {
      this.searchPlaceHolderKey = 'please_enter_id_and_press_enter';
    }
    else if (searchButton === this.SEARCH_STATES.CUSTOMER) {
      this.searchPlaceHolderKey = 'please_enter_customer_attributes';
    }
    else if (searchButton === this.SEARCH_STATES.DURATION) {
      this.setDefaultDuration();
      if(this.enableSearchByDay) {
        this.isInDateDurationSelection = true;
      }
    }
    else if(searchButton === this.SEARCH_STATES.QR) {
      this.nativeApi.openQRScanner();
    }

    if (this.inputAnimationState == searchButton || (this.inputAnimationState == this.SEARCH_STATES.DURATION_WITH_DATE 
      && searchButton == this.SEARCH_STATES.DURATION ) ) {
      this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
    }
    else {
      this.inputAnimationState = this.enableSearchByDay && searchButton === this.SEARCH_STATES.DURATION ?  this.SEARCH_STATES.DURATION_WITH_DATE : searchButton;
    }

    if (this.selectedSearchIcon != searchButton) {
      this.showModalBackDrop = true;
      this.selectedSearchIcon = searchButton;
      this.currentSearchState = searchButton;
    }
    else if(this.selectedSearchIcon === searchButton && (this.searchText.trim())) {
      this.showModalBackDrop = true;
      this.currentSearchState = searchButton;
      this.inputAnimationState = searchButton;
     
    }
    else{
      this.showModalBackDrop = false;
      this.selectedSearchIcon = '';
    }

    this.searchText = '';
    this.selectedAppointment = null;
    this.isSearchInputReadOnly = false;
    this.customerNotFound = false;
    this.showCustomerResults = false;
    this.searchedCustomers = [];
    this.appointmentDeselected.emit();
    this.appointments = this.defaultAppointmentCollection;
    this.selectedCustomer = null;
    //this.arriveAppointmentDispatchers.deselectAppointment();
  }


  onSelectTime() {
    this.isSearchInputOpen = true;
    let formattedTime = `${this.pad(this.fromTime.hour, 2)}:${this.pad(this.fromTime.minute, 2)} - ${this.pad(this.toTime.hour, 2)}:${this.pad(this.toTime.minute, 2)}`;
    if(this.enableSearchByDay) {
      formattedTime = this.selectedDate.mDate.format('YYYY-MM-DD') + ' / ' + formattedTime;
    }
    
    this.searchText = formattedTime;
    this.inputAnimationState = 'input';
    this.selectedSearchIcon = '';
    this.searchInputController.setValue(formattedTime);
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
    this.customerNotFound = false;
    this.appointments = this.defaultAppointmentCollection;
    this.showCustomerResults = false;
  }

  searchAppointments() {
    let searchQuery: any = {
      branchId: this.selectedBranch.id,
      useCalendarEndpoint: this.useCalendarEndpoint
    };

    if (this.currentSearchState === this.SEARCH_STATES.DURATION) {
      let now = moment();
      searchQuery = {
        ...searchQuery,
        fromDate: this.getformattedTimeForDurationSearch(true),
        toDate: this.getformattedTimeForDurationSearch(false)
      };
    }
    else if (this.currentSearchState === this.SEARCH_STATES.INITIAL ||
      this.currentSearchState === this.SEARCH_STATES.REFRESH) {
      searchQuery = {
        ...searchQuery,
        fromDate: this.getUttDefaultTimeForSearch(this.uttFromTime),
        toDate: this.getUttDefaultTimeForSearch(this.uttToTime)
      };
    }
    else if (this.currentSearchState === this.SEARCH_STATES.ID) {
      searchQuery = {
        ...searchQuery,
        id: (this.searchText || '').trim()
      };
    }
    else if (this.currentSearchState === this.SEARCH_STATES.QR) {
      searchQuery = {
        ...searchQuery,
        id: (this.qrCodeValue || '').trim()
      };
    }

    if (this.useCalendarEndpoint) {
      this.appointmentDispatchers.searchCalendarAppointments(searchQuery);
    }
    else {
      this.appointmentDispatchers.searchAppointments(searchQuery);
    }
  }

  getUttDefaultTimeForSearch(uttTime: Moment) {
    let formattedDate = `${uttTime.format('YYYY-MM-DD')}T${uttTime.format('HH')}:${uttTime.format('mm')}`;
       // adjust the time zone for calendar endpoint
       if(this.useCalendarEndpoint) {
        formattedDate = moment(formattedDate).tz(this.selectedCalendarBranch.fullTimeZone).utc()
        .format('YYYY-MM-DD HH:mm').replace(' ', 'T');
      }

    return formattedDate;
  }

  getformattedTimeForDurationSearch(isFromTime: boolean) {
    let formattedDate: string;
    if(this.enableSearchByDay) {
      if(isFromTime) {
        formattedDate = `${this.selectedDate.mDate.format('YYYY-MM-DD')}T${this.pad(this.fromTime.hour, 2)}:${this.pad(this.fromTime.minute, 2)}`;
      }
      else {
        formattedDate = `${this.selectedDate.mDate.format('YYYY-MM-DD')}T${this.pad(this.toTime.hour, 2)}:${this.pad(this.toTime.minute, 2)}`;
      }
    }
    else {
      let now = moment();
      if(isFromTime) {
        formattedDate = `${now.format('YYYY-MM-DD')}T${this.pad(this.fromTime.hour, 2)}:${this.pad(this.fromTime.minute, 2)}`;
      }
      else {
        formattedDate = `${now.format('YYYY-MM-DD')}T${this.pad(this.toTime.hour, 2)}:${this.pad(this.toTime.minute, 2)}`;
      }
    }  
    // adjust the time zone for calendar endpoint
    if(this.useCalendarEndpoint) {
      formattedDate = moment(formattedDate).tz(this.selectedCalendarBranch.fullTimeZone).utc()
      .format('YYYY-MM-DD, HH:mm').replace(', ', 'T');
    }

    return formattedDate;
  }

  onSelectDate(selectedDate: CalendarDate) {
      this.selectedDate  = selectedDate;
  }

  onEnterPressed() {
    if (this.currentSearchState !== this.SEARCH_STATES.CUSTOMER ) {
      const trimmedSearchText =  (this.searchText || '').trim();
      if(trimmedSearchText) {
        if(this.currentSearchState === this.SEARCH_STATES.ID && !(/^-{0,1}\d+$/.test(trimmedSearchText))) {
          this.translateService.get('appointment_invalid_entry').subscribe((msg)=> {
            this.toastService.infoToast(msg)
          }).unsubscribe();
        }
        else {
          this.inputChanged.next(trimmedSearchText);
        }       
      }
      else if(this.currentSearchState = this.SEARCH_STATES.ID) {
        this.translateService.get('please_enter_id_and_press_enter').subscribe((msg)=> {
          this.toastService.infoToast(msg)
        }).unsubscribe();
      }      
    }
  }

  onSeachTextChanged() {
    if (this.currentSearchState === this.SEARCH_STATES.CUSTOMER) {
      this.customerNotFound = false;
      if ((this.searchText || '').trim().length >= 2) {
        this.customerInputChanged.next();
      }
    }
  }

  showCustomerAutoComplete() {
    this.showCustomerResults = true;
    if(this.useCalendarEndpoint) {
      this.customerDispatchers.fetchCustomers((this.searchText || '').trim());
    }
    else {
      this.customerDispatchers.fetchAppointmentCustomers((this.searchText || '').trim());
    }
  }
  onSearchInputChange() {
    this.inputChanged.next(this.searchText);
  }

  pad(n, width, z = '0') {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  onAppointmentSelect(appointment: IAppointment) {
    //this.arriveAppointmentDispatchers.selectAppointment(appointment);
    this.selectedAppointment = appointment;
    this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
    this.selectedSearchIcon = '';
    this.onFlowNext.emit();
    this.appointmentSelected.emit(appointment);
    this.selectedCustomer = appointment.customers[0];
  }

  getSelectedAppointmentInfo() {
    let appointmentInfo = '';

    if (this.selectedAppointment) {
      appointmentInfo = `${this.selectedAppointment.customers[0].firstName} `;
      appointmentInfo += `${this.selectedAppointment.customers[0].lastName} - `;


      if(this.useCalendarEndpoint) {
        appointmentInfo += moment(this.selectedAppointment.start).tz(this.selectedCalendarBranch.fullTimeZone)
        .format('YYYY-MM-DD HH:mm');
      } else {
        appointmentInfo += this.selectedAppointment.startTime.replace('T', ' ').slice(0, -3);
      }
    }
    return appointmentInfo;
  }

  deselectAppointment() {
    this.selectedAppointment = null;
    //this.arriveAppointmentDispatchers.deselectAppointment();
    this.showAppointmentCollection = true;
    this.selectedCustomer = null;
    this.appointments = this.defaultAppointmentCollection;
    this.appointmentDeselected.emit();
  }

  onCustomerSelect(customer: ICustomer) {
    this.searchText = `${customer.firstName} ${customer.lastName}`;
    this.showCustomerResults = false;
    this.showModalBackDrop = false;
    this.isSearchInputReadOnly = true;
    if(this.useCalendarEndpoint) {
      this.appointmentDispatchers.searchCalendarAppointments({
        customerId: customer.id
      });
    }
    else {
      this.appointmentDispatchers.searchAppointments({
        customerId: customer.id
      });
    }
  }

  refreshAppointments() {
    if (this.isFetchBlock === false) {
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

  onDone() {
    this.onFlowNext.emit();
  }

  onCancel() {
    this.inputAnimationState = '';
    this.selectedSearchIcon = '';
    this.showModalBackDrop = false;
  }

  showLoading() {
    return !this.isLoaded && this.isLoading;
  }

  showLoadingCustomers() {
    return !this.isSearchedCustomerLoaded && this.isSearchedCustomerLoading;
  }

  sortAppointments(sortColumn: string) {
    if(this.sortColumn === sortColumn) {
      this.isDescending = !this.isDescending;
    }
    else {
      this.isDescending = false;
    }
    this.sortColumn = sortColumn;
  }
}
