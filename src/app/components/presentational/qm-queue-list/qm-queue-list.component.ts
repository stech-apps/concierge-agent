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
  sortedBy:string

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
    this.sortedBy = "Queue"
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
      this.sortQueueList("Queue");
    })
    this.subscriptions.add(queueListSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSortClickbyQueue() {
    this.sortAscending = !this.sortAscending;
    this.sortQueueList("QUEUE");
    this.sortedBy = "Queue";    
  }
  onSortClickbyWaitingCustomers(){
  
    this.sortedBy = "WaitingCustomers";
    this.sortQueueList("WAITCUSTOMERS");
    this.sortAscending = !this.sortAscending;
  }
  onSortClickbyMaxWaitTime(){
    this.sortedBy = "MaxWaitTime";
    this.sortQueueList("MAXWAITTIME");
    this.sortAscending = !this.sortAscending;
  }

  sortQueueList(type) {
    if (this.queueCollection) {
      // sort by name
      this.queueCollection = this.queueCollection.sort((a, b) => {
        if(type=="QUEUE" || type == "MAXWAITTIME"|| type== "ESTWAITTIME"){
            if(type=="QUEUE"){
              var nameA = a.queue.toUpperCase(); // ignore upper and lowercase
              var nameB = b.queue.toUpperCase(); // ignore upper and lowercase
             } else if (type == "MAXWAITTIME"){
              var nameA = a.max_w_time=="-"? "0":a.max_w_time;
              var nameB = b.max_w_time=="-"? "0":b.max_w_time;
             }else{
              var nameA = a.est_w_time=="-"? "0":a.est_w_time;
              var nameB = b.est_w_time=="-"? "0":b.est_w_time;;
             }
  
              if ((nameA < nameB && this.sortAscending) || (nameA > nameB && !this.sortAscending) ) {
                return -1;
              }
              if ((nameA > nameB && this.sortAscending) || (nameA < nameB && !this.sortAscending)) {
                return 1;
              }
              // names must be equal
              return 0;
        } else if(type=="WAITCUSTOMERS"){
                var NumA = a.customers;
                var NumB = b.customers; 
              if ((NumA < NumB && this.sortAscending) || (NumA > NumB && !this.sortAscending) ) {
                return -1;
              }
              if ((NumA > NumB && this.sortAscending) || (NumA < NumB && !this.sortAscending)) {
                return 1;
              }
              // names must be equal
              return 0;
        }
      
        
      });
    }
  
  }

  selectQueue(q){
    this.queueDispatchers.setectQueue(q);
    this.queueService.stopQueuePoll();
      this.router.navigate(['home/edit-visit']);
  }

}
