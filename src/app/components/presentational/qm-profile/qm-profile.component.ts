import { IServicePoint } from './../../../../models/IServicePoint';
import { IService } from './../../../../models/IService';
import { IDropDownItem } from './../../../../models/IDropDownItem';
import { IBranch } from './../../../../models/IBranch';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BranchSelectors, ServiceSelectors, ServicePointSelectors, ServicePointDispatchers } from '../../../../../src/store';
import { QEvents } from 'src/services/qevents/qevents.service'

@Component({
  selector: 'qm-profile',
  templateUrl: './qm-profile.component.html',
  styleUrls: ['./qm-profile.component.scss']
})
export class QmProfileComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  branches: IBranch[] = new Array<IBranch>();
  servicePoints: IServicePoint[] = new Array<IServicePoint>();

  constructor(private branchSelectors: BranchSelectors, private servicePointSelectors: ServicePointSelectors,
              private ServicePointDispatchers: ServicePointDispatchers, public qevents: QEvents) { 
    
  }

  ngOnInit() {
    const branchSubscription = this.branchSelectors.branches$.subscribe((bs) => this.branches = bs);
    this.subscriptions.add(branchSubscription);

    const servicePointsSubscription = this.servicePointSelectors.servicePoints$.subscribe((sps) => this.servicePoints = sps);
    this.subscriptions.add(servicePointsSubscription);
  }

  subscribeCometD(){
    this.qevents.initializeCometD(this.qevents);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onBranchSelect(selectedBranch: IBranch) {
    this.ServicePointDispatchers.fetchServicePointsByBranch(selectedBranch.id);
  }
}
