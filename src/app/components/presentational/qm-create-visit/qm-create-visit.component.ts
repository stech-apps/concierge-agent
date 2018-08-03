import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicePointSelectors, ServiceSelectors } from 'src/store/services';
import { Subscription } from 'rxjs';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { IService } from '../../../../models/IService';

@Component({
  selector: 'qm-qm-create-visit',
  templateUrl: './qm-create-visit.component.html',
  styleUrls: ['./qm-create-visit.component.scss']
})
export class QmCreateVisitComponent implements OnInit {

  @ViewChild('f') f: any;
  @ViewChild('pa') pa: any;
  @ViewChild('ps') ps: any;

  private subscriptions: Subscription = new Subscription();
  isCustomerFlowHidden: boolean;
  flowType = FLOW_TYPE.CREATE_VISIT;
  selectedServices: IService[];

  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private serviceSelectors: ServiceSelectors
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
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setPanelClick(){
    if(this.isCustomerFlowHidden){
      this.f.onFlowNext(this.pa);
    }
    else{
      this.f.onFlowNext(this.ps);
    }
  }
}
