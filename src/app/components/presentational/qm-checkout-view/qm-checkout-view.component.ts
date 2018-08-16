import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import {
  CREATE_VISIT,
  CREATE_APPOINTMENT,
  ARRIVE_APPOINTMENT
} from "./../../../../constants/utt-parameters";
import { ServicePointSelectors, CustomerSelector, ReserveSelectors, DataServiceError, TimeslotSelectors, BranchSelectors, ServiceSelectors, InfoMsgDispatchers, CustomerDispatchers } from "../../../../store";
import { IUTTParameter } from "../../../../models/IUTTParameter";
import { QmCheckoutViewConfirmModalService } from "../qm-checkout-view-confirm-modal/qm-checkout-view-confirm-modal.service";
import { FLOW_TYPE, VIP_LEVEL } from "../../../../util/flow-state";
import { CalendarService } from "../../../../util/services/rest/calendar.service";
import { IAppointment } from "../../../../models/IAppointment";
import { ICustomer } from "../../../../models/ICustomer";
import { Q_ERROR_CODE } from "../../../../util/q-error";
import { ToastService } from '../../../../util/services/toast.service';
import { SPService } from "../../../../util/services/rest/sp.service";
import { IBranch } from "../../../../models/IBranch";
import { IServicePoint } from "../../../../models/IServicePoint";
import { IService } from "../../../../models/IService";
import { NoteSelectors, NoteDispatchers } from "../../../../store";
import { FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';

import { QmNotesModalService } from "../qm-notes-modal/qm-notes-modal.service";
import { QmModalService } from "../qm-modal/qm-modal.service";
import * as moment from 'moment';
import { forEach } from "@angular/router/src/utils/collection";
import { LocalStorage, STORAGE_SUB_KEY } from "../../../../util/local-storage";


@Component({
  selector: "qm-checkout-view",
  templateUrl: "./qm-checkout-view.component.html",
  styleUrls: ["./qm-checkout-view.component.scss"]
})

export class QmCheckoutViewComponent implements OnInit, OnDestroy {
  @Input() flowType: FLOW_TYPE;

  @Output()
  onFlowExit: EventEmitter<any> = new EventEmitter<any>();

  customerEmail: string;
  customerSms: string;

  private subscriptions: Subscription = new Subscription();

  ticketActionEnabled: boolean = false;
  smsActionEnabled: boolean = false;
  emailActionEnabled: boolean = false;
  ticketlessActionEnabled: boolean = false;
  isNoteEnabled: boolean = false;
  isVipLvl1Enabled:boolean = false;
  isVipLvl2Enabled:boolean = false;
  isVipLvl3Enabled:boolean = false;

  buttonEnabled = false;

  ticketSelected: boolean = false;
  smsSelected: boolean = false;
  emailSelected: boolean = false;
  ticketlessSelected: boolean = false;

  isCreateVisit: boolean = false;
  isCreateAppointment: boolean = false;
  isArriveAppointment: boolean = false;


  uttParameters$: Observable<IUTTParameter>;
  themeColor: string = "#a9023a";
  whiteColor: string = "#ffffff";
  blackColor: string = "#000000";
  ticketColor: string = this.whiteColor;
  smsColor: string = this.whiteColor;
  emailColor: string = this.whiteColor;
  ticketlessColor: string = this.whiteColor;

  buttonText: string;

  noteText$: Observable<string>;
  noteTextStr: string = '';

  private selectedAppointment: IAppointment;
  private selectedCustomer: ICustomer;
  private selectedBranch: IBranch;
  private selectedServicePoint: IServicePoint;
  private selectedServices: IService[];
  private tempCustomer: ICustomer;

  radioForm: FormGroup;
  vipLevel1Checked:boolean ;
  vipLevel2Checked:boolean;
  vipLevel3Checked:boolean ;

  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private customerSelector: CustomerSelector,
    private qmCheckoutViewConfirmModalService: QmCheckoutViewConfirmModalService,
    private calendarService: CalendarService,
    private reserveSelectors: ReserveSelectors,
    private translateService: TranslateService,
    private toastService: ToastService,
    private timeSlotSelectors: TimeslotSelectors,
    private spService: SPService,
    private branchSelector: BranchSelectors,
    private serviceSelectors: ServiceSelectors,
    private qmNotesModalService: QmNotesModalService, private noteSelectors: NoteSelectors, private noteDispatchers: NoteDispatchers, private qmModalService: QmModalService,
    private infoMsgBoxDispatcher: InfoMsgDispatchers,
    private customerDispatcher: CustomerDispatchers,
    private localStorage: LocalStorage
  ) {
    this.uttParameters$ = this.servicePointSelectors.uttParameters$;

    this.uttParameters$ = servicePointSelectors.uttParameters$;
    const uttSubscription = this.uttParameters$
      .subscribe(uttParameters => {
        if (uttParameters) {
          this.themeColor = uttParameters.highlightColor;
          this.isNoteEnabled = uttParameters.mdNotes;
          this.isVipLvl1Enabled = uttParameters.vipLvl1;
          this.isVipLvl2Enabled = uttParameters.vipLvl2;
          this.isVipLvl3Enabled = uttParameters.vipLvl3;
          this.smsActionEnabled = uttParameters.sndSMS;
          this.emailActionEnabled = uttParameters.sndEmail;
          this.ticketActionEnabled = uttParameters.printerEnable;
          this.ticketlessActionEnabled = uttParameters.ticketLess;

          if (this.themeColor === "customized") {
            this.themeColor = uttParameters.customizeHighlightColor;
          }
        }
      })
      .unsubscribe();
    this.subscriptions.add(uttSubscription);


    const customerSubscription = this.customerSelector.currentCustomer$
      .subscribe(customer => {
        if (customer) {
          this.selectedCustomer = customer;
          this.customerEmail = customer.properties.email;
          this.customerSms = customer.properties.phoneNumber;

        }
      });
    this.subscriptions.add(customerSubscription);

    const appointmentSubscription = this.reserveSelectors.reservedAppointment$.subscribe((appointment) => this.selectedAppointment = appointment);
    this.subscriptions.add(appointmentSubscription);

    const tempCustomerSubscription = this.customerSelector.tempCustomer$.subscribe((customer) => {
      if(customer){
        this.tempCustomer = customer;
        this.customerEmail=customer.email;
        this.customerSms=customer.phone;
      }
    });
    this.subscriptions.add(tempCustomerSubscription);
  }

  ngOnInit() {
    switch (this.flowType) {
      case FLOW_TYPE.CREATE_APPOINTMENT:
      this.ticketlessActionEnabled=false;
      this.ticketActionEnabled=false;
      this.isVipLvl1Enabled = false;
      this.isVipLvl2Enabled= false;
      this.isVipLvl3Enabled = false;
        // this.emailActionEnabled = true;
        // this.smsActionEnabled = true;
        this.buttonText = "create_appointment_action";
        break;
      case FLOW_TYPE.ARRIVE_APPOINTMENT:
      this.emailActionEnabled = false;
        // this.ticketActionEnabled = true;
        // this.smsActionEnabled = true;
        // this.ticketlessActionEnabled = true;
        this.buttonText = "checkin_appointment";
        break;
      case FLOW_TYPE.CREATE_VISIT:
      this.emailActionEnabled = false;
        // this.ticketActionEnabled = true;
        // this.smsActionEnabled = true;
        // this.ticketlessActionEnabled = true;
        this.buttonText = "create_visit";
        break;
      default:
        break;
    }

    if (this.flowType === FLOW_TYPE.CREATE_VISIT) {
      const branchSubscription = this.branchSelector.selectedBranch$.subscribe((branch) => this.selectedBranch = branch);
      this.subscriptions.add(branchSubscription);

      const serviceSubscription = this.serviceSelectors.selectedServices$.subscribe((services) => this.selectedServices = services);
      this.subscriptions.add(serviceSubscription);

      const servicePointSubscription = this.servicePointSelectors.openServicePoint$.subscribe((servicePoint) => this.selectedServicePoint = servicePoint);
      this.subscriptions.add(servicePointSubscription);
    }
    // this.radioForm = new FormGroup({
    //   vipLevel1: new FormControl(''),
    //   vipLevel2: new FormControl(''),
    //   vipLevel3: new FormControl('')

    // })

    // const radioFormSubscription = this.radioForm.valueChanges.subscribe(() => {

    //   if(this.radioForm.controls['vipLevel1'].touched ){
    //     this.radioForm.controls['vipLevel2'].patchValue(false,{ emitEvent: false });
    //     this.radioForm.controls['vipLevel3'].patchValue(false, { emitEvent: false });
    //     this.radioForm.controls['vipLevel1'].markAsUntouched({ onlySelf: true });
    //   }

    //   if(this.radioForm.controls['vipLevel2'].touched ){
    //     this.radioForm.controls['vipLevel1'].patchValue(false,{ emitEvent: false });
    //     this.radioForm.controls['vipLevel3'].patchValue(false, { emitEvent: false });
    //     this.radioForm.controls['vipLevel2'].markAsUntouched({ onlySelf: true });
    //   }

    //   if(this.radioForm.controls['vipLevel3'].touched ){
    //     this.radioForm.controls['vipLevel2'].patchValue(false,{ emitEvent: false });
    //     this.radioForm.controls['vipLevel1'].patchValue(false, { emitEvent: false });
    //     this.radioForm.controls['vipLevel3'].markAsUntouched({ onlySelf: true });
    //   }
   
    // });
    // this.subscriptions.add(radioFormSubscription);



  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onNoteClicked() {
    this.qmNotesModalService.openForTransKeys(this.noteTextStr,
      this.themeColor, 'save', 'cancel',
      (result: boolean) => {
        if (result) {
          this.noteText$ = this.noteSelectors.getNote$;
          this.noteText$.subscribe(
            (text) => {

              this.noteTextStr = text;
            }
          ).unsubscribe;
        }

      },
      () => { }, null);


  }

  onButtonPressed() {
    if(this.ticketlessSelected){
      this.handleCheckoutCompletion();
      return;
    }
    this.qmCheckoutViewConfirmModalService.openForTransKeys('msg_send_confirmation', this.emailSelected, this.smsSelected,
      this.themeColor, 'ok', 'cancel',
      (result: boolean) => {
        if (result) {
          this.handleCheckoutCompletion();
        }

      },
      () => { }, null);


  }

  onEmailSelected() {
    if (this.emailSelected) {
      this.emailSelected = false;
      this.emailColor = this.whiteColor;
      this.smsSelected ? this.buttonEnabled = true : this.buttonEnabled = false;
      return;
    }
    this.emailSelected = true;
    this.emailColor = this.themeColor;
    this.buttonEnabled = true;
  }


  onTicketSelected() {
    if (this.ticketlessSelected) {
      this.ticketlessSelected = false;
      this.ticketlessColor = this.whiteColor;
    } else if (this.ticketSelected) {
      this.ticketSelected = false;
      this.ticketColor = this.whiteColor;
      this.smsSelected ? this.buttonEnabled = true : this.buttonEnabled = false;
      return;
    }

    this.ticketSelected = true;
    this.ticketColor = this.themeColor;
    this.buttonEnabled = true;
  }

  onSmsSelected() {
    if (this.emailActionEnabled) {
      if (this.smsSelected) {
        this.smsSelected = false;
        this.smsColor = this.whiteColor;
        this.emailSelected ? this.buttonEnabled = true : this.buttonEnabled = false;
        return;
      }
    } else {
      if (this.ticketlessSelected) {
        this.ticketlessSelected = false;
        this.ticketlessColor = this.whiteColor;
      } else if (this.smsSelected) {
        this.smsSelected = false;
        this.smsColor = this.whiteColor;
        this.ticketSelected ? this.buttonEnabled = true : this.buttonEnabled = false;
        return;
      }
    }
    this.smsSelected = true;
    this.smsColor = this.themeColor;
    this.buttonEnabled = true;
  }

  onTicketlessSelected() {
    if (this.ticketSelected || this.smsSelected) {
      this.ticketSelected = false;
      this.smsSelected = false;
      this.ticketColor = this.whiteColor;
      this.smsColor = this.whiteColor;
      this.ticketlessColor = this.themeColor;
      this.ticketlessSelected = true;
    } else if (this.ticketlessSelected) {
      this.ticketlessSelected = false;
      this.ticketlessColor = this.whiteColor;
      this.buttonEnabled = false;
      return;
    }
    this.ticketlessSelected = true;
    this.ticketlessColor = this.themeColor;
    this.buttonEnabled = true;
  }

  handleCheckoutCompletion() {
    if (this.flowType === FLOW_TYPE.CREATE_APPOINTMENT) {
      this.setCreateAppointment();
    }
    else if (this.flowType === FLOW_TYPE.ARRIVE_APPOINTMENT) {
      this.setAriveAppointment();
    }
    else if (this.flowType === FLOW_TYPE.CREATE_VISIT) {
      this.setCreateVisit();
    }
  }

  setCreateAppointment() {
    this.calendarService.createAppointment(this.selectedAppointment, this.noteTextStr, this.selectedCustomer, this.customerEmail, this.customerSms).subscribe(result => {
      if (result) {
        this.showSussessMessage(result);
        this.clearSelectedValues();
        this.onFlowExit.emit();
      }
    }, error => {
      const err = new DataServiceError(error, null);
      if (err.errorCode === Q_ERROR_CODE.CREATED_APPOINTMENT_NOT_FOUND) {
        this.calendarService.bookAppointment(this.selectedAppointment, this.noteTextStr, this.selectedCustomer, this.customerEmail, this.customerSms).subscribe(result => {
          this.showSussessMessage(result);
          this.clearSelectedValues();
          this.onFlowExit.emit();
        }, error => {
          this.showErrorMessage();
          this.clearSelectedValues();
          this.onFlowExit.emit();
        })
      }
    });
  }

  setCreateVisit(){
    this.spService.createVisit(this.selectedBranch, this.selectedServicePoint, this.selectedServices, "", VIP_LEVEL.NONE,this.selectedCustomer, this.customerSms, this.ticketlessActionEnabled, this.tempCustomer).subscribe((result) => {
      this.showSussessMessage(result);
      this.saveFrequentService();
      this.clearSelectedValues();
      this.onFlowExit.emit();
    }, error => {
      this.showErrorMessage();
      this.saveFrequentService();
      this.clearSelectedValues();
      this.onFlowExit.emit();
    })
  }

  setAriveAppointment() {

  }

  showSussessMessage(result: any) {
    if (this.flowType === FLOW_TYPE.CREATE_APPOINTMENT) {
      this.translateService.get(['appointment_for_service','created_on_branch', 'appointment_time']).subscribe(v => {
        var serviceName = ""
        result.services.forEach(val => {
          if(serviceName.length > 0){
            serviceName = serviceName + ", " + val.name;
          }
          else{
            serviceName = val.name;
          }
        })
        var successMessage = { 
          firstLineName: v.appointment_for_service,
          firstLineText: serviceName,
          SecondLineName: v.created_on_branch,
          SecondLineText: result.branch.name,
          icon:"correct",
          LastLineName: v.appointment_time,
          LastLineText: this.buildDate(result.start)
        }
        this.infoMsgBoxDispatcher.updateInfoMsgBoxInfo(successMessage);
      });
    }
    else if (this.flowType === FLOW_TYPE.CREATE_VISIT) {
      this.translateService.get('visit_created').subscribe(v => {
        var successMessage = { 
          firstLineName: v,
          firstLineText: result.ticketId,
          icon:"correct"
        }
        this.infoMsgBoxDispatcher.updateInfoMsgBoxInfo(successMessage);
      });
    }
  }

  showErrorMessage() {
    if (this.flowType === FLOW_TYPE.CREATE_APPOINTMENT) {
      this.toastService.infoToast("Fail to create Appointment");
    }
    if (this.flowType === FLOW_TYPE.CREATE_VISIT) {
      this.toastService.infoToast("Fail to create visit");
    }
  }

  clearSelectedValues(){
    this.customerDispatcher.resetCurrentCustomer();
    if (this.flowType === FLOW_TYPE.CREATE_VISIT) {
      this.customerDispatcher.resetTempCustomer();
    }
  }

  deleteNote() {

    this.qmModalService.openForTransKeys('', 'delete_current_note', 'yes', 'no', (result) => {
      if (result) {
        this.noteDispatchers.saveNote(
          {
            text: ''
          }
        );

      }
    }, () => {

    });



  }

  saveFrequentService(){
    if (this.flowType === FLOW_TYPE.CREATE_VISIT || this.flowType === FLOW_TYPE.ARRIVE_APPOINTMENT) {
      var serviceList = [];
      this.selectedServices.forEach(val => {
        serviceList.push(val.id);
      })
      if(this.flowType === FLOW_TYPE.CREATE_VISIT){
        this.localStorage.setStoreValue(STORAGE_SUB_KEY.MOST_FRQUENT_SERVICES, serviceList);
      }
      else if(this.flowType === FLOW_TYPE.ARRIVE_APPOINTMENT){
        this.localStorage.setStoreValue(STORAGE_SUB_KEY.MOST_FRQUENT_SERVICES_APPOINTMENT, serviceList);
      }
    }
  }

  private buildDate(time: string){
    let dateObj = moment(time).format("YYYY-MM-DD, HH:mm");
    return dateObj;
  }
  onVip1Clicked(){
    this.vipLevel1Checked ? this.vipLevel1Checked = false : this.vipLevel1Checked = true;
    this.vipLevel2Checked = false;
    this.vipLevel3Checked = false;
  }

  onVip2Clicked(){
    this.vipLevel2Checked ? this.vipLevel2Checked = false : this.vipLevel2Checked = true;
    this.vipLevel1Checked = false;
    this.vipLevel3Checked = false;
  }

  onVip3Clicked(){
    this.vipLevel3Checked ? this.vipLevel3Checked = false : this.vipLevel3Checked = true;
    this.vipLevel2Checked = false;
    this.vipLevel1Checked = false;
  }
}
