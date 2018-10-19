import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoClose } from '../../../../util/services/autoclose.service';
import { UserSelectors, CustomerDispatchers, CustomerDataService, CustomerSelector, ServicePointSelectors } from '../../../../store';
import { FormGroup, FormControl, FormBuilder, FormArray, FormGroupDirective, Validators, } from '@angular/forms';
import { ICustomer } from '../../../../models/ICustomer';
import { first } from '../../../../../node_modules/rxjs/operators';
import { whiteSpaceValidator } from '../../../../util/custom-form-validators';
import { Util } from '../../../../util/util';

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
  countryCodeNumber:string;
  constructor(
    private servicePointSelectors: ServicePointSelectors,
    // private activeModal:NgbActiveModal,
    public autoCloseService:AutoClose,
    private userSelectors:UserSelectors,
    private fb:FormBuilder,
    private customerDispatchers:CustomerDispatchers,
    private customerSelectors:CustomerSelector,
    private util: Util
  ) {
    this.editCustomer$ = this.customerSelectors.editCustomer$;
    this.userDirection$ = this.userSelectors.userDirection$;
   }

  ngOnInit() {

    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params){
      this.countrycode = params.countryCode;
    }
    });

    const phoneValidators = this.util.phoneNoValidator();    
    const emailValidators = this.util.emailValidator();
 
    const customerSubscription = this.customerSelectors.customer$.subscribe((customer) => this.customers = customer);
    this.subscriptions.add(customerSubscription);
    this.customers$ = this.customerSelectors.customer$;
    
    this.customerCreateForm = new FormGroup({
      firstName: new FormControl('',Validators.required,whiteSpaceValidator),
      lastName:new FormControl('',Validators.required,whiteSpaceValidator),
      phone:new FormControl(this.countrycode, phoneValidators),
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

    if(this.countrycode && !this.isOnupdate){
        this.customerCreateForm.patchValue({
          phone:this.countrycode
        })
      }
       else if(this.countrycode && this.isOnupdate && !this.editCustomer.properties.phoneNumber){
        this.customerCreateForm.patchValue({
          phone:this.countrycode
        })
      }
   
  }

  public decline() {
    // this.activeModal.close(false);
    // this.customerDispatchers.resetCurrentCustomer();
  }

  public accept() {
    // if(this.customerCreateForm.controls.firstName.invalid){
    //   this.invalidFirstName=true
    // }else if (this.customerCreateForm.controls.lastName.invalid){
    //   this.invalidLastName=true
    // }
    // if(this.customerCreateForm.valid){
    //   this.activeModal.close(this.customerCreateForm.value); 
    //   if(this.isOnupdate){
    //     this.customerDispatchers.updateCustomer(this.preparedCustomer());
    //     this.updateList(this.preparedCustomer());
    //     this.customerDispatchers.selectCustomers(this.preparedCustomer());
    //   }else{
    //     this.customerDispatchers.createCustomer(this.trimCustomer());
    //   }
    //   }
    //   // this.customerDispatchers.resetCurrentCustomer();
      
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
    if(this.customerCreateForm.value.phone== this.countrycode){
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
    // this.activeModal.dismiss();
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
