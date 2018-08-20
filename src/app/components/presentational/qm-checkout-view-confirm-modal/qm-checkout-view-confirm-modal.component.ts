import { AutoClose } from "./../../../../util/services/autoclose.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { UserSelectors } from "./../../../../store/services/user/user.selectors";
import { ServicePointSelectors } from "../../../../store";
import { FormGroup, FormControl, FormBuilder, FormArray, FormGroupDirective, Validators } from '@angular/forms';
import { CustomerSelector, CustomerDispatchers } from "../../../../store";
import { Util } from '../../../../util/util';
import { ICustomer } from '../../../../models/ICustomer';
import { SPService } from "../../../../util/services/rest/sp.service";

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
  showEmailTick: boolean = false;
  showPhoneTick: boolean = false;
  customer: ICustomer;



  constructor(
    private activeModal: NgbActiveModal,
    private autoCloseService: AutoClose,
    private userSelectors: UserSelectors,
    private customerSelector: CustomerSelector,
    private servicePointSelectors: ServicePointSelectors,
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
          this.customer = customer;
          this.customerEmail = customer.email;
          this.customerSms = customer.phone;
        }
      })
      .unsubscribe();
    this.subscriptions.add(tempCustomerSubscription);

  }

  ngOnInit() {

    const themeSubscription = this.servicePointSelectors.openServicePoint$.subscribe((openSp) => {
      this.util.setApplicationTheme(openSp);
    })
    this.subscriptions.add(themeSubscription);

    const phoneValidators = [Validators.pattern(/^[0-9\+\s]+$/), Validators.required];
    const emailValidators = [Validators.pattern(/^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[A-Za-z]{2,4}$/), Validators.required];
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

    const emailSubscription = this.confirmModalForm.get('email').valueChanges.subscribe(() => {
      if (this.confirmModalForm.controls['email'].dirty) {
        this.showEmailTick = false;
      }
    });
    this.subscriptions.add(emailSubscription);

    const phoneSubscription = this.confirmModalForm.get('phone').valueChanges.subscribe(() => {
      if (this.confirmModalForm.controls['phone'].dirty) {
        this.showPhoneTick = false;
      }
    });
    this.subscriptions.add(phoneSubscription);

    //disable email validation in create visit flow 
    if(!this.isEmailEnabled){
      this.confirmModalForm.get('email').disable();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  validatePhone(): boolean {

    this.confirmModalForm.controls['phone'].patchValue(this.confirmModalForm.controls['phone'].value.trim());
    if (this.customer && this.confirmModalForm.controls['phone'].valid && this.confirmModalForm.controls['phone'].value != '') {
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
        this.customerDispatchers.selectCustomers(customer);
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
      phone: ''
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

    if (this.confirmModalForm.valid) {
      this.customerEmail = this.confirmModalForm.controls['email'].value;
      this.customerSms = this.confirmModalForm.controls['phone'].value;
      this.activeModal.close(this.confirmModalForm.value);

    }



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
}
