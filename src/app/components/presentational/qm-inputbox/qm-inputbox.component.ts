import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoClose } from '../../../../util/services/autoclose.service';
import { UserSelectors, CustomerDispatchers, CustomerDataService, CustomerSelector } from '../../../../store';
import { FormGroup, FormControl, FormBuilder, FormArray, FormGroupDirective, Validators, } from '@angular/forms';
import { ICustomer } from '../../../../models/ICustomer';
import { first } from '../../../../../node_modules/rxjs/operators';
import { whiteSpaceValidator } from '../../../../util/custom-form-validators';

@Component({
  selector: 'qm-inputbox',
  templateUrl: './qm-inputbox.component.html',
  styleUrls: ['./qm-inputbox.component.scss']
})
export class QmInputboxComponent implements OnInit {
  customerCreateForm:FormGroup;
  currentCustomer: ICustomer;
  currentCustomer$: Observable<ICustomer>;
  userDirection$: Observable<string>;
  isOnupdate:boolean
  customers: ICustomer[];
  customers$: Observable<ICustomer[]>
  private subscriptions : Subscription = new Subscription();

  constructor(
    private activeModal:NgbActiveModal,
    public autoCloseService:AutoClose,
    private userSelectors:UserSelectors,
    private fb:FormBuilder,
    private customerDispatchers:CustomerDispatchers,
    private customerSelectors:CustomerSelector 
  ) {
    this.currentCustomer$ = this.customerSelectors.currentCustomer$;
   }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
    const phoneValidators = [Validators.pattern(/^[0-9\+\s]+$/)];
    const emailValidators = [Validators.pattern( /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[A-Za-z]{2,4}$/)];
  
    const customerSubscription = this.customerSelectors.customer$.subscribe((customer) => this.customers = customer);
    this.subscriptions.add(customerSubscription);
    this.customers$ = this.customerSelectors.customer$;

    this.customerCreateForm = new FormGroup({
      firstName: new FormControl('',Validators.required,whiteSpaceValidator),
      lastName:new FormControl('',Validators.required,whiteSpaceValidator),
      phone:new FormControl('',phoneValidators),
      email:new FormControl('',emailValidators)
    })

    let currentCustomerSubscription = null;
    if(this.isOnupdate){  
      currentCustomerSubscription = this.currentCustomer$.subscribe(
        (currentCustomer:ICustomer)=>{
          this.currentCustomer = currentCustomer;
        }
      )
      this.customerCreateForm.patchValue({
        firstName: this.currentCustomer.firstName,
        lastName:this.currentCustomer.lastName,
        phone:this.currentCustomer.phone,
        email:this.currentCustomer.email
      })
    }
  }


  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    if(this.customerCreateForm.valid){
      this.activeModal.close(this.customerCreateForm.value); 
      if(this.isOnupdate){
        this.customerDispatchers.updateCustomer(this.preparedCustomer());
        this.updateList(this.preparedCustomer());
      }else{
        this.customerDispatchers.createCustomer(this.trimCustomer());
      }
      }
    }
  
  updateList(customer:ICustomer){
    let updateItem = this.customers.find(this.findIndexToUpdate, customer.id);
    let index = this.customers.indexOf(updateItem);
    this.customers[index] = customer;
  }

  findIndexToUpdate(newItem) { 
    return newItem.id === this;
  }

  trimCustomer():ICustomer{
    const customerSave:ICustomer={
      firstName: this.customerCreateForm.value.firstName.trim(),
      lastName: this.customerCreateForm.value.lastName.trim(),
      name: this.customerCreateForm.value.firstName.trim()+'  '+this.customerCreateForm.value.lastName.trim(),
      phone: this.customerCreateForm.value.phone.trim(),
      email: this.customerCreateForm.value.email.trim()
    }
    return customerSave
  }


  preparedCustomer():ICustomer{
    if(this.isOnupdate){
      const customerToSave : ICustomer = {
        ...this.currentCustomer,
        ...this.trimCustomer(),
        id:this.currentCustomer.id
      }
      return customerToSave
    }else{
      const customerToSave : ICustomer = {
        ...this.trimCustomer()
      }
      return customerToSave
    }
      
  }

  public dismiss() {
    this.activeModal.dismiss();
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
