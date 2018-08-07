import { Component, OnInit } from '@angular/core';
import { ICustomer } from '../../../../models/ICustomer';
import { Subscription, Subject, Observable } from 'rxjs';
import { CustomerSelector,CustomerDispatchers, ServicePointSelectors, UserSelectors } from '../../../../store';
import { tap, distinctUntilChanged, debounceTime, filter, throwIfEmpty } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Util } from '../../../../util/util';
import { CustomerUpdateService } from '../../../../util/services/customer-update.service';

@Component({
  selector: 'qm-customer-search-bar',
  templateUrl: './qm-customer-search-bar.component.html',
  styleUrls: ['./qm-customer-search-bar.component.scss']
})
export class QmCustomerSearchBarComponent implements OnInit {

  subscriptions :Subscription = new Subscription();
  searchInput$ : Subject<string> = new Subject<string>();
  userDirection$ :Observable<string>;
  searchText:string;
  searchText$: Observable<string>;
  customers:ICustomer[] = new Array <ICustomer>();
  customers$: Observable<ICustomer[]>
  customerLoading$:Observable<boolean>;
  customerLoaded:boolean;
  customerLooaded$:Observable<boolean>;
  selectedUser:ICustomer;

  newcustomer:ICustomer;

  private CHARACTER_THRESHOLD = 2;
  constructor(
    private CustomerDispatchers: CustomerDispatchers,
    private CustomerSelectors: CustomerSelector,
    private servicePointSelectors:ServicePointSelectors,
    private util:Util,
    private confirmBox:CustomerUpdateService,
    private userSelectors:UserSelectors
  
  ) {
    this.userDirection$ = this.userSelectors.userDirection$;
    this.customers$ = this.CustomerSelectors.customer$;
    this.searchText$ = this.CustomerSelectors.searchText$;
    this.customerLoading$ = this.CustomerSelectors.customerLoading$;
    this.customerLooaded$ = this.CustomerSelectors.customerLoaded$

   
   }

  ngOnInit() {
    this.servicePointSelectors.openServicePoint$.subscribe((openSp) => {
      this.util.setApplicationTheme(openSp);
  });
    const searchInputSubscription = this.searchInput$
      .pipe(
        tap(val => this.immidiateActions(val)),
        distinctUntilChanged(),
        debounceTime(500),
        filter(text => text.length >= this.CHARACTER_THRESHOLD)
      ).subscribe((searchText:string)=> this.handleCustomerSearch(searchText));

    const customerLoadedSubscription = this.customerLooaded$.subscribe(
      (customerLoaded:boolean)=> (this.customerLoaded= customerLoaded)
    )
    const customerSubscription = this.customers$.subscribe(
      (customers:ICustomer[])=>(this.customers=customers)  
    )
    const searchTextSubscription = this.searchText$.subscribe(
      (searchText:string) => (this.searchText= searchText)
    )

    this.subscriptions.add(searchInputSubscription);
    this.subscriptions.add(customerLoadedSubscription);
    this.subscriptions.add(customerSubscription);
    this.subscriptions.add(searchTextSubscription);
  }

  resetSearch(){
    this.CustomerDispatchers.resetCustomers();
    this.CustomerDispatchers.resetCustomerSearchText();
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

 
  search(text:string){
    this.searchInput$.next(text);
  }

  immidiateActions(searchText:string){
    this.CustomerDispatchers.updateCustomerSearchText(searchText);
    if (searchText.length<this.CHARACTER_THRESHOLD){
      this.CustomerDispatchers.resetCustomers();
    }
  }

  handleCustomerSearch(text:string){
    this.CustomerDispatchers.fetchCustomers(text);
  }

  createNewCustomer(){
    this.confirmBox.open();
  }

}