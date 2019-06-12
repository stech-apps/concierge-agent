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
import { Router } from '@angular/router';

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
  showEmailTick: boolean = false;
  showPhoneTick: boolean = false;
  customer: ICustomer;
  countryCode: string;
  phoneColor: string = "#ffffff";
  optionsHeading: string = '';
  phoneNumber: string = '';
  email: String = '';
  confirmModalForm:FormGroup;
  countryCodeNumber:string;



  constructor(
    public activeModal: NgbActiveModal,
    private autoCloseService: AutoClose,
    private userSelectors: UserSelectors,
    private customerSelector: CustomerSelector,
    private servicePointSelectors: ServicePointSelectors,
    private translationService: TranslateService,
    private spService: SPService,
    private util: Util,
    private customerDispatchers: CustomerDispatchers,
    private router: Router,
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
      
    // Customer creation form
    const emailValidators = this.util.emailValidator();
    const smsValidators = [Validators.minLength(this.countryCode.length + 1), ...this.util.phoneNoValidator()];

    if(this.isSmsEnabled && this.isEmailEnabled){
      this.confirmModalForm = new FormGroup({
        phone: new FormControl('',smsValidators),
        email:new FormControl('',emailValidators)   
      });
    } else if(this.isSmsEnabled){
      this.confirmModalForm = new FormGroup({
        phone: new FormControl('',smsValidators)
      });
    } else if(this.isEmailEnabled){
      this.confirmModalForm = new FormGroup({
        email:new FormControl('',emailValidators) 
      });
    }
   

    const themeSubscription = this.servicePointSelectors.openServicePoint$.subscribe((openSp) => {
      this.util.setApplicationTheme(openSp);
    })
    this.subscriptions.add(themeSubscription);

    this.userDirection$ = this.userSelectors.userDirection$;

    // customer phone number is not available 
    if (this.customerSms != undefined) {
      // customer phone number not available and country code not availabe
      if (this.customerSms === '' && this.countryCode != '') {
        this.confirmModalForm.patchValue({
          phone: this.countryCode
        });
        }else{
          this.confirmModalForm.patchValue({
            phone: this.customerSms
          });

          }
    } else if (this.countryCode != '') {
      this.confirmModalForm.patchValue({
        phone: this.countryCode
      });
    };
    
    // customer email is  availble
    if (this.customerEmail != null) {
        this.email = this.customerEmail;
    }

   

    this.translationService.get(['label.options.smsonly.heading',
      'label.options.emailonly.heading',
      'label.options.emailandsms.heading'
      ]).subscribe((messages) => {
        if(this.router.url=="/home/create-visit"){
          this.optionsHeading = messages['label.options.smsonly.heading'];
        }else{
      if (this.customer && this.isEmailEnabled && this.isSmsEnabled)
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
      else if (this.customer && this.isEmailEnabled && !this.isSmsEnabled && !this.customer.properties.email) {
        this.optionsHeading = messages['label.options.emailonly.heading'];

        this.isEmailAndSmsEmpty = false;
      } else if (this.customer && this.isSmsEnabled && !this.customer.properties.phoneNumber) {
        this.optionsHeading = messages['label.options.smsonly.heading'];
        this.isEmailAndSmsEmpty = false;
      }
    }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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


  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    let email:string;
    let phone:string;
    if(this.confirmModalForm.value.email){
      email = (this.confirmModalForm.value.email).trim();
    }else{
      email = "";
    }

    if(this.confirmModalForm.value.phone){
      phone = (this.confirmModalForm.value.phone).trim();
    }else{
      phone = "";
    }
    
      this.activeModal.close({ 'email' : email, 'phone': phone});    
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  // private preparedCustomer(): ICustomer {

  //   const customerSave: ICustomer = {
  //     ...this.customer,
  //     id: this.customer.id,
  //     properties: {
  //       phoneNumber: this.isSmsEnabled ? this.confirmModalForm.value.phone.trim() : this.customer.properties.phoneNumber,
  //       email: this.isEmailEnabled ? this.confirmModalForm.value.email.trim() : this.customer.properties.email
  //     }
  //   }
  //   return customerSave
  // }
  public regexvalue(){
    if(this.countryCode[0]=='+'){
      this.countryCodeNumber = this.countryCode.substring(1); 
    }else{
      this.countryCodeNumber = this.countryCode;
    }  
     let regex = new RegExp(this.firstValue());
     return regex
  }

  firstValue(){
    let a = '^(?!\\\+?';
    let c = this.countryCodeNumber
    let b = '$)([0-9\\\+\\\s]+)';   
    
    return  a + c +b;

  }
  restrictNumbers($event) {
    const pattern = /[0-9\+\s]/;
    const inputChar = String.fromCharCode($event.charCode);
    if (!pattern.test(inputChar)) {
      // $event.preventDefault();
      $event.target.value = $event.target.value.replace(/[^0-9\+\s]/g, '');
      this.confirmModalForm.patchValue({
        phone: $event.target.value
      });
      this.confirmModalForm.updateValueAndValidity();
    }
  }


}
