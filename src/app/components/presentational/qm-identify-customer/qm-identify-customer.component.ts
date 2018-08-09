import { Component, OnInit } from '@angular/core';
import { ICustomer } from '../../../../models/ICustomer';
import { Observable, Subscription } from '../../../../../node_modules/rxjs';
import { CustomerDispatchers, CustomerSelector } from '../../../../store';

@Component({
  selector: 'qm-identify-customer',
  templateUrl: './qm-identify-customer.component.html',
  styleUrls: ['./qm-identify-customer.component.scss']
})
export class QmIdentifyCustomerComponent implements OnInit {

  currentCustomer: ICustomer;
  currentCustomer$: Observable<ICustomer>;
  private subscriptions : Subscription = new Subscription();

  constructor(
    private customerDispatchers:CustomerDispatchers,
    private customerSelectors:CustomerSelector 
  ) { 
    this.currentCustomer$ = this.customerSelectors.currentCustomer$;
  }

  ngOnInit() {

    const customerSubscription = this.customerSelectors.currentCustomer$.subscribe((customer) => this.currentCustomer = customer);
    this.subscriptions.add(customerSubscription);
  }


  clearCustomer(){
    this.customerDispatchers.resetCurrentCustomer()
  }
}
