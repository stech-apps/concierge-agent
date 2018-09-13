import { QueueIndicator } from './../../../../util/services/queue-indication.helper';
import { Subscription } from 'rxjs';
import { Queue } from './../../../../models/IQueue';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueueSelectors, QueueDispatchers, BranchSelectors } from 'src/store';
import { IBranch } from '../../../../models/IBranch';
import { QueueService } from '../../../../util/services/queue.service';
import { Router } from '@angular/router';

@Component({
  selector: 'qm-queue-list',
  templateUrl: './qm-queue-list.component.html',
  styleUrls: ['./qm-queue-list.component.scss']
})
export class QmQueueListComponent implements OnInit, OnDestroy {

  queueCollection = new Array<Queue>();

  private subscriptions: Subscription = new Subscription();
  private selectedBranch: IBranch;
  sortAscending = true;

  constructor(
    private queueSelectors: QueueSelectors,
    private queueDispatchers: QueueDispatchers,
    private branchSelectors: BranchSelectors,
    public queueIndicator: QueueIndicator,
    private queueService: QueueService,
    private router:Router
  ) {
    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((branch) => {
      if (branch) {
        this.selectedBranch = branch;
        this.queueDispatchers.fetchQueueInfo(branch.id);
        this.queueService.setQueuePoll();
      }
    });
    this.subscriptions.add(branchSubscription);
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

  selectQueue(q){
    this.queueDispatchers.setectQueue(q);
    this.queueService.stopQueuePoll();
      this.router.navigate(['home/edit-visit']);
  }

}
