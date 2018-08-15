import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ICustomer } from '../../../../models/ICustomer';
import { Observable, Subscription } from '../../../../../node_modules/rxjs';
import { CustomerDispatchers, CustomerSelector } from '../../../../store';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { LocalStorage, STORAGE_SUB_KEY } from '../../../../util/local-storage';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../util/services/toast.service';

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


  constructor(
    private fb: FormBuilder,
    private customerDispatchers:CustomerDispatchers,
    private customerSelectors:CustomerSelector,
    private localStorage: LocalStorage,
    private translateService: TranslateService,
    private toastService: ToastService
  ) { 

    this.isFlowSkip = localStorage.getSettingForKey(STORAGE_SUB_KEY.CUSTOMER_SKIP);

    const customerSubscription = this.customerSelectors.tempCustomer$.subscribe((customer) => {
      this.currentCustomer = customer;
    });
    this.subscriptions.add(customerSubscription);
  }

  @Output()
  onFlowNext:  EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.buildCustomerFrom();
  }

  buildCustomerFrom(){
    const phoneValidators = [Validators.pattern(/^[0-9\+\s]+$/)];
    const emailValidators = [Validators.pattern( /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[A-Za-z]{2,4}$/)];
  
    this.customerCreateForm = new FormGroup({
      firstName: new FormControl(''),
      lastName:new FormControl(''),
      phone:new FormControl('',phoneValidators),
      email:new FormControl('',emailValidators)
    })
  }

  clearCustomer(){
    this.customerDispatchers.resetTempCustomer();
    this.customerCreateForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
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

    const customer: ICustomer = {
      firstName: formModel.firstName as string,
      lastName: formModel.lastName as string,
      email: formModel.email as string,
      phone: formModel.phone as string
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
      phone:''
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
