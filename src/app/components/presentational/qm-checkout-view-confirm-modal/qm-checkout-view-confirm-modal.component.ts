import { AutoClose } from "./../../../../util/services/autoclose.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable,Subscription } from "rxjs";
import { UserSelectors } from "./../../../../store/services/user/user.selectors";
import { FormGroup, FormControl, FormBuilder, FormArray, FormGroupDirective, Validators, } from '@angular/forms';
import { CustomerSelector,CustomerDispatchers } from "../../../../store";
// import { whiteSpaceValidator } from '../../../../util/custom-form-validators';
import { ICustomer } from '../../../../models/ICustomer';

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
  customerEmail: String;
  customerSms: string;
  themeColor: string;
  btnOkText: string;
  btnCancelText: string;
  userDirection$: Observable<string>;
  confirmModalForm: FormGroup;
  emailValidated: boolean = true;
  phoneValidated: boolean = true;
  showEmailTick:boolean = false;
  showPhoneTick:boolean=false;
  customer:ICustomer;



  constructor(
    private activeModal: NgbActiveModal,
    private autoCloseService: AutoClose,
    private userSelectors: UserSelectors,
    private customerSelector:CustomerSelector,
    private customerDispatchers:CustomerDispatchers
  ) {
    const customerSubscription = this.customerSelector.currentCustomer$
    .subscribe(customer => {
      if (customer) {
        this.customer = customer;
       this.customerEmail=customer.properties.email;
       this.customerSms=customer.properties.phoneNumber;
      
      }
    })
    .unsubscribe();
  this.subscriptions.add(customerSubscription);
  }

  ngOnInit() {
    const phoneValidators = [Validators.pattern(/^[0-9\+\s]+$/)];
    const emailValidators = [Validators.pattern(/^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[A-Za-z]{2,4}$/)];
    this.userDirection$ = this.userSelectors.userDirection$;
  
    this.confirmModalForm = new FormGroup({
      phone: new FormControl('', phoneValidators),
      email: new FormControl('', emailValidators)
    })
    if (this.customerSms != null) {
      this.confirmModalForm.patchValue({
        phone: this.customerSms
      })
    }
    if (this.customerEmail != null) {
      this.confirmModalForm.patchValue({
        email: this.customerEmail
      })
    }

    // this.isEmailEnabled ? this.validateEmail() : null;
    // this.isSmsEnabled ? this.validatePhone() : null;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  validatePhone(): boolean {
  

    this.confirmModalForm.controls['phone'].patchValue(this.confirmModalForm.controls['phone'].value.trim());
    if  (this.customer && this.confirmModalForm.controls['phone'].valid && this.confirmModalForm.controls['phone'].value != '') {
      this.phoneValidated = true;
      this.showPhoneTick = true;
      this.customerDispatchers.updateCustomerWithoutToast(this.preparedCustomer());
      return true;
    } else {
      this.phoneValidated = false;
      this.showPhoneTick = false;
      return false;
    }
  }
  validateEmail(): boolean {
    
    this.confirmModalForm.controls['email'].patchValue(this.confirmModalForm.controls['email'].value.trim());
    if ( this.customer && this.confirmModalForm.controls['email'].valid && this.confirmModalForm.controls['email'].value != '') {
      this.emailValidated = true;
      this.showEmailTick = true;
      this.customerDispatchers.updateCustomerWithoutToast(this.preparedCustomer());
      return true;
    } else {
      this.emailValidated = false;
      this.showEmailTick = false;
      return false;
    }
  }

  validateAll():boolean{
    if(!this.isEmailEnabled){
      return this.phoneValidated && this.showPhoneTick;
    }
   else if(!this.isSmsEnabled){
      return this.emailValidated && this.showEmailTick;
    }
    else
    return this.phoneValidated && this.showPhoneTick && this.emailValidated && this.showEmailTick;
  }
  clearPhone() {
    this.confirmModalForm.patchValue({
      phone: ''
    });
    this.phoneValidated = true;
    this.showPhoneTick = false;
  }

  clearEmail() {
    this.confirmModalForm.patchValue({
      email: ''
    });
    this.emailValidated=true;
    this.showEmailTick  =false;
  }
  public decline() {
    this.activeModal.close(false);
  
  }

  public accept() {
if(this.validateAll()) {
  this.customerEmail = this.confirmModalForm.controls['email'].value;
  this.customerSms = this.confirmModalForm.controls['phone'].value;
  this.activeModal.close(this.confirmModalForm.value);

}else{
  
}



  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  private preparedCustomer():ICustomer{

    const customerSave:ICustomer={
      ...this.customer,
      id:this.customer.id,
      properties:{
        phoneNumber:this.isSmsEnabled&&this.showPhoneTick? this.confirmModalForm.value.phone.trim():this.customer.properties.phoneNumber,
        email: this.isEmailEnabled&&this.showEmailTick?this.confirmModalForm.value.email.trim():this.customer.properties.email
      }
  
    }
    return customerSave
  }
}
