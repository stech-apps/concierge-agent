import { Injectable } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IBranch } from '../../models/IBranch';
import { Subscription } from 'rxjs';
import { QueueDispatchers, BranchSelectors, ServicePointSelectors } from '../../store';


@Injectable()
export class QueueService {
  private subscriptions: Subscription = new Subscription();
  private queuePoll = null;
  private selectedBranch: IBranch;
  private queuePollIntervl = 60;
  private isShowQueueView: boolean;

  constructor(
    private queueDispatchers: QueueDispatchers,
    private branchSelectors: BranchSelectors,
    private servicePointSelectors: ServicePointSelectors
  ) {
    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((branch) => {
        if (branch && branch.id!=-1) {
          this.selectedBranch = branch;
          this.queueDispatchers.fetchQueueInfo(branch.id);
          this.setQueuePoll();
        }
      });
      this.subscriptions.add(branchSubscription);
      const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
        if(params){
          this.isShowQueueView = params.queueView;
        }
      });
      this.subscriptions.add(servicePointsSubscription);
  }

  ngOnDestroy() {
    if (this.queuePoll) {
      clearInterval(this.queuePoll);
    }
    this.subscriptions.unsubscribe();
  }

  setQueuePoll() {
    if(this.isShowQueueView){
      if (this.queuePoll) {
        clearInterval(this.queuePoll);
      }
      this.queuePoll = setInterval(() => {
        this.queueDispatchers.fetchQueueInfo(this.selectedBranch.id);
      }, this.queuePollIntervl * 1000);
    }
  }

  stopQueuePoll() {
    if (this.queuePoll) {
        clearInterval(this.queuePoll);
      }
  }
  fetechQueueInfo(){
    this.queueDispatchers.fetchQueueInfo(this.selectedBranch.id);
  }
}