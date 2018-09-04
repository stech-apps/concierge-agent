import { Component, OnInit } from '@angular/core';
import { Queue } from '../../../../models/IQueue';
import { Subscription, Observable } from 'rxjs';
import { IBranch } from '../../../../models/IBranch';
import { QueueSelectors, QueueDispatchers, BranchSelectors, UserSelectors } from '../../../../store';
import { QueueIndicator } from '../../../../util/services/queue-indication.helper';
import { QueueService } from '../../../../util/services/queue.service';
import { Visit } from '../../../../models/IVisit';

@Component({
  selector: 'qm-identify-queue',
  templateUrl: './qm-identify-queue.component.html',
  styleUrls: ['./qm-identify-queue.component.scss']
})
export class QmIdentifyQueueComponent implements OnInit {
  
  queueCollection = new Array<Queue>();
  searchText:String;
  private subscriptions: Subscription = new Subscription();
  private selectedBranch: IBranch;
  sortAscending = true;
  userDirection$: Observable<string>;
  selectedVisit:Visit

  constructor(
    private queueSelectors: QueueSelectors,
    private queueDispatchers: QueueDispatchers,
    private branchSelectors: BranchSelectors,
    public queueIndicator: QueueIndicator,
    private queueService: QueueService,
    private userSelectors: UserSelectors,
  ) { 
    
    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((branch) => {
      if (branch) {
        this.selectedBranch = branch;
        this.queueDispatchers.fetchQueueInfo(branch.id);
        this.queueService.setQueuePoll();
    }
  });
  this.subscriptions.add(branchSubscription);
  this.userDirection$ = this.userSelectors.userDirection$;   

  const visitSubscription = this.queueSelectors.currentVisit$.subscribe((visit)=>{
    this.selectedVisit = visit;
  })
  this.subscriptions.add(visitSubscription)
}

ngOnInit() {
  const queueListSubscription = this.queueSelectors.queueSummary$.subscribe((qs) => {
    this.queueCollection = qs.queues;
    this.sortQueueList();
  })
  this.subscriptions.add(queueListSubscription);
}

ngOnDestroy() {
  this.subscriptions.unsubscribe();
}

onSortClick() {
  this.sortAscending = !this.sortAscending;
  this.sortQueueList();    
}

sortQueueList() {
  if (this.queueCollection) {
    // sort by name
    this.queueCollection = this.queueCollection.sort((a, b) => {
      var nameA = a.queue.toUpperCase(); // ignore upper and lowercase
      var nameB = b.queue.toUpperCase(); // ignore upper and lowercase
      if ((nameA < nameB && this.sortAscending) || (nameA > nameB && !this.sortAscending) ) {
        return -1;
      }
      if ((nameA > nameB && this.sortAscending) || (nameA < nameB && !this.sortAscending)) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  }

}


keyDownFunction(event,visitSearchText) {
  if(event.keyCode == 13) {
    this.queueDispatchers.fetchSelectedVisit(this.selectedBranch.id,visitSearchText.toUpperCase());
    
    if(this.selectedVisit){
      console.log(this.selectedVisit[0]);
    }

  }
}

}
