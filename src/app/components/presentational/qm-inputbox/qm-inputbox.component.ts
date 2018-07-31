import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { AutoClose } from '../../../../util/services/autoclose.service';
import { UserSelectors } from '../../../../store';
import { element } from '../../../../../node_modules/protractor';
import { FormGroup, FormControl, FormBuilder } from '../../../../../node_modules/@angular/forms';

@Component({
  selector: 'qm-inputbox',
  templateUrl: './qm-inputbox.component.html',
  styleUrls: ['./qm-inputbox.component.scss']
})
export class QmInputboxComponent implements OnInit {
  myform:FormGroup;

  title: string;
  inputBoxNames: string[];
  btnOkText: string;
  btnCancelText: string;
  userDirection$: Observable<string>;
  InputBoxGlobalItems: string[][];
  InputBoxIndex=[];


  constructor(
    private activeModal:NgbActiveModal,
    private autoCloseService:AutoClose,
    private userSelectors:UserSelectors,
    private fb:FormBuilder
  ) {
   
   }

  ngOnInit() {
   
    const inputBoxItems = [];
    this.userDirection$ = this.userSelectors.userDirection$;
    this.inputBoxNames.forEach((element)=>{
      inputBoxItems.push(element[0])
    })
    this.InputBoxGlobalItems = inputBoxItems 
     this.myform = this.fb.group({
       inputboxes:this.fb.array(this.InputBoxGlobalItems),
        email:[''],
        password: ['']
       })
   
    // console.log('hello a ' + this.inputBoxNames); 
   
  }
  
  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
    console.log(this.myform.value);
  
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
