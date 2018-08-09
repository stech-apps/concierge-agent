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
  reminingHeight:string='301px';
  height:string="calc(100vh - "+ this.reminingHeight+ ')';
  currentCustomer: ICustomer;
  currentCustomer$: Observable<ICustomer>;

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
    this.customerLoaded$ = this.CustomerSelectors.customerLoaded$;
    this.currentCustomer$ = this.CustomerSelectors.currentCustomer$;
 
    
  }

  ngAfterViewInit(){
   
  }

  ngOnInit() {
    const currentCustomerSubscription = this.CustomerSelectors.currentCustomer$.subscribe((customer) => {this.currentCustomer = customer;
    if(this.currentCustomer){
      this.reminingHeight='344px';
      this.height="calc(100vh - "+ this.reminingHeight+ ')';
    } else{
      this.reminingHeight='301px';
      this.height="calc(100vh - "+ this.reminingHeight+ ')';
    }}
  );
    this.subscriptions.add(currentCustomerSubscription);

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
  selectCustomer(customer:ICustomer){
    this.CustomerDispatchers.selectCustomers(customer);
   
  }
  
}
