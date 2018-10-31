import { TranslateService } from '@ngx-translate/core';

import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerSelector, CustomerDispatchers, UserSelectors, ServicePointSelectors } from "../../../../store";
import { Util } from '../../../../util/util';
import { ICustomer } from '../../../../models/ICustomer';
import { SPService } from "../../../../util/services/rest/sp.service";
import { AutoClose } from "./../../../../util/services/autoclose.service";

@Component({
  selector: 'qm-checkout-view-confirm-modal',
  templateUrl: './qm-checkout-view-confirm-modal.component.html',
  styleUrls: ['./qm-checkout-view-confirm-modal.component.scss']
})
export class QmCheckoutViewConfirmModalComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  title: string;
  isEmailEnabled: boolean = false;
  isSmsEnabled: boolean = false;
  isEmailAndSmsEmpty: boolean = false;
  customerEmail: String;
  customerSms: string;
  themeColor: string;
  btnOkText: string;
  btnCancelText: string;
  userDirection$: Observable<string>;
  confirmModalForm: FormGroup;
  showEmailTick: boolean = false;
  showPhoneTick: boolean = false;
  customer: ICustomer;
  countryCode: string;
  phoneColor: string = "#ffffff";
  optionsHeading: string = '';
  phoneNumber: string = '';
  email: string = '';



  constructor(
    public activeModal: NgbActiveModal,
    private autoCloseService: AutoClose,
    private userSelectors: UserSelectors,
    private customerSelector: CustomerSelector,
    private servicePointSelectors: ServicePointSelectors,
    private translationService: TranslateService,
    private spService: SPService,
    private util: Util,
    private customerDispatchers: CustomerDispatchers
  ) {
    const customerSubscription = this.customerSelector.currentCustomer$
      .subscribe(customer => {
        if (customer) {
          this.customer = customer;
          this.customerEmail = customer.properties.email;
          this.customerSms = customer.properties.phoneNumber;
        }
      })
      .unsubscribe();
    this.subscriptions.add(customerSubscription);

    const tempCustomerSubscription = this.customerSelector.tempCustomer$
      .subscribe(customer => {
        if (customer && customer.phone && customer.phone.length > 0) {
          this.customerEmail = customer.email;
          this.customerSms = customer.phone;
        }
      })
      .unsubscribe();
    this.subscriptions.add(tempCustomerSubscription);

    const uttSubscription = this.servicePointSelectors.uttParameters$
      .subscribe(uttParameters => {
        if (uttParameters) {
          this.countryCode = uttParameters.countryCode;
        }
      })
      .unsubscribe();
    this.subscriptions.add(uttSubscription);
  }

  ngOnInit() {
    const themeSubscription = this.servicePointSelectors.openServicePoint$.subscribe((openSp) => {
      this.util.setApplicationTheme(openSp);
    })
    this.subscriptions.add(themeSubscription);

    const phoneValidators = this.util.phoneNoValidator().concat([Validators.required]);
    const emailValidators = this.util.emailValidator().concat([Validators.required]);
    this.userDirection$ = this.userSelectors.userDirection$;

    this.confirmModalForm = new FormGroup({
      phone: new FormControl('', phoneValidators),
      email: new FormControl('', emailValidators)
    })
    if (this.customerSms != undefined) {
      if (this.customerSms === '' && this.countryCode != '') {
        this.confirmModalForm.patchValue({
          phone: this.countryCode
        })

      } else {
        this.confirmModalForm.patchValue({
          phone: this.customerSms
        })
      }

    } else if (this.countryCode != '') {
      this.confirmModalForm.patchValue({
        phone: this.countryCode
      })
    }

    if (this.customerEmail != null) {
      this.confirmModalForm.patchValue({
        email: this.customerEmail
      })
    }

    const emailSubscription = this.confirmModalForm.get('email').valueChanges.subscribe(() => {
      if (this.confirmModalForm.controls['email'].dirty) {
        this.showEmailTick = false;
      }
    });
    this.subscriptions.add(emailSubscription);

    const phoneSubscription = this.confirmModalForm.get('phone').valueChanges.subscribe(() => {
      this.setphoneColor(this.confirmModalForm.controls['phone'].value);
      if (this.confirmModalForm.controls['phone'].dirty) {
        this.showPhoneTick = false;
      }
    });
    this.subscriptions.add(phoneSubscription);


    if (!this.isEmailEnabled) {
      this.confirmModalForm.get('email').disable();
    } else if (!this.isSmsEnabled) {
      this.confirmModalForm.get('phone').disable();
    }

    this.translationService.get(['label.options.smsonly.heading',
      'label.options.emailonly.heading',
      'label.options.emailandsms.heading'
    ]).subscribe((messages) => {

      if (this.isEmailEnabled && this.isSmsEnabled)
      {
        if(!this.customer.properties.email && !this.customer.properties.phoneNumber) {
          this.optionsHeading = messages['label.options.emailandsms.heading'];
          this.isEmailAndSmsEmpty = true;
        } 
        else if(!this.customer.properties.phoneNumber) {
          this.optionsHeading = messages['label.options.smsonly.heading'];
          this.isEmailEnabled = false;
          this.isEmailAndSmsEmpty = false;
        }
        else if(!this.customer.properties.email) {
          this.optionsHeading = messages['label.options.emailonly.heading'];
          this.isSmsEnabled = false;
          this.isEmailAndSmsEmpty = false;
        }
      }
      else if (this.isEmailEnabled && !this.isSmsEnabled && !this.customer.properties.email) {
        this.optionsHeading = messages['label.options.emailonly.heading'];

        this.isEmailAndSmsEmpty = false;
      } else if (this.isSmsEnabled && !this.customer.properties.phoneNumber) {
        this.optionsHeading = messages['label.options.smsonly.heading'];
        this.isEmailAndSmsEmpty = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  validatePhone(): boolean {
    this.confirmModalForm.controls['phone'].patchValue(this.confirmModalForm.controls['phone'].value.trim());
    if (this.customer && this.confirmModalForm.controls['phone'].valid) {
      this.updateCustomer(this.preparedCustomer(), false);
      return true;
    } else {
      return false;
    }
  }

  validateEmail(): boolean {
    this.confirmModalForm.controls['email'].patchValue(this.confirmModalForm.controls['email'].value.trim());
    if (this.customer && this.confirmModalForm.controls['email'].valid && this.confirmModalForm.controls['email'].value != '') {
      this.updateCustomer(this.preparedCustomer(), true);
      return true;
    } else {
      return false;
    }
  }

  updateCustomer(customer: ICustomer, fromEmail: boolean) {
    this.spService.updateCustomerPartially(customer).subscribe(
      result => {
        this.customerDispatchers.selectCustomer(customer);
        this.updateCustomerSuccess(fromEmail);
      }, error => {
      }
    )
  }

  updateCustomerSuccess(fromEmail: boolean) {
    fromEmail ? this.showEmailTick = true : this.showPhoneTick = true;
  }


  clearPhone() {
    this.confirmModalForm.patchValue({
      phone: this.countryCode != '' ? this.countryCode : ''
    });
    this.showPhoneTick = false;
  }

  clearEmail() {
    this.confirmModalForm.patchValue({
      email: ''
    });
    this.showEmailTick = false;
  }
  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
      this.activeModal.close({ 'email' : (this.email || '').trim() , 'phone': (this.phoneNumber || '').trim()});    
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  private preparedCustomer(): ICustomer {

    const customerSave: ICustomer = {
      ...this.customer,
      id: this.customer.id,
      properties: {
        phoneNumber: this.isSmsEnabled ? this.confirmModalForm.value.phone.trim() : this.customer.properties.phoneNumber,
        email: this.isEmailEnabled ? this.confirmModalForm.value.email.trim() : this.customer.properties.email
      }
    }
    return customerSave
  }



  setphoneColor(phoneNo: string) {
    // if (this.countryCode === null) {
    phoneNo === '' || this.confirmModalForm.controls['phone'].valid ? this.phoneColor = '#ffffff' : this.phoneColor = '#F5A9A9';
    // } else if (this.countryCode != null) {
    //   phoneNo == '' || phoneNo === this.countryCode || (phoneNo.length > this.countryCode.length && this.confirmModalForm.controls['phone'].valid) ? this.phoneColor = '#ffffff' : this.phoneColor = '#F5A9A9';
    // }
  }

}
