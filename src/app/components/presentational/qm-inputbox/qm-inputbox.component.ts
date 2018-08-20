import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoClose } from '../../../../util/services/autoclose.service';
import { UserSelectors, CustomerDispatchers, CustomerDataService, CustomerSelector, ServicePointSelectors } from '../../../../store';
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
  countrycode:string;
  editCustomer: ICustomer;
  editCustomer$: Observable<ICustomer>;
  userDirection$: Observable<string>;
  isOnupdate:boolean;
  isButtonPressed:boolean=false;
  customers: ICustomer[];
  customers$: Observable<ICustomer[]>
  private subscriptions : Subscription = new Subscription();

  invalidFirstName:boolean;
  invalidLastName:boolean;

  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private activeModal:NgbActiveModal,
    public autoCloseService:AutoClose,
    private userSelectors:UserSelectors,
    private fb:FormBuilder,
    private customerDispatchers:CustomerDispatchers,
    private customerSelectors:CustomerSelector 
  ) {
    this.editCustomer$ = this.customerSelectors.editCustomer$;
    this.userDirection$ = this.userSelectors.userDirection$;
   }

  ngOnInit() {

    
   
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

    let editCustomerSubscription = null;
    if(this.isOnupdate){  
      editCustomerSubscription = this.editCustomer$.subscribe(
        (editCustomer:ICustomer)=>{
          this.editCustomer = editCustomer;
        }
      )
      this.customerCreateForm.patchValue({
        firstName: this.editCustomer.firstName,
        lastName:this.editCustomer.lastName,
        phone:this.editCustomer.properties.phoneNumber,
        email:this.editCustomer.properties.email
      })
    }
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      this.countrycode = params.countryCode;
      if(params.countryCode && !this.editCustomer){
        this.customerCreateForm.patchValue({
          phone:params.countryCode
        })
      }
    });
  }


  public decline() {
    this.activeModal.close(false);
    this.customerDispatchers.resetCurrentCustomer();
  }

  public accept() {
    if(this.customerCreateForm.controls.firstName.invalid){
      this.invalidFirstName=true
    }else if (this.customerCreateForm.controls.lastName.invalid){
      this.invalidLastName=true
    }
    if(this.customerCreateForm.valid){
      this.activeModal.close(this.customerCreateForm.value); 
      if(this.isOnupdate){
        this.customerDispatchers.updateCustomer(this.preparedCustomer());
        this.updateList(this.preparedCustomer());
      }else{
        this.customerDispatchers.createCustomer(this.trimCustomer());
      }
      }
      this.customerDispatchers.resetCurrentCustomer();
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
    if(this.editCustomer.phone== this.countrycode){
      this.customerCreateForm.value.phone = "";
    }
    const customerSave:ICustomer={
      firstName: this.customerCreateForm.value.firstName.trim(),
      lastName: this.customerCreateForm.value.lastName.trim(),
      properties:{phoneNumber: this.customerCreateForm.value.phone.trim(),
      email: this.customerCreateForm.value.email.trim()}
    }
    return customerSave
  }


  preparedCustomer():ICustomer{
    if(this.isOnupdate){
      const customerToSave : ICustomer = {
        ...this.editCustomer,
        ...this.trimCustomer(),
        id:this.editCustomer.id
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
