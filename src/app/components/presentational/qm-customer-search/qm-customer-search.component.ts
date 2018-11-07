import { Component, OnInit, Input} from '@angular/core';
import { ICustomer } from '../../../../models/ICustomer';
import { Subscription, Observable } from 'rxjs';
import { CustomerDispatchers, CustomerSelector, UserSelectors, } from '../../../../store';

@Component({
  selector: 'qm-customer-search',
  templateUrl: './qm-customer-search.component.html',
  styleUrls: ['./qm-customer-search.component.scss']
})
export class QmCustomerSearchComponent implements OnInit {
  customersLoading: boolean;
  customerLoading$:Observable<boolean>;
  customerLoaded:boolean;
  customerLoaded$:Observable<boolean>;
  currentCustomer: ICustomer;
  currentCustomer$: Observable<ICustomer>;
  black:string = "black"
  customers: ICustomer[];
  customers$: Observable<ICustomer[]>
  private subscriptions : Subscription = new Subscription();
  userDirection$: Observable<string>; 
  searchText:string;

  @Input() public noCustomerFeedback: string = null;

constructor(
    private CustomerDispatchers: CustomerDispatchers,
    private CustomerSelectors:CustomerSelector,
    private userSelectors:UserSelectors,
  ) { 
    this.userDirection$ = this.userSelectors.userDirection$;
    this.customerLoading$ = this.CustomerSelectors.customerLoading$;
    this.customerLoaded$ = this.CustomerSelectors.customerLoaded$;
    this.currentCustomer$ = this.CustomerSelectors.currentCustomer$;
    
  }
  ngOnInit() {
    
    const searchTextSubscription = this.CustomerSelectors.searchText$.subscribe((searchText)=>{
      this.searchText = searchText;
    })
    this.subscriptions.add(searchTextSubscription);
    const currentCustomerSubscription = this.CustomerSelectors.currentCustomer$.subscribe((customer) => {
      this.currentCustomer = customer;
        });
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
    this.CustomerDispatchers.editCustomerMode(true);
    this.CustomerDispatchers.selectCustomer(customer);
    // this.CustomerDispatchers.resetCustomers();
  }

  showLoading() {
    return !this.customerLoaded && this.customersLoading;
  }

  showNoResults() {
    return this.customerLoaded && this.customers.length === 0;
  }

  selectCustomer(customer:ICustomer){
    this.CustomerDispatchers.selectCustomer(customer);
    this.CustomerDispatchers.editCustomerMode(false);
    this.CustomerDispatchers.resetCustomers();
  }
  
}
