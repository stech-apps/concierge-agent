import { AppointmentSelectors, UserSelectors } from 'src/store/services';
import { IService } from './../../../../models/IService';
import { Subscription, Observable, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BranchSelectors, ServicePointSelectors, DataServiceError, NativeApiSelectors, NativeApiDispatchers, AppointmentDispatchers, SystemInfoSelectors } from '../../../../../src/store';
import { IBranch } from '../../../../models/IBranch';
import { ISystemInfo } from '../../../../models/ISystemInfo';
import { SPService } from 'src/util/services/rest/sp.service';
import { IServicePoint } from '../../../../models/IServicePoint';
import { IAppointment } from '../../../../models/IAppointment';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/util/services/toast.service';
import { IServiceConfiguration } from '../../../../models/IServiceConfiguration';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DEBOUNCE_TIME } from './../../../../constants/config';
import { NOTIFICATION_TYPE } from 'src/util/services/rest/calendar.service';
import { QmCheckoutViewConfirmModalService } from '../qm-checkout-view-confirm-modal/qm-checkout-view-confirm-modal.service';
import { QueueService } from '../../../../util/services/queue.service';
import { GlobalErrorHandler } from 'src/util/services/global-error-handler.service';
import { ERROR_STATUS, Q_ERROR_CODE } from 'src/util/q-error';
import { QmModalService } from '../qm-modal/qm-modal.service';
import { NativeApiService } from '../../../../util/services/native-api.service';
import { Util } from "../../../../util/util";
import * as moment from "moment";
import { DEFAULT_LOCALE } from "src/constants/config";
import {
  APPOINTMENT_STATE_ID,
  APPOINTMENT_STATUS
} from "../../../../util/q-state";
import { ICustomer } from 'src/models/ICustomer';
import { VIP_LEVEL } from 'src/util/flow-state';

@Component({
  selector: 'qm-quick-arrive',
  templateUrl: './qm-quick-arrive.component.html',
  styleUrls: ['./qm-quick-arrive.component.scss']
})
export class QmQuickArriveComponent implements OnInit, OnDestroy {

  readonly CREATED_APPOINTMENT_STATE = "CREATED";
  readonly CREATED_APPOINTMENT_STATE_ID = 20;
  readonly ARRIVED_APPOINTMENT_STATE_ID = 30;
  readonly ARRIVED_APPOINTMENT_STATE = "ARRIVED";


  private subscriptions: Subscription = new Subscription();
  services: IService[] = new Array<IService>();
  selectedService: IService;
  private selectedBranch: IBranch;
  private selectedServicePoint: IServicePoint;
  selectedAppointment: IAppointment;
  selectedCustomer: ICustomer;
  userDirection$: Observable<string>;
  searchText: string;
  filterText = '';
  inputChanged: Subject<string> = new Subject<string>();
  showToolTip: boolean;
  hoveredService = '';
  public qrRelatedData: any;
  loading: boolean = false;
  isQRSelected = false;

  isQuickArriveEnable: boolean;
  focusQuickArriveItem: string;
  isTicketlessAvailable = false;
  isSMSAvailable = false;
  isTicketAvailable = false;
  themeColor = '#a9023a';
  desktopQRCodeListnerTimer: any;
  branchList: IBranch[];

  // Qr code related variables
  isQRReaderOpen = false;
  qrButtonVisible = false;
  isQRReaderClose = false;
  qrCodeListnerTimer: any;
  isQrCodeLoaded = false;
  qrCodeValue: string;
  qrCodeContent: any;
  systemInformation:ISystemInfo;
  timeConvention: string = "24";
  timeFormat: string = 'HH:mm';
  userLocale: string = DEFAULT_LOCALE;

  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private appointmentSelectors: AppointmentSelectors,
    private branchSelectors: BranchSelectors,
    private spService: SPService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private userSelectors: UserSelectors,
    private qmCheckoutViewConfirmModalService: QmCheckoutViewConfirmModalService,
    public nativeApi: NativeApiService,
    private nativeApiSelector: NativeApiSelectors,
    private nativeApiDispatcher: NativeApiDispatchers,
    private util: Util,
    private appointmentDispatchers: AppointmentDispatchers,
    private systemInfoSelectors: SystemInfoSelectors,
    private errorHandler: GlobalErrorHandler
  ) {
    this.showToolTip = false;
    this.userDirection$ = this.userSelectors.userDirection$;

    const timeConventionSub = this.systemInfoSelectors.timeConvention$.subscribe((tc) => {
      if(tc === 'AMPM') {
        this.timeFormat = 'hh:mm A';
      }
      else {
        this.timeFormat = 'HH:mm';
      }
    });

    const servicePointSubscription = this.servicePointSelectors.openServicePoint$.subscribe((servicePoint) =>
    this.selectedServicePoint = servicePoint);
    this.subscriptions.add(servicePointSubscription);

    const systemInfoSubscription = this.systemInfoSelectors.systemInfo$.subscribe(systemInfo=>{
      this.systemInformation = systemInfo;
    });
    this.subscriptions.add(systemInfoSubscription);

    const userLocaleSubscription = this.userSelectors.userLocale$.subscribe(ul=> this.userLocale = ul);
    this.subscriptions.add(userLocaleSubscription);

    const branchesSubscription = this.branchSelectors.branches$.subscribe(
      branches => {
        this.branchList = branches;
      }
    );
    this.subscriptions.add(branchesSubscription);

    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe(
      params => {
        if (params) {
          this.isTicketAvailable = params.printerEnable;
          this.isSMSAvailable = params.sndSMS;
          this.isTicketlessAvailable = params.ticketLess;
          if (params.quickVisitAction) {
            if (params.quickVisitAction === 'arrive') {
              this.isQuickArriveEnable = true;
            } else {
              this.isQuickArriveEnable = false;
            }
          }
        }
      }
    );
    this.subscriptions.add(servicePointsSubscription);

    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((branch) => this.selectedBranch = branch);
    this.subscriptions.add(branchSubscription);

    const appointmentSubscription = this.appointmentSelectors.appointments$.subscribe(
      apps => {
        if (this.isQRSelected){
          this.handleAppointmentResponse(apps);
        }
      }
    );
    this.subscriptions.add(appointmentSubscription);

    const appointmentErrorSub = this.appointmentSelectors.appointmentsError$.subscribe(
      (error: any) => {
        if (error && error.status && error.status === 404) {
          this.showQRCodeError();
          this.appointmentDispatchers.resetError();
        }
      }
    );
    this.subscriptions.add(appointmentErrorSub);

      // QR code subscription - value comming from native or desktop qr reader 
      const qrCodeSubscription = this.nativeApiSelector.qrCode$.subscribe(
        value => {
          if (value != null && this.isQRSelected) {
            // if  qr value not null
            this.qrCodeContent = value;
            this.isQrCodeLoaded = true;
            if (!this.nativeApi.isNativeBrowser()) {
              // not native-> remove the checking loop || native will auto remove the qr modal
              this.removeDesktopQRReader();
            }
          }
        }
      );
      this.subscriptions.add(qrCodeSubscription);
  
      // Qr Code Scanner modal subscription ** this is to show the qr modal -( value is a boolean value)
      const qrCodeScannerSubscription = this.nativeApiSelector.qrCodeScannerState$.subscribe(
        value => {
          // if the scanner value is true show the qr modal otherwise remove the qr modal
          if (value === true && this.isQRSelected) {
            this.isQrCodeLoaded = false;
            this.qrCodeContent = null;
            this.isQRReaderOpen = true;
            this.isQRReaderClose = false;
            this.qrCodeListner();
            if (!this.nativeApi.isNativeBrowser()) {
              this.checkDesktopQRReaderValue();
            }
          } else {
            // removing qr modal
  
            // if desktop browser
            if (!this.nativeApi.isNativeBrowser()) {
              setTimeout(() => {
                this.removeQRCodeListner();
              }, 1000);
            }
            this.isQRReaderClose = true;
          }
        }
      );
      this.subscriptions.add(qrCodeScannerSubscription);
  }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  qrCodeListner() {    
    this.qrCodeListnerTimer = setInterval(() => {
      if (this.isQrCodeLoaded) {
        this.nativeApiDispatcher.closeQRCodeScanner();
        this.isQrCodeLoaded = false;
        try {
          this.qrCodeContent = JSON.parse(this.qrCodeContent);
          if (this.qrCodeContent.appointment_id) {
            this.qrCodeValue = this.qrCodeContent.appointment_id;
            var branchId = this.qrCodeContent.branch_id;
            var date = this.qrCodeContent.appointment_date;
            var branchName = this.qrCodeContent.branch_name;
            this.searchAppointment(this.qrCodeValue);
          } else {
            if (isNaN(this.qrCodeContent)) {
              this.showQRCodeError();
            } else {
              this.qrCodeValue = this.util.qWebBookIdConverter(this.qrCodeContent.toString());
              if (!(this.qrCodeValue)) {
                this.showQRCodeError();
              }
            }
          }
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

  searchAppointment(appointmentId) {
    let searchQuery: any = {
      branchId: this.selectedBranch.id,
      useCalendarEndpoint: false,
      id: (appointmentId || "").trim()
    };
    this.appointmentDispatchers.searchAppointments(searchQuery);
  }

  removeQRCodeListner() {
    if (this.qrCodeListnerTimer) {
      clearInterval(this.qrCodeListnerTimer);
    }
  }

  showQRCodeError() {
    this.clearInput();
    this.translateService
      .get("label.appointment_not_found_qr")
      .subscribe((noappointments: string) => {
        this.toastService.errorToast(noappointments);
      })
      .unsubscribe();
      this.closeAppointment();
  }

  onSelectButton(type: string) {
    if (type === 'sms') {
      if (this.selectedCustomer && this.selectedCustomer.properties.phoneNumber) {
        this.setAriveAppointment(NOTIFICATION_TYPE.sms, false, null);
      } else {
        this.qmCheckoutViewConfirmModalService.openForTransKeys('msg_send_confirmation',
          false,
          this.isSMSAvailable,
          this.themeColor, 'ok', 'label.cancel',
          (result: any) => {
            if (result) {
              if (result.phone) {
                this.setAriveAppointment(NOTIFICATION_TYPE.sms, false, result.phone);
              }
            }
          },
          () => { }, null);
      }
    } else {
      this.setAriveAppointment(NOTIFICATION_TYPE.none, type === 'ticket' ? true : false, null);
    }
  }

  
  showHideToolTip() {
    this.showToolTip = !this.showToolTip;
  }

  handleInputArriveQR($event) {
    this.searchText = $event.target.value
  }


  qrButtonClick(){
    //this.searchAppointment('175');
    this.isQRSelected = true;
    this.isQRReaderOpen = true;
    //this.queueDispatchers.resetError();
    if (this.nativeApi.isNativeBrowser()) {
      this.nativeApi.openQRScanner();
    }
    else {
      this.nativeApiDispatcher.openQRCodeScanner();
      setTimeout(() => {
      var searchBox = document.getElementById("ArriveSearchField") as any;
      this.translateService.get('qr_code_scanner').subscribe(v => {
        searchBox.placeholder = v
      });
      searchBox.focus();
      }, 100);
    
    }
  }

  // loop when the qr scanner is turned on on desktop browsers
  checkDesktopQRReaderValue() {
    var count = 0;
    this.desktopQRCodeListnerTimer = setInterval(() => {
      if (this.searchText && this.searchText.length > 0) {
        count = count + 1;
        try {
          // get info related to the QR code 
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

  // remove the loop for desktop scanner
  removeDesktopQRReader() {
    if (this.desktopQRCodeListnerTimer) {
      clearInterval(this.desktopQRCodeListnerTimer);
    }
  }

  closeqr(){
    this.isQRReaderOpen = false; 
    this.searchText = '';
    this.nativeApiDispatcher.closeQRCodeScanner();
    this.removeQRCodeListner();
    
  }

  clearInput(){
    // this.queueDispatchers.resetFetchVisitError();
    this.searchText = null;
    // this.isInvalidVisitEntry = false;
    // this.queueDispatchers.setectVisit(null);
    // this.queueDispatchers.resetSelectedQueue();
  }
  foucusInput(){
    var searchBox = document.getElementById("ArriveSearchField") as any;
    searchBox.focus();
  }

  getDateTime(dateString) {
    return moment(dateString).format(this.systemInformation.dateConvention +
       ', '  + (this.systemInformation.timeConvention.indexOf('24') !== -1 ? 'HH:mm' : 'hh:mm A'));
  }

  getEndTime() {
    return moment(this.selectedAppointment.endTime).format(this.timeFormat);
  }

  getStartTime() {
    return moment(this.selectedAppointment.startTime).format(this.timeFormat);
  }

setQRRelatedData(qrData: any) {
    this.qrRelatedData = qrData;
}

handleAppointmentResponse(apps: IAppointment[]) {
  if (apps && apps.length > 0) {
    var appointment = apps[0];
    appointment.custName = '';
      if (appointment.customers[0]) {
        appointment.custName = `${appointment.customers[0] ? appointment.customers[0].firstName : ""} ${
          appointment.customers[0] ? appointment.customers[0].lastName : ""
          }`;
      }

      appointment.servicesDisplayLabel = '';

      if (appointment.services && appointment.services.length > 0) {
        appointment.servicesDisplayLabel =
        appointment.services.length > 1
            ? `${appointment.services[0].name} +${appointment.services.length - 1}`
            : appointment.services[0].name;
      }

      appointment.branchDisplayLabel = '';

  this.handleQRCodeValidation(appointment);
  } else {
    this.closeAppointment();
  }
}

getAppServices(): string {
  let services = this.selectedAppointment.services.map(service => {
    return service.name ? service.name : service.internalName;
  }).join(", ");
  return services;
}

closeAppointment() {
  this.selectedAppointment = null;
  this.isQRSelected = false;
}

setAriveAppointment(notificationType: NOTIFICATION_TYPE, isTicketPrint: boolean, phoneNo: string) {
  this.loading = true;
  let smsNo = NOTIFICATION_TYPE.sms ? (phoneNo ? phoneNo : this.selectedCustomer.properties.phoneNumber) : null;
  this.spService.arriveAppointment(this.selectedBranch, this.selectedServicePoint, this.selectedAppointment.services, null, VIP_LEVEL.NONE, smsNo, isTicketPrint, notificationType, this.selectedAppointment).subscribe((result: any) => {
    this.loading = false;
    this.translateService.get('label.arrive.success.visit', { visitId : result.ticketId })
        .subscribe(msg => this.toastService.successToast(msg)).unsubscribe();
        this.closeAppointment();
  }, error => {
    const err = new DataServiceError(error, null);
    if (err.errorCode === '0') {
      //this.handleTimeoutError(err, 'arrive_appointment_fail')
    } else {
      this.loading = false;
      this.showErrorMessage(error);
    }
    this.closeAppointment();
  })
}

handleTimeoutError(err: DataServiceError<any>, msg: string) {
  if (err.errorCode === '0') {
    this.translateService.get(msg).subscribe(v => {
      var unSuccessMessage = {
        firstLineName: v,
        icon: "error"
      }
      //this.infoMsgBoxDispatcher.updateInfoMsgBoxInfo(unSuccessMessage);
    });
  }
}

showErrorMessage(error: any) {
  const err = new DataServiceError(error, null);
  let errorKey = 'request_fail';

  if (error.status === ERROR_STATUS.INTERNAL_ERROR || error.status === ERROR_STATUS.CONFLICT) {
    if (err.errorCode === Q_ERROR_CODE.APPOINTMENT_USED_VISIT) {
      errorKey = 'appointment_already_used';
    } else if (err.errorCode === Q_ERROR_CODE.PRINTER_ERROR || err.errorCode === Q_ERROR_CODE.HUB_PRINTER_ERROR) {
      errorKey = 'printer_error';
    } else if (err.errorCode === Q_ERROR_CODE.QUEUE_FULL) {
      errorKey = 'queue_full';
    } else if (err.errorCode === Q_ERROR_CODE.SERVICE_DELETE) {
      errorKey = '';
    }
     else {
      errorKey = 'request_fail';
    }
  } else if (error.status === ERROR_STATUS.NOT_FOUND) {
    errorKey = 'appointment_not_found_detail';
  } else if (err.errorCode === Q_ERROR_CODE.PRINTER_PAPER_JAM) {
    errorKey = 'paper_jam';
  } else if (err.errorCode === Q_ERROR_CODE.PRINTER_PAPER_OUT) {
    errorKey = 'out_of_paper';
  } else {
    errorKey = 'visit_timeout';
  }

  // if (err.errorCode === Q_ERROR_CODE.PRINTER_PAPER_JAM || err.errorCode === Q_ERROR_CODE.PRINTER_PAPER_OUT) {
    //   this.translateService.get('arrive_appointment_fail').subscribe(v => {
    //     let successMessage = {
    //       firstLineName: v,
    //       icon: "error"
    //     };

    //     this.infoMsgBoxDispatcher.updateInfoMsgBoxInfo(successMessage);
    //   });
    // }
  this.errorHandler.showError(errorKey, err);
}

handleQRCodeValidation(appointment: IAppointment) {
  if (appointment) {
    if (appointment.status === APPOINTMENT_STATUS.CREATED) {
      if (appointment.branchId !== this.selectedBranch.id) {
        var branch = this.branchList.filter(val => {
          return val.id === appointment.branchId;
        });
        var branchName = "";
        if (branch.length > 0) {
          branchName = branch[0].name;
        }
        
        this.translateService.get('label.appointment_in_another_branch', { appointmentBranch : appointment.branch.name})
        .subscribe(msg => this.toastService.errorToast(msg)).unsubscribe();
        this.closeAppointment();
      } else {
        var dateOriginal = appointment.startTime.split("T");
        var appDate = dateOriginal[0];
        var todayDate = moment().format('YYYY-MM-DD');
        if (appDate != todayDate) {
          
          this.translateService
            .get("appointment_in_another_day")
            .subscribe((val: string) => {
              this.toastService.infoToast(
                val + " " + this.getDateTime(appointment.startTime)
              );
            })
            .unsubscribe();
          this.closeAppointment();
        } else {
          this.selectedAppointment = appointment;
          this.selectedCustomer = this.selectedAppointment.customers[0];
          this.isQRSelected = false;
        }
      }
    } else {
      this.translateService
        .get("appointment_arrived")
        .subscribe((noappointments: string) => {
          this.toastService.infoToast(noappointments);
        })
        .unsubscribe();
      this.closeAppointment();
    }
  } else {
    this.clearInput();
    this.translateService
      .get("label.appointment_not_found_qr")
      .subscribe((noappointments: string) => {
        this.toastService.errorToast(noappointments);
      })
      .unsubscribe();
    this.closeAppointment();
  }    
}
}
