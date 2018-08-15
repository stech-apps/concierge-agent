import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ICustomer } from '../../../../models/ICustomer';
import { Observable, Subscription } from '../../../../../node_modules/rxjs';
import { CustomerDispatchers, CustomerSelector, InfoMsgDispatchers } from '../../../../store';
import { IMessageBox } from '../../../../models/IMessageBox';

@Component({
  selector: 'qm-identify-customer',
  templateUrl: './qm-identify-customer.component.html',
  styleUrls: ['./qm-identify-customer.component.scss']
})
export class QmIdentifyCustomerComponent implements OnInit {
  
  currentCustomer: ICustomer;
  currentCustomer$: Observable<ICustomer>;
  SampleValue:IMessageBox
  private subscriptions : Subscription = new Subscription();

  constructor(
    private customerDispatchers:CustomerDispatchers,
    private customerSelectors:CustomerSelector,
    private InfoMsgBoxDispatcher:InfoMsgDispatchers 
  ) { 
    this.currentCustomer$ = this.customerSelectors.currentCustomer$;
  }

  @Output()
  onFlowNext:  EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {

    const customerSubscription = this.customerSelectors.currentCustomer$.subscribe((customer) => {
      this.currentCustomer = customer;
      if(customer){
        this.doneButtonClick();
       
      }
    });
    this.subscriptions.add(customerSubscription);
  }


  clearCustomer(){
    this.customerDispatchers.resetCurrentCustomer()
  }

  doneButtonClick() {
    this.customerDispatchers.resetCustomerSearchText();
    this.customerDispatchers.resetCustomers();
    this.onFlowNext.emit();
    
  }
  // test(){
  //   this.SampleValue={firstLineName:"Appoinment for service",firstLineText:"SERVICE2",SecondLineName:"Created on branch",
  //   SecondLineText:"BRANCH_TIMEZONE1",icon:"correct",LastLineName:"Appoinment time",LastLineText:"2018-08-13, 12:50"}
  //   this.InfoMsgBoxDispatcher.updateInfoMsgBoxInfo(this.SampleValue);
  // }
}
