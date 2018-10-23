import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AutoClose } from '../../../../util/services/autoclose.service';
import { UserSelectors, CustomerDispatchers, CustomerDataService, CustomerSelector, ServicePointSelectors } from '../../../../store';
import { FormGroup, FormControl, FormBuilder, FormArray, FormGroupDirective, Validators, } from '@angular/forms';
import { ICustomer } from '../../../../models/ICustomer';
import { first } from '../../../../../node_modules/rxjs/operators';
import { whiteSpaceValidator } from '../../../../util/custom-form-validators';
import { Util } from '../../../../util/util';
import { NgOption } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';

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

  private dateLabelKeys: string[] = [
    'calendar.month.none',
    'calendar.month.january',
    'calendar.month.february',
    'calendar.month.march',
    'calendar.month.april',
    'calendar.month.may',
    'calendar.month.june',
    'calendar.month.july',
    'calendar.month.august',
    'calendar.month.september',
    'calendar.month.october',
    'calendar.month.november',
    'calendar.month.december'
  ];

  private months: NgOption[];

  constructor(
    private servicePointSelectors: ServicePointSelectors,
    public autoCloseService:AutoClose,
    private userSelectors:UserSelectors,
    private fb:FormBuilder,
    private customerDispatchers:CustomerDispatchers,
    private customerSelectors:CustomerSelector,
    private util: Util,
    private translateService: TranslateService
  ) {
    this.editCustomer$ = this.customerSelectors.editCustomer$;
    this.userDirection$ = this.userSelectors.userDirection$;
   }

  ngOnInit() {

    // get country code
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params){
      this.countrycode = params.countryCode;
    }
    });
    this.subscriptions.add(servicePointsSubscription);

    // Validators
    const phoneValidators = this.util.phoneNoValidator();    
    const emailValidators = this.util.emailValidator();
    let dayValidators = [Validators.maxLength(2), Validators.max(31)];
    let yearValidators = [Validators.maxLength(4), Validators.min(1)];
    let monthValidators = [];
    dayValidators = [...dayValidators, Validators.required];
    yearValidators = [...yearValidators, Validators.required];
    monthValidators = [...monthValidators, Validators.required];

    //subscribe current custoomer 
    const customerSubscription = this.customerSelectors.customer$.subscribe((customer) => this.customers = customer);
    this.subscriptions.add(customerSubscription);
    
    this.customers$ = this.customerSelectors.customer$;
       
    // Customer creation form
    this.customerCreateForm = new FormGroup({
      firstName: new FormControl('',Validators.required,whiteSpaceValidator),
      lastName:new FormControl('',Validators.required,whiteSpaceValidator),
      phone:new FormControl(this.countrycode, phoneValidators),
      email:new FormControl('',emailValidators),
      dateOfBirth: this.fb.group(
        {
          month: [null, monthValidators],
          day: ['', dayValidators],
          year: ['', yearValidators]
        },
        {
          validator: this.isValidDOBEntered.bind(this)
        }
      )
    })

    let editCustomerSubscription = null;
 
    // Add month names to an array
    const translateSubscription = this.translateService
    .get(this.dateLabelKeys)
    .subscribe((dateLabels: string[]) => {
      this.months = [
        { value: '', label: dateLabels['calendar.month.none'] },
        { value: '01', label: dateLabels['calendar.month.january'] },
        { value: '02', label: dateLabels['calendar.month.february'] },
        { value: '03', label: dateLabels['calendar.month.march'] },
        { value: '04', label: dateLabels['calendar.month.april'] },
        { value: '05', label: dateLabels['calendar.month.may'] },
        { value: '06', label: dateLabels['calendar.month.june'] },
        { value: '07', label: dateLabels['calendar.month.july'] },
        { value: '08', label: dateLabels['calendar.month.august'] },
        { value: '09', label: dateLabels['calendar.month.september'] },
        { value: '10', label: dateLabels['calendar.month.october'] },
        { value: '11', label: dateLabels['calendar.month.november'] },
        { value: '12', label: dateLabels['calendar.month.december'] }
      ];
    });

    this.subscriptions.add(translateSubscription);

    // if on update
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

    // Add customer status place country code
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
   console.log(this.trimCustomer());
    if(this.customerCreateForm.controls.firstName.invalid){
      this.invalidFirstName=true
    }else if (this.customerCreateForm.controls.lastName.invalid){
      this.invalidLastName=true
    }
    if(this.customerCreateForm.valid){
      // this.activeModal.close(this.customerCreateForm.value); 
      if(this.isOnupdate){
        this.customerDispatchers.updateCustomer(this.preparedCustomer());
        this.updateList(this.preparedCustomer());
        this.customerDispatchers.selectCustomers(this.preparedCustomer());
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
    if(this.customerCreateForm.value.phone== this.countrycode){
      this.customerCreateForm.value.phone = "";
    }
    const customerSave:ICustomer={
      firstName: this.customerCreateForm.value.firstName.trim(),
      lastName: this.customerCreateForm.value.lastName.trim(),
      properties:{phoneNumber: this.customerCreateForm.value.phone.trim(),
                        email: this.customerCreateForm.value.email.trim(),
                        dateOfBirth:this.getDateOfBirth()
                      }
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
  
  isValidDOBEntered(control: FormGroup) {
    let errors = null;
    if (control.value) {
      // invalid date check for leap year
      if (control.value.year && control.value.month && control.value.day) {
        const d = new Date(
          control.value.year,
          parseInt(control.value.month, 10) - 1,
          control.value.day
        );
        if (d && d.getMonth() + 1 !== parseInt(control.value.month, 10)) {
          control.setErrors({
            invalidDay: true
          });
          errors = { ...errors, invalidDay: true };
        }
      } else if (
        control.value.year ||
        control.value.month ||
        control.value.day
      ) {
        control.setErrors({
          incompleteDay: true
        });
        errors = { ...errors, incompleteDob: true };
      }
    }

    return errors;
  }

  restrictNumbers($event) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode($event.charCode);

    if (!pattern.test(inputChar)) {
      $event.preventDefault();
    }
  }

  formatDate(day, month, year) {
    let newDay, newMonth;
    if (day !== '' || day !== undefined) {
      const intDay = parseInt(day, 10);
      newDay = intDay;
      if (intDay < 10) {
        newDay = '0' + intDay;
      }
    }

    if (month !== '' || month !== undefined) {
      const intMonth = parseInt(month, 10) + 1;
      if (intMonth < 10) {
        newMonth = '0' + intMonth;
      }
    }

    return {
      day: newDay,
      month: newMonth,
      year: year
    };
  }

  // Format date of birth to be sent in the API
  getDateOfBirth(): string {
    const formModel = this.customerCreateForm.value;
    let year = String(formModel.dateOfBirth.year);
    const month = formModel.dateOfBirth.month as string;
    let day = formModel.dateOfBirth.day as string;

    if (day && parseInt(day, 10)) {
      const intDay = parseInt(day, 10);
      if (intDay < 10) {
        day = '0' + intDay;
      }
    }
    year = this.leftPadWithZeros(year, 4);
    return year && month && day ? year + '-' + month + '-' + day : '';
  }

  // Add 0 to make the year as 4 digits
  leftPadWithZeros(sourceString, length) {
    while (sourceString.length < length) {
      sourceString = '0' + sourceString;
    }
    return sourceString;
  }

}
