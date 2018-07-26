import { Component, OnInit, Input } from '@angular/core';
import { ICustomer } from '../../../../models/ICustomer';
import { Subscription, Observable } from 'node_modules/rxjs';
import { CustomerDispatchers, CustomerSelector } from '../../../../store';

@Component({
  selector: 'qm-qm-customer-search',
  templateUrl: './qm-customer-search.component.html',
  styleUrls: ['./qm-customer-search.component.scss']
})
export class QmCustomerSearchComponent implements OnInit {

  customers: ICustomer[];
  customers$: Observable<ICustomer[]>

   private subscriptions : Subscription = new Subscription();
   userDirection$: Observable<string>;
 

  constructor(
    private CustomerDispatchers: CustomerDispatchers,
    private CustomerSelectors:CustomerSelector
  ) { 

    const customerSubscription = this.CustomerSelectors.customer$.subscribe((customer) => this.customers = customer);
    this.subscriptions.add(customerSubscription);

    this.customers$ = this.CustomerSelectors.customer$;
   
  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  show(){
   
    console.log(this.customers);
  }
}
