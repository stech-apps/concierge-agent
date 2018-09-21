import { Component, OnInit, Input, OnDestroy, Output } from '@angular/core';
import { ICustomer } from '../../../../models/ICustomer';
import { Subscription, Observable } from 'rxjs';
import { CustomerDispatchers, CustomerSelector, UserSelectors, ServicePointSelectors } from '../../../../store';
import { CustomerUpdateService } from '../../../../util/services/customer-update.service';
import { Router } from '@angular/router';
import { EventEmitter } from '../../../../../node_modules/protractor';

@Component({
  selector: 'qm-customer-search',
  templateUrl: './qm-customer-search.component.html',
  styleUrls: ['./qm-customer-search.component.scss']
})
export class QmCustomerSearchComponent implements OnInit {

  @Input() myData:string;
  // @Output() isEdit = new EventEmitter
  customersLoading: boolean;
  customerLoading$:Observable<boolean>;
  customerLoaded:boolean;
  customerLoaded$:Observable<boolean>;
  reminingHeight:string='301px';
  height:string="calc(100vh - "+ this.reminingHeight+ ')';
  currentCustomer: ICustomer;
  currentCustomer$: Observable<ICustomer>;
  editCustomers: ICustomer;
  editCustomers$: Observable<ICustomer>;
  
  multiBranchEnabled:boolean=false;
  black:string = "black"


  customers: ICustomer[];
  customers$: Observable<ICustomer[]>
  currentRoute:string;

   private subscriptions : Subscription = new Subscription();
   userDirection$: Observable<string>; 
   inputBoxArray: string[][];


  constructor(
    private CustomerDispatchers: CustomerDispatchers,
    private CustomerSelectors:CustomerSelector,
    private confirmBox:CustomerUpdateService,
    private userSelectors:UserSelectors,
    private servicePointSelectors: ServicePointSelectors,
    private router: Router
  ) { 
    this.userDirection$ = this.userSelectors.userDirection$;
    this.customerLoading$ = this.CustomerSelectors.customerLoading$;
    this.customerLoaded$ = this.CustomerSelectors.customerLoaded$;
    this.currentCustomer$ = this.CustomerSelectors.currentCustomer$;

    
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params){
        this.multiBranchEnabled = params.mltyBrnch;
       // console.log(params);
      }
     
    });
 
    
  }

  ngAfterViewInit(){
   
  }

  ngOnInit() {
    this.currentRoute=this.router.url;
    const currentCustomerSubscription = this.CustomerSelectors.currentCustomer$.subscribe((customer) => {this.currentCustomer = customer;
    if(this.currentRoute=="/home/create-appointment" && this.currentCustomer && this.multiBranchEnabled){
      this.reminingHeight='344px';
      this.height="calc(100vh - "+ this.reminingHeight+ ')';
    } else if(this.currentRoute=="/home/create-appointment" && !this.currentCustomer && this.multiBranchEnabled){
      this.reminingHeight='301px';
      this.height="calc(100vh - "+ this.reminingHeight+ ')';
    } else if(this.currentRoute=="/home/create-appointment" && !this.currentCustomer && !this.multiBranchEnabled){
      this.reminingHeight='257px';
      this.height="calc(100vh - "+ this.reminingHeight+ ')';
    } else if( this.currentRoute=="/home/create-appointment" && this.currentCustomer && !this.multiBranchEnabled){
      this.reminingHeight='294px';
      this.height="calc(100vh - "+ this.reminingHeight+ ')';
    }  else if(this.currentRoute=="/home/create-visit" && this.currentCustomer){
      this.reminingHeight='252px';
      this.height="calc(100vh - "+ this.reminingHeight+ ')';
    } else if(this.currentRoute=="/home/create-visit" && !this.currentCustomer){
      this.reminingHeight='211px';
      this.height="calc(100vh - "+ this.reminingHeight+ ')';
    }


  
  }
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
    this.CustomerDispatchers.editCustomers(customer);
    //console.log(customer);
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
