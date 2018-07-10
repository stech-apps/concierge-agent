import { IServicePoint } from './../../../../models/IServicePoint';
import { IService } from './../../../../models/IService';
import { IDropDownItem } from './../../../../models/IDropDownItem';
import { IBranch } from './../../../../models/IBranch';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BranchSelectors, ServiceSelectors, ServicePointSelectors, ServicePointDispatchers,
         BranchDispatchers } from '../../../../../src/store';
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
  selectedServicePoint: IServicePoint;
  selectedBranch: IBranch;

  constructor(private branchSelectors: BranchSelectors, private servicePointSelectors: ServicePointSelectors,
    const branchSubscription = this.branchSelectors.branches$.subscribe((bs) => this.branches = bs);
    this.subscriptions.add(branchSubscription);

    const servicePointsSubscription = this.servicePointSelectors.servicePoints$.subscribe((sps) => this.servicePoints = sps);
    this.subscriptions.add(servicePointsSubscription);

    this.branchSelectors.selectedBranch$.subscribe((sb) => this.selectedBranch = sb).unsubscribe();
  }

  subscribeCometD(){
    this.qevents.initializeCometD(this.qevents);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onBranchSelect(selectedBranch: IBranch) {
    if (this.selectedBranch.id != selectedBranch.id) {
      this.ServicePointDispatchers.fetchServicePointsByBranch(selectedBranch.id);
      this.selectedBranch = selectedBranch;
      this.branchDispatchers.selectBranch(selectedBranch);
    }
  }

  onServicePointelect(selectedSp: IServicePoint) {

  }
}
