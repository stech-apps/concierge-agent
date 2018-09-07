import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ICustomer } from '../../../../models/ICustomer';
import { Observable, Subscription } from '../../../../../node_modules/rxjs';
import { CustomerDispatchers, CustomerSelector, ServicePointSelectors, UserSelectors } from '../../../../store';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { LocalStorage, STORAGE_SUB_KEY } from '../../../../util/local-storage';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../util/services/toast.service';
import { Util } from '../../../../util/util';

@Component({
  selector: 'qm-visit-customer-create',
  templateUrl: './qm-visit-customer-create.component.html',
  styleUrls: ['./qm-visit-customer-create.component.scss']
})
export class QmVisitCustomerCreateComponent implements OnInit {
  
  currentCustomer: ICustomer;
  private subscriptions : Subscription = new Subscription();
  customerCreateForm: FormGroup;
  isFlowSkip: boolean = false;
  invalidFirstName: string;
  invalidLastName: string;
  accept: any;
  countryCode: string = '';

  constructor(
    private fb: FormBuilder,
    private customerDispatchers:CustomerDispatchers,
    private customerSelectors:CustomerSelector,
    private localStorage: LocalStorage,
    private translateService: TranslateService,
    private toastService: ToastService,
    private servicePointSelectors: ServicePointSelectors,
    private util: Util
  ) { 

    this.isFlowSkip = localStorage.getSettingForKey(STORAGE_SUB_KEY.CUSTOMER_SKIP);

    const customerSubscription = this.customerSelectors.tempCustomer$.subscribe((customer) => {
      this.currentCustomer = customer;
      if(customer){
        this.trimCustomer();
      }
    });
    this.subscriptions.add(customerSubscription);
    
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params){
        this.countryCode = params.countryCode;
      }
    });
    this.subscriptions.add(servicePointsSubscription);
  }

  @Output()
  onFlowNext:  EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.buildCustomerFrom();
  }

  buildCustomerFrom(){
    const phoneValidators = this.util.phoneNoValidator();
    const emailValidators = this.util.emailValidator();
  
    this.customerCreateForm = new FormGroup({
      firstName: new FormControl(''),
      lastName:new FormControl(''),
      phone:new FormControl(this.countryCode, phoneValidators),
      email:new FormControl('',emailValidators)
    })
  }

  clearCustomer(){
    this.customerDispatchers.resetTempCustomer();
    this.customerCreateForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      phone: this.countryCode
    });
  }

  trimCustomer(){
    var phoneNo = this.currentCustomer.phone.trim()
    if(phoneNo === "" || phoneNo === null){
      phoneNo = this.countryCode;
    }
    this.customerCreateForm.patchValue({
      firstName: this.currentCustomer.firstName.trim(),
      lastName: this.currentCustomer.lastName.trim(),
      email: this.currentCustomer.email.trim(),
      phone: phoneNo
    });
  }

  doneButtonClick() {
    if(this.customerCreateForm.invalid){
      this.translateService.get('invalied_customer_details').subscribe(v => {
        this.toastService.infoToast(v);
      });
    }
    else{
      this.customerDispatchers.setTempCustomers(this.prepareSaveCustomer());
      this.onFlowNext.emit();
    }
  }

  prepareSaveCustomer(): ICustomer {
    const formModel = this.customerCreateForm.value;

    var phoneNo = formModel.phone as string
    if(phoneNo === this.countryCode){
      phoneNo = '';
    }
    const customer: ICustomer = {
      firstName: formModel.firstName as string,
      lastName: formModel.lastName as string,
      email: formModel.email as string,
      phone: phoneNo
    };

    // trim trailing spaces
    for (const key in customer) {
      if (customer[key] && customer[key].trim) {
        customer[key] = customer[key].trim();
      }
    }

    return customer;
  }

  clearFirstName(){
    this.customerCreateForm.patchValue({
      firstName:''
    });
  }

  clearLastName(){
    this.customerCreateForm.patchValue({
      lastName:''
    });
  }

  clearPhoneNum(){
    this.customerCreateForm.patchValue({
      phone: this.countryCode
    });
  }

  clearEmail(){
    this.customerCreateForm.patchValue({
      email:''
    });
  }

  onSwitchChange(){
    this.localStorage.setSettings(STORAGE_SUB_KEY.CUSTOMER_SKIP, this.isFlowSkip);
  }
}
