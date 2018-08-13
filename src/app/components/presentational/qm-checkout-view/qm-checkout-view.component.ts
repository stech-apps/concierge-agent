import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import {
  CREATE_VISIT,
  CREATE_APPOINTMENT,
  ARRIVE_APPOINTMENT
} from "./../../../../constants/utt-parameters";
import { ServicePointSelectors,CustomerSelector } from "../../../../store";
import { IUTTParameter } from "../../../../models/IUTTParameter";
import { QmCheckoutViewConfirmModalService } from "../qm-checkout-view-confirm-modal/qm-checkout-view-confirm-modal.service";
import { FLOW_TYPE } from "../../../../util/flow-state";


@Component({
  selector: "qm-checkout-view",
  templateUrl: "./qm-checkout-view.component.html",
  styleUrls: ["./qm-checkout-view.component.scss"]
})
export class QmCheckoutViewComponent implements OnInit, OnDestroy {
  @Input() flowType: FLOW_TYPE;
 customerEmail: string;
  customerSms: string;

  private subscriptions: Subscription = new Subscription();
  ticketActionEnabled: boolean = false;
  smsActionEnabled: boolean = false;
  emailActionEnabled: boolean = false;
  ticketlessActionEnabled: boolean = false;
  buttonEnabled = false;

  ticketSelected: boolean = false;
  smsSelected: boolean = false;
  emailSelected: boolean = false;
  ticketlessSelected: boolean = false;

  isCreateVisit: boolean = false;
  isCreateAppointment: boolean = false;
  isArriveAppointment: boolean = false;
  isNoteBoxVisible: boolean = false;

  uttParameters$: Observable<IUTTParameter>;
  themeColor: string = "#a9023a";
  whiteColor: string = "#ffffff";
  blackColor:string = "#000000";
  ticketColor: string = this.whiteColor;
  smsColor: string = this.whiteColor;
  emailColor: string = this.whiteColor;
  ticketlessColor: string = this.whiteColor;

  buttonText: string;


  constructor(servicePointSelectors: ServicePointSelectors, private customerSelector:CustomerSelector, private translate: TranslateService, private qmCheckoutViewConfirmModalService: QmCheckoutViewConfirmModalService) {
    this.uttParameters$ = servicePointSelectors.uttParameters$;
    const uttSubscription = this.uttParameters$
      .subscribe(uttParameters => {
        if (uttParameters) {
          this.themeColor = uttParameters.highlightColor;

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
         this.customerEmail=customer.properties.email;
         this.customerSms=customer.properties.phoneNumber;
        
        }
      })
      .unsubscribe();
    this.subscriptions.add(customerSubscription);
  }

  ngOnInit() {
    switch (this.flowType) {
      case FLOW_TYPE.CREATE_APPOINTMENT:
        this.emailActionEnabled = true;
        this.smsActionEnabled = true;
        this.buttonText = "create_appointment_action";
        break;
      case FLOW_TYPE.ARRIVE_APPOINTMENT:
        this.ticketActionEnabled = true;
        this.smsActionEnabled = true;
        this.ticketlessActionEnabled = true;
        this.buttonText = "checkin_appointment";
        break;
      case FLOW_TYPE.CREATE_VISIT:
        this.ticketActionEnabled = true;
        this.smsActionEnabled = true;
        this.ticketlessActionEnabled = true;
        this.buttonText = "create_visit";
        break;
      default:
        break;
    }

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onButtonPressed() {
    this.qmCheckoutViewConfirmModalService.openForTransKeys('msg_send_confirmation', this.emailSelected, this.smsSelected,
      this.themeColor, 'ok', 'cancel',
      (result: boolean) => {
     
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

}
