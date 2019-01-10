import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AutoClose } from '../../../../util/services/autoclose.service';
import { UserSelectors, CustomerDispatchers, CustomerDataService, CustomerSelector, ServicePointSelectors } from '../../../../store';
import { FormGroup, FormControl, FormBuilder, FormArray, FormGroupDirective, Validators, AbstractControl, } from '@angular/forms';
import { ICustomer } from '../../../../models/ICustomer';
import { first } from '../../../../../node_modules/rxjs/operators';
import { whiteSpaceValidator } from '../../../../util/custom-form-validators';
import { Util } from '../../../../util/util';
import { NgOption } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { ThrowStmt } from '@angular/compiler';

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
  isButtonPressed:boolean=false;
  customers: ICustomer[];
  customers$: Observable<ICustomer[]>
  private subscriptions : Subscription = new Subscription();
  countryCodeNumber:string;
  day:number;
  controls: any;
  currentCustomer:ICustomer
  editMode:boolean;

  
  @Output()
  onFlowNext: EventEmitter<any> = new EventEmitter();
  
  date = {
    day: '',
    month: '',
    year: ''
  };

  firstName:string

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

  
  public months: NgOption[];

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
    // this.editCustomer$ = this.customerSelectors.editCustomer$;
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

    // patch values if current customer available
    const CurrentcustomerSubscription = this.customerSelectors.currentCustomer$.subscribe((customer) => {
      this.currentCustomer = customer;
      if(this.currentCustomer){
        
          const dob: any = this.currentCustomer.properties.dateOfBirth;
          const dobDate = new Date(dob);
          this.date = this.formatDate(
            dobDate.getDate(),
            dobDate.getMonth(),
            dobDate.getFullYear()
          );
        

        this.customerCreateForm.patchValue({
          firstName: this.currentCustomer.firstName,
          lastName:this.currentCustomer.lastName,
          phone:this.currentCustomer.properties.phoneNumber,
          email:this.currentCustomer.properties.email,
          dateOfBirth: {
            month: this.date.month ? this.date.month : null,
            day: this.date.day ? this.date.day : '',
            year: this.date.year ? this.date.year : ''
          }
        })
      }else if((this.customerCreateForm!==undefined) && !this.currentCustomer  ){
        
        this.customerCreateForm.patchValue({
          firstName: '',
          lastName:'',
          phone:this.countrycode,
          email:'',
          dateOfBirth: {
            month: null,
            day: '',
            year: ''
          }
        })
      }
    });
    this.subscriptions.add(CurrentcustomerSubscription);

    

    const editModeSubscription = this.customerSelectors.editCustomerMode$.subscribe((status)=>{
      this.editMode = status;
    })
    this.subscriptions.add(editModeSubscription);

    
    // Validators
    const phoneValidators = this.util.phoneNoValidator();    
    const emailValidators = this.util.emailValidator();
    let dayValidators = [Validators.maxLength(2), Validators.max(31)];
    let yearValidators = [Validators.maxLength(4), Validators.min(1)];
    let monthValidators = [];
    dayValidators = [...dayValidators];
    yearValidators = [...yearValidators];
    monthValidators = [...monthValidators];

    //subscribe customer List 
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

    // Add customer status place country code
    if(this.countrycode && !this.currentCustomer){
        this.customerCreateForm.patchValue({
          phone:this.countrycode
        })
      }
       else if(this.countrycode && this.currentCustomer && !this.editCustomer.properties.phoneNumber){
        this.customerCreateForm.patchValue({
          phone:this.countrycode
        })
      }
   
  }
  
  clearCustomerForm(){
    if(this.customerCreateForm!==undefined){ 
      this.customerCreateForm.patchValue({
        firstName: '',
        lastName:'',
        phone:this.countrycode,
        email:'',
        dateOfBirth: {
          month: null,
          day: '',
          year: ''
        }
      })
    }
  }

  public accept() {
    if(this.customerCreateForm.valid){
      if(this.currentCustomer){
        this.customerDispatchers.updateCustomer(this.preparedCustomer());
        this.customerDispatchers.selectCustomer(this.preparedCustomer());
        this.customerDispatchers.editCustomerMode(false);
      }else{
        this.customerDispatchers.createCustomer(this.trimCustomer());
      }
      }     
      this.customerCreateForm.markAsPristine() 
    }

  // When customer edit and do not chage (add btn) 
  public next(){
    this.customerDispatchers.editCustomerMode(false);
    this.customerCreateForm.markAsPristine()
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
    
    if(this.currentCustomer){
      this.editCustomer = this.currentCustomer;
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
 
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  
  // Date of Birth validation
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
// restric input feild of birth date and year to numbers
  restrictNumbers($event) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode($event.charCode);

    if (!pattern.test(inputChar)) {
      $event.target.value = $event.target.value.replace(/[^0-9\+\s]/g, '');
      this.customerCreateForm.patchValue({ phone: $event.target.value})
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


  cancel(){
    this.customerDispatchers.resetCurrentCustomer();
    this.customerDispatchers.editCustomerMode(false);
  }

  update(){
    if(this.customerCreateForm.valid && ((this.currentCustomer.firstName != this.customerCreateForm.value.firstName )||(this.currentCustomer.lastName != this.customerCreateForm.value.lastName )||(this.currentCustomer.properties.phoneNumber != this.customerCreateForm.value.phone )||(this.currentCustomer.properties.email != this.customerCreateForm.value.email )||(this.date.year &&(this.date.year != this.customerCreateForm.value.dateOfBirth.year))||(!this.date.year && this.customerCreateForm.value.dateOfBirth.year)||(this.date.day &&(this.date.day != this.customerCreateForm.value.dateOfBirth.day))||(!this.date.day && this.customerCreateForm.value.dateOfBirth.year)||(this.date.month!=this.customerCreateForm.value.dateOfBirth.month))){
      this.accept();
    }else if(this.customerCreateForm.valid && this.customerCreateForm.dirty ){
        this.onFlowNext.emit();
        this.customerCreateForm.markAsPristine()
    }
  }
  discard(){
    this.onFlowNext.emit();
    this.customerCreateForm.markAsPristine() 
    this.customerCreateForm.patchValue({
      firstName: this.currentCustomer.firstName,
      lastName:this.currentCustomer.lastName,
      phone:this.currentCustomer.properties.phoneNumber,
      email:this.currentCustomer.properties.email,
      dateOfBirth: {
        month: this.date.month ? this.date.month : null,
        day: this.date.day ? this.date.day : '',
        year: this.date.year ? this.date.year : ''
      }
    })

  }

  clearInputFeild(name){
    
   switch(name){
     case "firstName": this.customerCreateForm.patchValue({ firstName: ''});break;
     case "lastName": this.customerCreateForm.patchValue({ lastName: ''});break;
     case "phone": this.customerCreateForm.patchValue({ phone: ''});break;
     case "email": this.customerCreateForm.patchValue({ email: ''});break;
                        
   }
  }
  ScrollToBottom(){
    var searchBox = document.getElementById("birthday_select");
    searchBox.scrollIntoView();
    
  }
  
}
