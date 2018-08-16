import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ICustomer } from '../../../../models/ICustomer';
import { Observable, Subscription } from '../../../../../node_modules/rxjs';
import { CustomerDispatchers, CustomerSelector, InfoMsgDispatchers, UserSelectors } from '../../../../store';
import { IMessageBox } from '../../../../models/IMessageBox';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { LocalStorage, STORAGE_SUB_KEY } from '../../../../util/local-storage';

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
  isFlowSkip: boolean = false;
  userDirection$: Observable<string>;

  constructor(
    private customerDispatchers:CustomerDispatchers,
    private customerSelectors:CustomerSelector,
    private InfoMsgBoxDispatcher:InfoMsgDispatchers,
    private localStorage: LocalStorage,
    private userSelectors: UserSelectors,
  ) { 
    this.isFlowSkip = this.localStorage.getSettingForKey(STORAGE_SUB_KEY.CUSTOMER_SKIP);
    this.currentCustomer$ = this.customerSelectors.currentCustomer$;
  }

  @Input() flowType: FLOW_TYPE;

  @Output()
  onFlowNext:  EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    const customerSubscription = this.customerSelectors.currentCustomer$.subscribe((customer) => {
      this.currentCustomer = customer;
      if(customer){
        this.doneButtonClick();
       
      }
      this.userDirection$ = this.userSelectors.userDirection$;   
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

  onSwitchChange(){
    this.localStorage.setSettings(STORAGE_SUB_KEY.CUSTOMER_SKIP, this.isFlowSkip);
  }
}
