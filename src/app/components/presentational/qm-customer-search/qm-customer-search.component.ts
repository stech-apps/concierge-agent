import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ICustomer } from '../../../../models/ICustomer';
import { Subscription, Observable } from 'rxjs';
import { CustomerDispatchers, CustomerSelector, UserSelectors } from '../../../../store';
import { CustomerUpdateService } from '../../../../util/services/customer-update.service';

@Component({
  selector: 'qm-customer-search',
  templateUrl: './qm-customer-search.component.html',
  styleUrls: ['./qm-customer-search.component.scss']
})
export class QmCustomerSearchComponent implements OnInit {

  @Input() myData:string;
  customersLoading: boolean;
  customerLoading$:Observable<boolean>;
  customerLoaded:boolean;
  customerLoaded$:Observable<boolean>;
  hello:string='';

  customers: ICustomer[];
  customers$: Observable<ICustomer[]>

   private subscriptions : Subscription = new Subscription();
   userDirection$: Observable<string>; 
   inputBoxArray: string[][];

  constructor(
    private CustomerDispatchers: CustomerDispatchers,
    private CustomerSelectors:CustomerSelector,
    private confirmBox:CustomerUpdateService,
    private userSelectors:UserSelectors
  ) { 
    this.userDirection$ = this.userSelectors.userDirection$;
    this.customerLoading$ = this.CustomerSelectors.customerLoading$;
    this.customerLoaded$ = this.CustomerSelectors.customerLoaded$
    
  }

  ngAfterViewInit(){
    console.log(this.myData);
  }

  ngOnInit() {
    const customerSubscription = this.CustomerSelectors.customer$.subscribe((customer) => this.customers = customer);
    this.subscriptions.add(customerSubscription);
    this.customers$ = this.CustomerSelectors.customer$;

    const customerLoadedSubscription = this.customerLoaded$.subscribe(
      (customerLoaded:boolean)=> (this.customerLoaded= customerLoaded)
    )
    const customersLoadingSubscription = this.customerLoading$.subscribe(
      (customersLoading:boolean)=> (this.customersLoading= customersLoading)
    )
    this.subscriptions.add(customerLoadedSubscription);
    this.subscriptions.add(customersLoadingSubscription);
  }
  

  ngOnDestroy() {
    this.subscriptions.unsubscribe();

  }
  
  editCustomer(customer:ICustomer){
    this.confirmBox.open('update');
    this.CustomerDispatchers.selectCustomers(customer);
    console.log(customer);
  }

  showLoading() {
    return !this.customerLoaded && this.customersLoading;
  }

  showNoResults() {
    return this.customerLoaded && this.customers.length === 0;
  }
  
}
