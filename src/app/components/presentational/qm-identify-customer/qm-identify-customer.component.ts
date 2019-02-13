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
  editMode : boolean;
  customers:ICustomer[];

  SkipThisTimeFocused:boolean;
  showToolTip:boolean;

  constructor(
    private customerDispatchers:CustomerDispatchers,
    private customerSelectors:CustomerSelector,
    private InfoMsgBoxDispatcher:InfoMsgDispatchers,
    private localStorage: LocalStorage,
    private userSelectors: UserSelectors,
  ) { 
    this.isFlowSkip = this.localStorage.getSettingForKey(STORAGE_SUB_KEY.CUSTOMER_SKIP);
    this.currentCustomer$ = this.customerSelectors.currentCustomer$;
    this.showToolTip=false;

  }

  @Input() flowType: FLOW_TYPE;

  @Output()
  onFlowNext:  EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
      this.userDirection$ = this.userSelectors.userDirection$;
    const customerSubscription = this.customerSelectors.currentCustomer$.subscribe((customer) => {
      this.currentCustomer = customer;     
      if(this.currentCustomer && !this.editMode){
        this.doneButtonClick();       
      }
    });
    this.subscriptions.add(customerSubscription);

    const editModeSubscription = this.customerSelectors.editCustomerMode$.subscribe((status)=>{
      this.editMode = status;     
      if(this.currentCustomer && !this.editMode){
        this.doneButtonClick();       
      }
    })
    this.subscriptions.add(editModeSubscription);

    const customerListSubscription = this.customerSelectors.customer$.subscribe((customer) => this.customers = customer);
    this.subscriptions.add(customerListSubscription);
  }


  clearCustomer(){
    this.customerDispatchers.resetCurrentCustomer()

  }

  doneButtonClick() {
    this.customerDispatchers.resetCustomerSearchText();
    this.customerDispatchers.resetCustomers();
    this.onFlowNext.emit();
    this.customerDispatchers.editCustomerMode(false);
    
  }

  onSwitchChange(){
    this.localStorage.setSettings(STORAGE_SUB_KEY.CUSTOMER_SKIP, this.isFlowSkip);
  }


  
}
