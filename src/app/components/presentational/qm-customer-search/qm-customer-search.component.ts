import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ICustomer } from '../../../../models/ICustomer';
import { Subscription, Observable } from 'rxjs';
import { CustomerDispatchers, CustomerSelector } from '../../../../store';
import { CustomerUpdateService } from '../../../../util/services/customer-update.service';

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
   inputBoxArray: string[][];

  constructor(
    private CustomerDispatchers: CustomerDispatchers,
    private CustomerSelectors:CustomerSelector,
    private confirmBox:CustomerUpdateService
  ) { 
  
  }

  ngOnInit() {
    const customerSubscription = this.CustomerSelectors.customer$.subscribe((customer) => this.customers = customer);
    this.subscriptions.add(customerSubscription);
    this.customers$ = this.CustomerSelectors.customer$;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();

  }
  
  editCustomer(customer:ICustomer){
    this.confirmBox.open('update');
    this.CustomerDispatchers.selectCustomers(customer);
    console.log(customer);
  }
}
