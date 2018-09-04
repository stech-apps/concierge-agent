import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueueVisitsDispatchers, BranchSelectors, QueueVisitsSelectors } from '../../../../store';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'qm-edit-visit-list',
  templateUrl: './qm-edit-visit-list.component.html',
  styleUrls: ['./qm-edit-visit-list.component.scss']
})
export class QmEditVisitListComponent implements OnInit,OnDestroy {
 
  private subscriptions: Subscription = new Subscription();
selectedbranchId:number;
visits=[];
  constructor(
    private branchSelectors:BranchSelectors,
    private queueVisitsDispatchers:QueueVisitsDispatchers,
    private queueVisitsSelectors:QueueVisitsSelectors
  ) { 

    const branchSub = this.branchSelectors.selectedBranch$.subscribe( branch => {
      this.selectedbranchId = branch.id;
      if(this.selectedbranchId){
        this.queueVisitsDispatchers.fetchQueueVisits(this.selectedbranchId,1);
      }
    });

    this.subscriptions.add(branchSub);


  }

  ngOnInit() {
    this.queueVisitsSelectors.queueVisits$.subscribe( visitList =>{
      this.visits = visitList;
    });

  }

  ngOnDestroy(): void {
   this.subscriptions.unsubscribe();
  }

}
