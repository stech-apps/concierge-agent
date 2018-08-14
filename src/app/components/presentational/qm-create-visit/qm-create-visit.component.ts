import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicePointSelectors, ServiceSelectors, CustomerSelector } from 'src/store/services';
import { Subscription } from 'rxjs';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { IService } from '../../../../models/IService';
import { ICustomer } from '../../../../models/ICustomer';

@Component({
  selector: 'qm-qm-create-visit',
  templateUrl: './qm-create-visit.component.html',
  styleUrls: ['./qm-create-visit.component.scss']
})
export class QmCreateVisitComponent implements OnInit {

  @ViewChild('f') f: any;
  @ViewChild('pc') pc: any;
  @ViewChild('px') px: any;
  @ViewChild('pb') pb: any;

  private subscriptions: Subscription = new Subscription();
  isCustomerFlowHidden: boolean;
  flowType = FLOW_TYPE.CREATE_VISIT;
  selectedServices: IService[];
  currentCustomer: ICustomer;

  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private serviceSelectors: ServiceSelectors,
    private customerSelectors: CustomerSelector
  ) {
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params !== null && params !== undefined){
        this.isCustomerFlowHidden = params.hideCustomer;
      }
    });
    this.subscriptions.add(servicePointsSubscription);

    const servicesSubscription = this.serviceSelectors.selectedServices$.subscribe((services) => {
      if(services !== null){
        this.selectedServices = services;
      }
    });
    this.subscriptions.add(servicesSubscription);

    const customerSubscription = this.customerSelectors.currentCustomer$.subscribe((customer) => {
      if(customer){
        this.currentCustomer = customer;
      }
    });
    this.subscriptions.add(customerSubscription);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setPanelClick(){
    if(this.isCustomerFlowHidden){
      this.f.onFlowNext(this.px);
    }
    else{
      this.f.onFlowNext(this.pc);
    }
  }
}
