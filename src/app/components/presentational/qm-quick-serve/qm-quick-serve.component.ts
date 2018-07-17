import { IService } from './../../../../models/IService';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServiceSelectors, ServiceDispatchers, BranchSelectors } from '../../../../../src/store';
import { IBranch } from '../../../../models/IBranch';

@Component({
  selector: 'qm-quick-serve',
  templateUrl: './qm-quick-serve.component.html',
  styleUrls: ['./qm-quick-serve.component.scss']
})
export class QmQuickServeComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  private services: IService[] = new Array<IService>();
  private selectedService: IService;

  constructor(
    private serviceSelectors: ServiceSelectors,
    private branchSelectors: BranchSelectors,
    private serviceDispatchers: ServiceDispatchers
  ){
    const serviceSubscription = this.serviceSelectors.services$.subscribe((services) => {
      this.services = services
      console.log(services);
    });
    this.subscriptions.add(serviceSubscription);

    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((branch) => {
      if(branch){
        this.serviceDispatchers.fetchServices(branch);
      }
    });
    this.subscriptions.add(branchSubscription);
  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onServiceSelect(selectedService: IService) {
    this.selectedService = selectedService;

  }

  onServe() {

  }
}
