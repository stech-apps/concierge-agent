import { SortColumns } from "./sort-columns.enum";
import { IAppointment } from "./../../../../models/IAppointment";
import { ToastService } from "./../../../../util/services/toast.service";
import { SelectAppointment } from "./../../../../store/actions/arrive-appointment.actions";
import { IBranch } from "src/models/IBranch";
import { Subscription, Observable } from "rxjs";
import { OnDestroy, Input } from "@angular/core";
import { debounceTime, timeout } from "rxjs/operators";
import { Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import * as moment from "moment";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { IDENTIFY_APPOINTMENT_ANIMATIONS } from "src/app/animations/identify-appointment.animations";
import {
  AppointmentDispatchers,
  BranchSelectors,
  AppointmentSelectors,
  ServicePointSelectors,
  CustomerDispatchers,
  CustomerSelector,
  UserSelectors,
  CalendarBranchSelectors,
  NativeApiSelectors,
  NativeApiDispatchers,
  QueueDispatchers,
  SystemInfoSelectors
} from "src/store";
import { ICustomer } from "src/models/ICustomer";
import { filter } from "rxjs/internal/operators/filter";
import { TranslateService } from "@ngx-translate/core";
import { Moment } from "moment-timezone";
import { CalendarDate } from "src/app/components/containers/qm-calendar/qm-calendar.component";
import { ICalendarBranch } from "src/models/ICalendarBranch";
import { NativeApiService } from "../../../../util/services/native-api.service";
import {
  APPOINTMENT_STATE_ID,
  APPOINTMENT_STATUS
} from "../../../../util/q-state";
import { Util } from "../../../../util/util";
import { QmModalService } from "../qm-modal/qm-modal.service";
import { start } from "repl";
import { timingSafeEqual } from "crypto";

@Component({
  selector: "qm-identify-appointment",
  templateUrl: "./qm-identify-appointment.component.html",
  styleUrls: ["./qm-identify-appointment.component.scss"],

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
    service?: string;
  };

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
  readonly INITIAL_ANIMATION_STATE = "out";
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
  uttToTime: Moment;
  selectedToTime: Moment;
  selectedFromTime: Moment;
  uttFromTime: Moment;
  isInDateDurationSelection: boolean = true;
  selectedCalendarBranch: ICalendarBranch;
  sortColumn: string = SortColumns.startTime;
  isDescending: boolean = false;
  selectedDates: CalendarDate[] = [
    {
      mDate: moment(),
      selected: true
    }
  ];
  qrCodeValue: string;
  qrCodeContent: any;

  selectedBranchFormatted = { selectedBranch: "" };
  qrCodeListnerTimer: any;
  isQrCodeLoaded = false;
  isMultiBranchEnable = false;
  isShowAppointmentNotFound = false;
  branchList: IBranch[];
  desktopQRCodeListnerTimer: any;
  // isQRReaderOpen = false;
  isQRReaderClose = false;
  flowType: string;
  editMode: boolean;
  currentCustomer: ICustomer;
  sortColumnPriorities: Array<string> = [];
  requestDelayed: boolean = false;
  requestDelayHandle: any;
  showSearchResultsArea = true;
  isQRReaderOpen = false;

  readonly SEARCH_STATES = {
    DURATION: "duration",
    DURATION_WITH_DATE: "durationWithDate",
    INITIAL: "initial",
    CUSTOMER: "customer",
    REFRESH: "refresh",
    ID: "id",
    QR: "qr"
  };

  sortState = {};

  readonly CREATED_APPOINTMENT_STATE = "CREATED";
  readonly CREATED_APPOINTMENT_STATE_ID = 20;
  readonly ARRIVED_APPOINTMENT_STATE_ID = 30;
  readonly ARRIVED_APPOINTMENT_STATE = "ARRIVED";

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
  timeConvention$: Observable<string> = new Observable<string>();
  timeConvention: string = "24";

  height: string;

  constructor(
    private appointmentDispatchers: AppointmentDispatchers,
    private branchSelectors: BranchSelectors,
    private appointmentSelectors: AppointmentSelectors,
    private servicePointSelectors: ServicePointSelectors,
    private toastService: ToastService,
    private translateService: TranslateService,
    private customerDispatchers: CustomerDispatchers,
    private customerSelectors: CustomerSelector,
    private calendarBranchSelectors: CalendarBranchSelectors,
    private userSelectors: UserSelectors,
    private nativeApi: NativeApiService,
    private nativeApiSelector: NativeApiSelectors,
    private util: Util,
    private nativeApiDispatcher: NativeApiDispatchers,
    private modalService: QmModalService,
    private systemInfoSelectors: SystemInfoSelectors
  ) {
    this.currentSearchState = this.SEARCH_STATES.INITIAL;
    this.userDirection$ = this.userSelectors.userDirection$;
    this.timeConvention$ = this.systemInfoSelectors.timeConvention$;
  }

  ngOnInit() {
    this.initializeSortState();
    const customerSearchLoadedSubscription = this.customerSelectors.customerLoaded$.subscribe(
      value => {
        this.isSearchedCustomerLoaded = value;
      }
    );

    const customerSearchLoadingSubscription = this.customerSelectors.customerLoading$.subscribe(
      value => {
        this.isSearchedCustomerLoading = value;
      }
    );

    this.subscriptions.add(customerSearchLoadedSubscription);
    this.subscriptions.add(customerSearchLoadingSubscription);

    const loadedSubscription = this.appointmentSelectors.appointmentsLoaded$.subscribe(
      load => {
        this.isLoaded = load;
      }
    );
    this.subscriptions.add(loadedSubscription);

    const loadingSubscription = this.appointmentSelectors.appointmentsLoading$.subscribe(
      load => {
        this.isLoading = load;
      }
    );
    this.subscriptions.add(loadingSubscription);

    this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
    this.setDefaultDuration();
    this.fromTimeController = new FormControl("", (control: FormControl) => {
      return this.getTimeSelectionValidity(control.value, this.toTime);
    });

    this.toTimeController = new FormControl("", (control: FormControl) => {
      return this.getTimeSelectionValidity(this.fromTime, control.value);
    });
    this.height = "calc(100vh - 230px)";

    this.inputChanged.subscribe(text => this.searchAppointments());

    this.customerInputChanged
      .pipe(debounceTime(500 || 0))
      .subscribe(text => this.showCustomerAutoComplete());

    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe(
      br => {
        this.selectedBranch = br;
        this.selectedBranchFormatted.selectedBranch = br.name;
      }
    );

    if (this.useCalendarEndpoint) {
      const calendarAppointmentSubscription = this.appointmentSelectors.calendarAppointments$.subscribe(
        apps => {
          this.calendarBranchSelectors.branches$
            .subscribe(bs => {
              this.selectedCalendarBranch = bs.find(
                x => x.qpId == this.selectedBranch.id
              );
              this.handleAppointmentResponse(apps);
            })
            .unsubscribe();
        }
      );

      this.subscriptions.add(calendarAppointmentSubscription);
    } else {
      const appointmentSubscription = this.appointmentSelectors.appointments$.subscribe(
        apps => {
          this.calendarBranchSelectors.branches$
            .subscribe(bs => {
              this.selectedCalendarBranch = bs.find(
                x => x.qpId == this.selectedBranch.id
              );
              this.handleAppointmentResponse(apps);
            }
            )
            .unsubscribe();
        }
      );

      this.subscriptions.add(appointmentSubscription);

      const branchesSubscription = this.branchSelectors.branches$.subscribe(
        branches => {
          this.branchList = branches;
        }
      );
      this.subscriptions.add(branchesSubscription);
    }

    const uttSubscription = this.servicePointSelectors.uttParameters$.subscribe(
      uttParameters => {
        if (uttParameters) {
          this.enableAppointmentLoad = uttParameters.fetchAppointment;
          this.isMultiBranchEnable = uttParameters.mltyBrnch;
        }
      }
    );

    this.subscriptions.add(uttSubscription);

    const appointmentErrorSub = this.appointmentSelectors.appointmentsError$.subscribe(
      (error: any) => {
        if (error && error.status && error.status === 404) {
          this.showAppointmentNotFoundError();
          this.appointmentDispatchers.resetError();
        }
      }
    );

    if (this.useCalendarEndpoint) {
      const customersFromAllDates = this.customerSelectors.customer$.subscribe(
        customers => {
          if (
            !customers ||
            (customers.length === 0 &&
              this.currentSearchState === this.SEARCH_STATES.CUSTOMER)
          ) {
            this.customerNotFound = true;
            this.showSearchResultsArea = false;
          } else {
            this.customerNotFound = false;
          }
          this.searchedCustomers = customers;
        }
      );

      this.subscriptions.add(customersFromAllDates);
    } else {
      const customerSearchSubscription = this.customerSelectors.appointmentSearchCustomers$.subscribe(
        customers => {
          if (
            !customers ||
            (customers.length === 0 &&
              this.currentSearchState === this.SEARCH_STATES.CUSTOMER)
          ) {
            this.customerNotFound = true;
            this.showSearchResultsArea = false;
          } else {
            this.customerNotFound = false;
          }
          this.searchedCustomers = customers;
        }
      );

      this.subscriptions.add(customerSearchSubscription);
    }

    this.subscriptions.add(branchSubscription);
    this.subscriptions.add(appointmentErrorSub);

    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe(
      params => {
        this.readAppointmentFetchTimePeriodFromUtt(params);
        this.searchAppointments();
      }
    );

    this.subscriptions.add(servicePointsSubscription);

    const appointmentsLoadedSub = this.appointmentSelectors.appointmentsLoaded$.subscribe(
      isLoaded => {
        if (
          isLoaded &&
          this.currentSearchState === this.SEARCH_STATES.INITIAL &&
          this.appointments.length === 0
        ) {
          this.translateService
            .get("no_appointments")
            .subscribe((noappointments: string) => {
              this.toastService.infoToast(noappointments);
            })
            .unsubscribe();
        }
      }
    );
    this.subscriptions.add(appointmentsLoadedSub);

    const calendarBranchsSub = this.calendarBranchSelectors.branches$.subscribe(
      bs => {
        this.selectedCalendarBranch = bs.find(
          x => x.qpId == this.selectedBranch.id
        );
      }
    );

    this.subscriptions.add(calendarBranchsSub);

    this.sortColumn = this.useCalendarEndpoint
      ? SortColumns.start
      : SortColumns.startTime;

    const qrCodeSubscription = this.nativeApiSelector.qrCode$.subscribe(
      value => {
        if (value != null) {
          this.qrCodeContent = value;
          this.isQrCodeLoaded = true;
          if (!this.nativeApi.isNativeBrowser()) {
            this.removeDesktopQRReader();
          }
        }
      }
    );
    this.subscriptions.add(qrCodeSubscription);

    const qrCodeScannerSubscription = this.nativeApiSelector.qrCodeScannerState$.subscribe(
      value => {
        if (value === true) {
          this.isQrCodeLoaded = false;
          this.qrCodeContent = null;
          this.isQRReaderOpen = true;
          this.isQRReaderClose = false;
          this.qrCodeListner();
          if (!this.nativeApi.isNativeBrowser()) {
            this.checkDesktopQRReaderValue();
          }
        } else {
          if (!this.nativeApi.isNativeBrowser()) {
            this.removeQRCodeListner();
          }
          this.isQRReaderClose = true;
        }
      }
    );
    this.subscriptions.add(qrCodeScannerSubscription);

    const timeConventionSub = this.timeConvention$.subscribe(tc => {
      this.timeConvention = tc;
    });

    this.subscriptions.add(timeConventionSub);

    const customerSubscription = this.customerSelectors.currentCustomer$.subscribe((customer) => {
      this.currentCustomer = customer;

      if(this.currentCustomer && this.currentSearchState === this.SEARCH_STATES.CUSTOMER){
        this.onCustomerSelect(customer);
      }
    });

    this.subscriptions.add(customerSubscription);
  }

  initializeSortState() {
    for (const key in SortColumns) {
      this.sortState[key] = 0;
    }

    if (this.useCalendarEndpoint) {
      this.sortState[SortColumns.startTimeDate] = -1;
    } else {
      this.sortState[SortColumns.startTime] = -1;
    }
  }

  qrCodeListner() {
    this.qrCodeListnerTimer = setInterval(() => {
      if (this.isQrCodeLoaded) {
        this.nativeApiDispatcher.closeQRCodeScanner();
        this.isQrCodeLoaded = false;
        try {
          this.currentSearchState = this.SEARCH_STATES.QR;
          this.qrCodeContent = JSON.parse(this.qrCodeContent);
          this.qrCodeValue = this.qrCodeContent.appointment_id;
          var branchId = this.qrCodeContent.branch_id;
          var date = this.qrCodeContent.appointment_date;
          var branchName = this.qrCodeContent.branch_name;
          this.searchAppointments();
          console.log("sss");
          
        } catch (err) {
          this.showQRCodeError();
        }
      }
      if (this.isQRReaderOpen && this.isQRReaderClose) {
        this.isQRReaderOpen = false;
        this.isQRReaderClose = false;
        this.clearInput();
        this.removeQRCodeListner();
      }
    }, 1000);
  }

  removeQRCodeListner() {
    if (this.qrCodeListnerTimer) {
      clearInterval(this.qrCodeListnerTimer);
    }
  }

  showQRCodeError() {
    this.clearInput();
    this.translateService
      .get("appointment_not_found_qr")
      .subscribe((noappointments: string) => {
        this.toastService.infoToast(noappointments);
      })
      .unsubscribe();
  }

  showAppointmentNotFoundError() {
    if (this.SEARCH_STATES.QR === this.currentSearchState) {
      this.clearInput();
      if (this.useCalendarEndpoint) {
        this.translateService
          .get("appointment_in_another_branch")
          .subscribe((val: string) => {
            this.toastService.infoToast(
              val + " " + this.qrCodeContent.branch_name
            );
          })
          .unsubscribe();
      } else {
        if (this.qrCodeContent.branch_id !== this.selectedBranch.id) {
          this.translateService
            .get("appointment_in_another_branch")
            .subscribe((val: string) => {
              this.toastService.infoToast(
                val + " " + this.qrCodeContent.branch_name
              );
            })
            .unsubscribe();
        } else {
          var appDate = new Date(this.qrCodeContent.appointment_date).setHours(0, 0, 0, 0);
          var todayDate = new Date().setHours(0, 0, 0, 0);
          if (appDate != todayDate) {
            this.translateService
              .get("appointment_in_another_day")
              .subscribe((val: string) => {
                this.toastService.infoToast(
                  val +
                    " " +
                    this.util.getLocaleDate(this.qrCodeContent.appointment_date)
                );
              })
              .unsubscribe();
          } else {
           this.isShowAppointmentNotFound = true;
          }
        }
      }
    } else {
      this.isShowAppointmentNotFound = true;
    }
  }

  readAppointmentFetchTimePeriodFromUtt(params: any) {
    if (params) {
      this.uttFromTime = moment().subtract(params.gapFromTime, "minutes");
      this.selectedFromTime = this.uttFromTime;
      this.uttToTime = moment().add(params.gapToTime, "minutes");
      this.selectedToTime = this.uttToTime;
    }
  }

  applyAppointmentFilters(appointments: IAppointment[]) {
    if (this.useCalendarEndpoint) {
      return appointments.filter(
        ap => ap.status === this.CREATED_APPOINTMENT_STATE_ID
      );
    } else {
      return appointments.filter(
        ap =>
          ap.status === this.CREATED_APPOINTMENT_STATE &&
          ap.branchId === this.selectedBranch.id
      );
    }
  }

  toggleDurationSelection(isDateHeaderClicked) {
    this.isInDateDurationSelection = !!isDateHeaderClicked;
  }

  handleQRCodeValidation(apps: IAppointment[]) {
    if (this.appointments.length === 1) {
      let appointment = apps[0];
      if (this.useCalendarEndpoint) {
        if (
          appointment.status === APPOINTMENT_STATE_ID.CREATED ||
          appointment.status === APPOINTMENT_STATE_ID.RESCHEDULED
        ) {
          if (
            this.qrCodeContent.branch_id !== this.selectedBranch.id &&
            this.qrCodeContent.branch_name !== this.selectedBranch.name &&
            !this.isMultiBranchEnable
          ) {
            this.clearSelection();
            this.translateService
              .get("appointment_in_another_branch")
              .subscribe((val: string) => {
                this.toastService.infoToast(
                  val + " " + this.qrCodeContent.branch_name
                );
              })
              .unsubscribe();
          } else {
            appointment.startTime = moment(appointment.start)
              .tz(appointment.branch.fullTimeZone)
              .format("YYYY-MM-DDTHH:mm");
            appointment.endTime = moment(appointment.end)
              .tz(appointment.branch.fullTimeZone)
              .format("YYYY-MM-DDTHH:mm");
            appointment.start = moment(appointment.start)
              .tz(appointment.branch.fullTimeZone)
              .format("YYYY-MM-DDTHH:mm");
            appointment.end = moment(appointment.end)
              .tz(appointment.branch.fullTimeZone)
              .format("YYYY-MM-DDTHH:mm");

            this.selectedAppointment = appointment;
            this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
            this.showAppointmentCollection = false;
            this.onAppointmentSelect(this.selectedAppointment);
            this.showModalBackDrop = false;
          }
        } else {
          this.clearSelection();
          this.translateService
            .get("appointment_arrived")
            .subscribe((noappointments: string) => {
              this.toastService.infoToast(noappointments);
            })
            .unsubscribe();
        }
      } else {
        if (appointment.status === APPOINTMENT_STATUS.CREATED) {
          if (appointment.branchId !== this.selectedBranch.id) {
            var branch = this.branchList.filter(val => {
              return val.id === appointment.branchId;
            });
            var branchName = "";
            if (branch.length > 0) {
              branchName = branch[0].name;
            }
            this.clearSelection();
            this.translateService
              .get("appointment_in_another_branch")
              .subscribe((val: string) => {
                this.toastService.infoToast(val + " " + branchName);
              })
              .unsubscribe();
          } else {
            var dateOriginal = appointment.startTime.split("T");
            var date = dateOriginal[0];
            var appDate = new Date(date).setHours(0, 0, 0, 0);
            var todayDate = new Date().setHours(0, 0, 0, 0);
            if (appDate != todayDate) {
              this.clearSelection();
              this.translateService
                .get("appointment_in_another_day")
                .subscribe((val: string) => {
                  this.toastService.infoToast(
                    val + " " + this.util.getLocaleDate(appointment.startTime)
                  );
                })
                .unsubscribe();
            } else {
              this.selectedAppointment = appointment;
              this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
              this.showAppointmentCollection = false;
              this.onAppointmentSelect(this.selectedAppointment);
              this.showModalBackDrop = false;
            }
          }
        } else {
          this.clearSelection();
          this.translateService
            .get("appointment_arrived")
            .subscribe((noappointments: string) => {
              this.toastService.infoToast(noappointments);
            })
            .unsubscribe();
        }
      }
    } else {
      this.clearInput();
      this.translateService
        .get("appointment_not_found_qr")
        .subscribe((noappointments: string) => {
          this.toastService.infoToast(noappointments);
        })
        .unsubscribe();
    }
  }

  clearSelection() {
    this.appointments = [];
    this.onCancel();
  }

  handleAppointmentResponse(apps: IAppointment[]) {

    if(this.requestDelayHandle) {
      clearTimeout(this.requestDelayHandle);
    }
    this.requestDelayed = false;

    if (apps && apps.length > 0) {
      apps = apps.map(a => {
        a.custName = `${a.customers[0] ? a.customers[0].firstName : ""} ${
          a.customers[0] ? a.customers[0].lastName : ""
        }`;
        a.servicesDisplayLabel =
          a.services.length > 1
            ? `${a.services[0].name} +${a.services.length - 1}`
            : a.services[0].name;
        return a;
      });
      this.appointments = this.applyAppointmentFilters(apps);
      this.showSearchResultsArea = true;
    } else {
      this.appointments = [];
    }

    if (this.SEARCH_STATES.QR === this.currentSearchState) {
      this.handleQRCodeValidation(apps);
    }

    // in id search handle id search cases
    else if (this.SEARCH_STATES.ID == this.currentSearchState) {
      if (this.appointments.length === 1) {
        this.selectedAppointment = apps[0];
        this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
        this.showAppointmentCollection = false;
        this.onAppointmentSelect(this.selectedAppointment);
        this.showModalBackDrop = false;
      }

      // search appointment is already arrived? then notifiy user
      if (
        apps.filter(ap => ap.status === this.ARRIVED_APPOINTMENT_STATE).length >
          0 ||
        (this.useCalendarEndpoint &&
          apps.filter(ap => ap.status === this.ARRIVED_APPOINTMENT_STATE_ID)
            .length > 0)
      ) {
        this.translateService
          .get("appointment_arrived")
          .subscribe((noappointments: string) => {
            this.toastService.infoToast(noappointments);
          })
          .unsubscribe();
      }
    } else if (
      this.currentSearchState === this.SEARCH_STATES.INITIAL ||
      this.currentSearchState == this.SEARCH_STATES.REFRESH
    ) {
      this.defaultAppointmentCollection = this.appointments;
    }

    if (!this.appointments || !this.appointments.length) {
      if (this.currentSearchState === this.SEARCH_STATES.CUSTOMER) {
        this.translateService
          .get("no_appointments_for_customer")
          .subscribe((noappointments: string) => {
            this.toastService.infoToast(noappointments);
          })
          .unsubscribe();
      } else if (
        this.currentSearchState === this.SEARCH_STATES.DURATION ||
        this.currentSearchState == this.SEARCH_STATES.REFRESH
      ) {
        this.translateService
          .get("no_appointments")
          .subscribe((noappointments: string) => {
            this.toastService.infoToast(noappointments);
          })
          .unsubscribe();
      } else if (
        this.currentSearchState === this.SEARCH_STATES.ID &&
        this.useCalendarEndpoint &&
        apps.filter(ap => ap.status === this.ARRIVED_APPOINTMENT_STATE_ID)
          .length === 0
      ) {
       this.isShowAppointmentNotFound = true;
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
    this.fromTime = {
      hour: parseInt(currentTime.format("HH")),
      minute: parseInt(currentTime.format("mm")),
      second: 0
    };
    this.toTime = {
      hour: parseInt(currentTime.format("HH")) + 1,
      minute: parseInt(currentTime.format("mm")),
      second: 0
    };
    this.invalidDateSelected = false;
    this.selectedDates = [{ mDate: moment(), selected: true }];
  }

  getTime(timeString, fullTimeZone) {
    if (fullTimeZone) {
      return moment(timeString)
        .tz(fullTimeZone)
        .format("HH:mm");
    } else {
      return moment(timeString).format("HH:mm");
    }
  }

  getDate(timeString, fullTimeZone) {
    if (fullTimeZone) {
      return moment(timeString)
        .tz(fullTimeZone)
        .format("DD/MM/YYYY");
    } else {
      return moment(timeString).format("DD/MM/YYYY");
    }
  }

  getTimeSelectionValidity(fromTime, toTime, isFromTime = true) {
    let validationConfig = null;
    if (fromTime.hour > toTime.hour) {
      validationConfig = { invalidTime: true };
      this.invalidDateSelected = true;
    } else if (
      fromTime.hour == toTime.hour &&
      fromTime.minute >= toTime.minute
    ) {
      validationConfig = { invalidTime: true };
      this.invalidDateSelected = true;
    } else {
      this.invalidDateSelected = false;
    }
    return validationConfig;
  }

  checkDesktopQRReaderValue() {
    var count = 0;
    this.desktopQRCodeListnerTimer = setInterval(() => {
      if (this.searchText && this.searchText.length > 0) {
        count = count + 1;
        try {
          JSON.parse(this.searchText);
          this.nativeApiDispatcher.fetchQRCodeInfo(this.searchText);
          this.searchText = "";
          this.clearInput();
        } catch (err) {
          if (count > 5) {
            this.nativeApiDispatcher.fetchQRCodeInfo(this.searchText);
            this.searchText = "";
            this.clearInput();
          }
        }
      }
    }, 1000);
  }

  removeDesktopQRReader() {
    if (this.desktopQRCodeListnerTimer) {
      clearInterval(this.desktopQRCodeListnerTimer);
    }
  }

  onSearchButtonClick(searchButton) {
    this.showSearchResultsArea = searchButton === this.SEARCH_STATES.INITIAL;
    this.isSearchInputOpen = !this.isSearchInputOpen;
    this.showAppointmentCollection = true;

    if (searchButton == this.SEARCH_STATES.ID) {

      this.searchPlaceHolderKey = "please_enter_id_and_press_enter";
    } else if (searchButton === this.SEARCH_STATES.CUSTOMER) {
      this.searchPlaceHolderKey = "please_enter_customer_attributes";
      this.showSearchResultsArea = false;
    } else if (searchButton === this.SEARCH_STATES.DURATION) {
      this.setDefaultDuration();
      if (this.enableSearchByDay) {
        this.isInDateDurationSelection = true;
      }
    } 
    
    
    else if (searchButton === this.SEARCH_STATES.QR) {
      if (this.nativeApi.isNativeBrowser()) {
        this.nativeApi.openQRScanner();
        
      } else {
        this.isQRReaderOpen=true;
        setTimeout( () => { 
          var searchBox = document.getElementById("idField") as any;
          searchBox.focus();
         }, 100 );      
        this.nativeApiDispatcher.openQRCodeScanner();
      }
    }

    if (
      this.inputAnimationState == searchButton ||
      (this.inputAnimationState == this.SEARCH_STATES.DURATION_WITH_DATE &&
        searchButton == this.SEARCH_STATES.DURATION)
    ) {
      this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
    } else {
      this.inputAnimationState =
        this.enableSearchByDay && searchButton === this.SEARCH_STATES.DURATION
          ? this.SEARCH_STATES.DURATION_WITH_DATE
          : searchButton;
    }

    if (this.selectedSearchIcon != searchButton) {
      this.showModalBackDrop = true;
      this.selectedSearchIcon = searchButton;
      this.currentSearchState = searchButton;
    } else if (
      this.selectedSearchIcon === searchButton &&
      this.searchText.trim()
    ) {
      this.showModalBackDrop = true;
      this.currentSearchState = searchButton;
      this.inputAnimationState = searchButton;
    } else {
      this.showModalBackDrop = false;
      this.selectedSearchIcon = "";
    }

    this.searchText = "";
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
    let formattedTime = `${this.pad(this.fromTime.hour, 2)}:${this.pad(
      this.fromTime.minute,
      2
    )} - ${this.pad(this.toTime.hour, 2)}:${this.pad(this.toTime.minute, 2)}`;
    if (this.enableSearchByDay) {
      formattedTime =
        this.selectedDate.mDate.format("YYYY-MM-DD") + " / " + formattedTime;
    }

    this.searchText = formattedTime;
    this.inputAnimationState = "input";
    this.selectedSearchIcon = "";
    this.searchInputController.setValue(formattedTime);
    this.searchAppointments();
    this.showModalBackDrop = false;
  }

  clearInput() {
    this.searchText = "";
    this.showModalBackDrop = false;
    this.isSearchInputOpen = false;
    this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
    this.selectedSearchIcon = "";
    this.isSearchInputReadOnly = false;
    this.customerNotFound = false;
    this.appointments = this.defaultAppointmentCollection;
    this.showCustomerResults = false;
  }

  searchAppointments() {
    let searchQuery: any = {
      branchId: this.useCalendarEndpoint
        ? this.selectedCalendarBranch.id
        : this.selectedCalendarBranch.qpId,
      useCalendarEndpoint: this.useCalendarEndpoint
    };

    if (this.currentSearchState === this.SEARCH_STATES.DURATION) {
      let now = moment();
      searchQuery = {
        ...searchQuery,
        fromDate: this.getformattedTimeForDurationSearch(true),
        toDate: this.getformattedTimeForDurationSearch(false)
      };
    } else if (
      this.currentSearchState === this.SEARCH_STATES.INITIAL ||
      this.currentSearchState === this.SEARCH_STATES.REFRESH
    ) {
      searchQuery = {
        ...searchQuery,
        fromDate: this.getUttDefaultTimeForSearch(this.uttFromTime),
        toDate: this.getUttDefaultTimeForSearch(this.uttToTime)
      };
    } else if (this.currentSearchState === this.SEARCH_STATES.ID) {
      searchQuery = {
        ...searchQuery,
        id: (this.searchText || "").trim()
      };
    } else if (this.currentSearchState === this.SEARCH_STATES.QR) {
      searchQuery = {
        ...searchQuery,
        id: (this.qrCodeValue || "").trim()
      };
    }

    if(this.requestDelayHandle) {
      clearTimeout(this.requestDelayHandle);
    }
    this.requestDelayed = false;
    this.requestDelayHandle = setTimeout(()=> {
      this.requestDelayed = true;
    }, 3000);

    if (this.useCalendarEndpoint) {
      this.appointmentDispatchers.searchCalendarAppointments(searchQuery);
    } else {
      this.appointmentDispatchers.searchAppointments(searchQuery);
    }
  }

  getUttDefaultTimeForSearch(uttTime: Moment) {
    let formattedDate = `${uttTime.format("YYYY-MM-DD")}T${uttTime.format(
      "HH"
    )}:${uttTime.format("mm")}`;

    // adjust the time zone for calendar endpoint
    if (this.useCalendarEndpoint) {
      formattedDate = moment(formattedDate)
        .tz(this.selectedCalendarBranch.fullTimeZone)
        .utc()
        .format("YYYY-MM-DD HH:mm")
        .replace(" ", "T");
    }

    return formattedDate;
  }

  getformattedTimeForDurationSearch(isFromTime: boolean) {
    let formattedDate: string;
    if (this.enableSearchByDay) {
      if (isFromTime) {
        formattedDate = `${this.selectedDate.mDate.format(
          "YYYY-MM-DD"
        )}T${this.pad(this.fromTime.hour, 2)}:${this.pad(
          this.fromTime.minute,
          2
        )}`;
      } else {
        formattedDate = `${this.selectedDate.mDate.format(
          "YYYY-MM-DD"
        )}T${this.pad(this.toTime.hour, 2)}:${this.pad(this.toTime.minute, 2)}`;
      }
    } else {
      let now = moment();
      if (isFromTime) {
        formattedDate = `${now.format("YYYY-MM-DD")}T${this.pad(
          this.fromTime.hour,
          2
        )}:${this.pad(this.fromTime.minute, 2)}`;
      } else {
        formattedDate = `${now.format("YYYY-MM-DD")}T${this.pad(
          this.toTime.hour,
          2
        )}:${this.pad(this.toTime.minute, 2)}`;
      }
    }
    // adjust the time zone for calendar endpoint
    if (this.useCalendarEndpoint) {
      formattedDate = moment(formattedDate)
        .tz(this.selectedCalendarBranch.fullTimeZone)
        .utc()
        .format("YYYY-MM-DD, HH:mm")
        .replace(", ", "T");
    }

    return formattedDate;
  }

  onSelectDate(selectedDate: CalendarDate) {
    this.selectedDate = selectedDate;
  }

  onEnterPressed() {
    if (
      this.currentSearchState !== this.SEARCH_STATES.CUSTOMER ||
      this.currentSearchState !== this.SEARCH_STATES.QR
    ) {
      let trimmedSearchText = (this.searchText || "").trim();
      if (trimmedSearchText) {
        if (this.currentSearchState === this.SEARCH_STATES.ID) {
          trimmedSearchText = trimmedSearchText.replace(/[^0-9]/g, "");          
        } 
        this.searchText = trimmedSearchText;
        this.inputChanged.next(trimmedSearchText);
        
      } else if (this.currentSearchState === this.SEARCH_STATES.ID) {
        this.translateService
          .get("please_enter_id_and_press_enter")
          .subscribe(msg => {
            this.toastService.infoToast(msg);
          })
          .unsubscribe();
      }
    }
  }

  onSeachTextChanged() {
    if (this.currentSearchState === this.SEARCH_STATES.CUSTOMER) {
      this.customerNotFound = false;
      if ((this.searchText || "").trim().length >= 2) {
        this.customerInputChanged.next();
      }
    }
  }

  showCustomerAutoComplete() {
    this.showCustomerResults = true;
    if (this.useCalendarEndpoint) {
      this.customerDispatchers.fetchCustomers((this.searchText || "").trim());
    } else {
      this.customerDispatchers.fetchAppointmentCustomers(
        (this.searchText || "").trim()
      );
    }
  }
  onSearchInputChange() {
    this.inputChanged.next(this.searchText);
  }

  pad(n, width, z = "0") {
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  onAppointmentSelect(appointment: IAppointment) {
    //this.arriveAppointmentDispatchers.selectAppointment(appointment);
    this.selectedAppointment = appointment;
    this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
    this.selectedSearchIcon = "";
    this.onFlowNext.emit();
    this.appointmentSelected.emit(appointment);
    this.selectedCustomer = appointment.customers[0];
  }

  getSelectedAppointmentInfo() {
    let appointmentInfo = "";

    if (this.selectedAppointment) {
      let timeformat = "hh:mm A   DD/MM/YYYY";
      if (this.timeConvention === "24") {
        timeformat = "HH:mm   DD/MM/YYYY";
      }

      //time data 
      if (this.useCalendarEndpoint) {
        appointmentInfo += moment(this.selectedAppointment.start)
          .tz(
            this.selectedAppointment.branch.fullTimeZone ||
              this.selectedCalendarBranch.fullTimeZone
          )
          .format(timeformat);
      } else {
        appointmentInfo += moment(this.selectedAppointment.startTime)
          .format(timeformat);
      }

      appointmentInfo += `${this.selectedAppointment.customers[0].firstName} `;
      appointmentInfo += `${this.selectedAppointment.customers[0].lastName}`;
    }
    return appointmentInfo;
  }

  getSelectedAppointmentInfoTime() {
    let appointmentInfo = "";
    let timeformat = "hh:mm A";
    if (this.timeConvention === "24") {
      timeformat = "HH:mm";
    }

    if(this.selectedAppointment) {
      //time data 
      if (this.useCalendarEndpoint) {
        appointmentInfo += moment(this.selectedAppointment.start)
          .tz(
            this.selectedAppointment.branch.fullTimeZone ||
              this.selectedCalendarBranch.fullTimeZone
          )
          .format(timeformat);
      } else {
        appointmentInfo += moment(this.selectedAppointment.startTime)
          .format(timeformat);
      }

    }

    return appointmentInfo;
  }

  getSelectedAppointmentInfoDate() {
    let appointmentInfo = "";

    if(this.selectedAppointment) {
      //time data 
      if (this.useCalendarEndpoint) {
        appointmentInfo += moment(this.selectedAppointment.start)
          .tz(
            this.selectedAppointment.branch.fullTimeZone ||
              this.selectedCalendarBranch.fullTimeZone
          )
          .format('DD/MM/YYYY');
      } else {
        appointmentInfo += moment(this.selectedAppointment.startTime)
          .format('DD/MM/YYYY');
      }

    }

    return appointmentInfo;
  }

  
  getSelectedAppointmentInfoCustomer() {
    let appointmentInfo = "";

    if (this.selectedAppointment && this.selectedAppointment.customers[0]) {

      appointmentInfo += `${this.selectedAppointment.customers[0].firstName} `;
      appointmentInfo += `${this.selectedAppointment.customers[0].lastName} - `;
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
    if (this.useCalendarEndpoint) {
      this.appointmentDispatchers.searchCalendarAppointments({
        customerId: customer.id
      });
    } else {
      this.appointmentDispatchers.searchAppointments({
        customerId: customer.id
      });
    }
  }

  refreshAppointments() {
    if (this.isFetchBlock === false) {
      this.selectedSearchIcon = "";
      this.inputAnimationState = this.INITIAL_ANIMATION_STATE;
      const servicePointsSubscription = this.servicePointSelectors.uttParameters$
        .subscribe(params => {
          this.readAppointmentFetchTimePeriodFromUtt(params);

          this.currentSearchState = this.SEARCH_STATES.REFRESH;
          this.searchAppointments();
          setTimeout(() => {
            //<<<---    using ()=> syntax
            this.isFetchBlock = false;
          }, 30000);

          this.isFetchBlock = true;
        })
        .unsubscribe();
    }
  }

  doneButtonClick() {
    this.onFlowNext.emit();
  }

  onCancel() {
    this.inputAnimationState = "";
    this.selectedSearchIcon = "";
    this.showModalBackDrop = false;
  }

  showLoading() {
    return   !this.isLoaded && this.isLoading;
  }

  showLoadingCustomers() {
    return !this.isSearchedCustomerLoaded && this.isSearchedCustomerLoading;
  }

  getSortIcons(sortColumn) {
    let sortConfig = {
      "icon-caret-down": this.sortState[sortColumn] < 0,
      "icon-caret-up": this.sortState[sortColumn] > 0
    };

    return sortConfig;
  }

  showTimeFilter() {
    this.translateService
      .get(["heading.timefilter", "subheading.timefilter"])
      .subscribe(messages => {
        console.log(messages);
        this.modalService
          .openTimeFilter(
            messages["heading.timefilter"],
            messages["subheading.timefilter"],
            false
          )
          .result.then((tfs: { start: moment.Moment; end: moment.Moment }) => {
            if (tfs && tfs.start && tfs.end) {
              this.fromTime = {
                hour: tfs.start.hour(),
                minute: 0,
                second: 0
              };

              this.toTime = {
                hour: tfs.end.hour(),
                minute: 0,
                second: 0
              };

              this.selectedFromTime = tfs.start;
              this.selectedToTime = tfs.end;
              this.currentSearchState = this.SEARCH_STATES.DURATION;
              this.searchAppointments();
            }
          });
      });
  }

  getSelectedAppointmentDetails(): string {
    return "";
  }

  restrictNumbers($event) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode($event.keyCode);
    if(this.isShowAppointmentNotFound) {
      this.isShowAppointmentNotFound = false;
    }
    console.log($event);
    if($event.keyCode === 13 && this.searchText) {
      this.searchText = $event.target.value.replace(/[^0-9]/g, "");
      this.onEnterPressed();
    }

    if (!pattern.test(inputChar)) {
      $event.target.value = $event.target.value.replace(/[^0-9]/g, "");
      this.searchText = $event.target.value;
    }
  }

  sortAppointments(sortColumn: string) {
    this.sortState[sortColumn] =
      this.sortState[sortColumn] === 0 ? -1 : this.sortState[sortColumn] * -1;

    var index = this.sortColumnPriorities.indexOf(sortColumn);
    if (index > -1) {
      this.sortColumnPriorities.splice(index, 1);
    }

    this.sortColumnPriorities.unshift(sortColumn);
    //old code TBR

    if (!this.useCalendarEndpoint && sortColumn === SortColumns.startTimeDate) {
      return;
    }

    if (this.sortColumn === sortColumn) {
      this.isDescending = !this.isDescending;
    } else {
      this.isDescending = false;
    }
    this.sortColumn = sortColumn;
  }
  foucusInput(){
    var searchBox = document.getElementById("idField") as any;
    searchBox.focus();
  }
  
  onSearchChange(searchValue : string ) {  
    this.qrCodeValue =  searchValue ;
  }

  // close qr view
  closeqr(){
    this.qrCodeValue='';
    this.isQRReaderOpen=false;
    this.removeQRCodeListner();
  }
}
