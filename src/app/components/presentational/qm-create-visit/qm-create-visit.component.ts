import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicePointSelectors } from 'src/store/services';
import { Subscription } from 'rxjs';
import { FLOW_TYPE } from '../../../../util/flow-state';

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
  private isCustomerFlowHidden: boolean;
  private flowType = FLOW_TYPE.CREATE_VISIT;

  constructor(
    private servicePointSelectors: ServicePointSelectors
  ) {
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params !== null && params !== undefined){
        this.isCustomerFlowHidden = params.hideCustomer;
      }
    });
    this.subscriptions.add(servicePointsSubscription);
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
