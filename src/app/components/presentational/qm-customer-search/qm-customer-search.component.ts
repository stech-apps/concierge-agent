import { Component, OnInit, Input } from '@angular/core';
import { ICustomer } from '../../../../models/ICustomer';
import { Subscription, Observable } from 'node_modules/rxjs';
import { CustomerDispatchers, CustomerSelector } from '../../../../store';
import { InputBoxService } from '../../../../util/services/input-box.service';

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
    private confirmBox:InputBoxService
  ) { 

    const customerSubscription = this.CustomerSelectors.customer$.subscribe((customer) => this.customers = customer);
    this.subscriptions.add(customerSubscription);

    this.customers$ = this.CustomerSelectors.customer$;
    this.inputBoxArray = [["Full Name","M"],["LastName","M"], ["Mobile Number","O"],["Email","O"]];
   
  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();

  }
  
  show(){
    this.confirmBox.openWithCallbacks('CREATE CUSTOMER',this.inputBoxArray, 'save', 'cancel', function(val: boolean){
      if(val){
        console.log(val);
      }
  }, function(){});
  }
  
}
