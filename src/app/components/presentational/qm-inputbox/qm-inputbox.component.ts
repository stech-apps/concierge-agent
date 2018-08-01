import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoClose } from '../../../../util/services/autoclose.service';
import { UserSelectors, CustomerDispatchers } from '../../../../store';
import { FormGroup, FormControl, FormBuilder, FormArray, FormGroupDirective, Validators, } from '@angular/forms';
import { ICustomer } from '../../../../models/ICustomer';

@Component({
  selector: 'qm-inputbox',
  templateUrl: './qm-inputbox.component.html',
  styleUrls: ['./qm-inputbox.component.scss']
})
export class QmInputboxComponent implements OnInit {
  customerCreateForm:FormGroup;
  currentCustomer: ICustomer;
  userDirection$: Observable<string>;
  isOnupdate:boolean;
  btnOkText: string;
  btnCancelText: string;

  constructor(
    private activeModal:NgbActiveModal,
    public autoCloseService:AutoClose,
    private userSelectors:UserSelectors,
    private fb:FormBuilder,
    private customerDispatchers:CustomerDispatchers
   
  ) {
   
   }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;   
    this.customerCreateForm = new FormGroup({
      firstName: new FormControl(),
      lastName:new FormControl(),
      phone:new FormControl(),
      email:new FormControl()
    })
    if(this.isOnupdate){
      console.log(this.currentCustomer.id);
      this.customerCreateForm.patchValue({
        firstName: this.currentCustomer.firstName,
        lastName:this.currentCustomer.lastName,
        // phone=this.currentCustomer.phone,
        email:this.currentCustomer.email
      })
    }
  }
  
  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    console.log(this.customerCreateForm.value);
    this.activeModal.close(this.customerCreateForm.value); 
    if(this.isOnupdate){

    }else{
    this.customerDispatchers.createCustomer(this.customerCreateForm.value);
     }
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
