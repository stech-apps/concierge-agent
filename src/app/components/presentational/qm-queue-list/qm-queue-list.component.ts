import { QueueIndicator } from './../../../../util/services/queue-indication.helper';
import { Subscription, Observable } from 'rxjs';
import { Queue } from './../../../../models/IQueue';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { QueueSelectors, QueueDispatchers, BranchSelectors, ServicePointSelectors, UserSelectors } from 'src/store';
import { IBranch } from '../../../../models/IBranch';
import { QueueService } from '../../../../util/services/queue.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../util/services/toast.service';
import { NativeApiService } from 'src/util/services/native-api.service';

@Component({
  selector: 'qm-queue-list',
  templateUrl: './qm-queue-list.component.html',
  styleUrls: ['./qm-queue-list.component.scss']
})
export class QmQueueListComponent implements OnInit, OnDestroy {

  queueCollection = new Array<Queue>();
  prvQueueCollection = new Array<Queue>();
  sortedBy: string;

  private subscriptions: Subscription = new Subscription();
  private selectedBranch: IBranch;
  sortAscending = true;
  showEstWaitTime: boolean;
  isQuickServeEnable:boolean;
  canTransferSP: boolean;
  canSendSMS: boolean;
  canTransferQ: boolean;
  canTransferStaff: boolean;
  canTransferQFirst: boolean;
  canTransferQLast: boolean;
  canTransferQWait: boolean;
  canDelete: boolean;
  cancherypick: boolean;
  userDirection$: Observable<string>;
  queueFetchFailed: boolean;
  isNative:boolean;
  editVisitEnable:boolean;
  isFirstTime: boolean;
  updatedQueue: Queue;

  @Input() isCollapesed: string;

  constructor(
    private queueSelectors: QueueSelectors,
    private queueDispatchers: QueueDispatchers,
    private branchSelectors: BranchSelectors,
    public queueIndicator: QueueIndicator,
    private queueService: QueueService,
    private router: Router,
    private servicePointSelectors: ServicePointSelectors,
    private translateService: TranslateService,
    private toastService: ToastService,
    private userSelectors: UserSelectors,
    private queueDispatcher: QueueDispatchers,
    private nativeApi:NativeApiService
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
    this.userDirection$ = this.userSelectors.userDirection$;
    this.isNative = this.nativeApi.isNativeBrowser();
    const uttpSubscriptions = this.servicePointSelectors.uttParameters$.subscribe((uttpParams) => {
      if (uttpParams) {
        this.showEstWaitTime = uttpParams.estWaitTime;
        this.canTransferSP = uttpParams.trServPool;
        this.canSendSMS = uttpParams.sndSMS;
        this.canTransferQ = uttpParams.btnQueueTransfer;
        this.canTransferStaff = uttpParams.trUserPool;
        this.canTransferQFirst = uttpParams.btnTransferFirst;
        this.canTransferQLast = uttpParams.btnTransferLast;
        this.canTransferQWait = uttpParams.btnTransferSort;
        this.canDelete = uttpParams.delVisit;
        this.cancherypick = uttpParams.cherryPick;
        this.editVisitEnable = uttpParams.editVisit;
        this.isQuickServeEnable = uttpParams.quickServe;
      }
    })
    this.subscriptions.add(uttpSubscriptions);

    const queueFetchFailCountSub = this.queueSelectors.queueFetchFailCount$.subscribe((c)=> {
      if(c === 2) {
        this.queueFetchFailed = true;
      }
      else if(c === 0 ) {
        this.queueFetchFailed = false;
      }
    });

    this.subscriptions.add(queueFetchFailCountSub);
  }

  ngOnInit() {
    const queueListSubscription = this.queueSelectors.queueSummary$.subscribe((qs) => {
      const prvList = this.queueCollection;
      this.checkUpdatedQueue();
      this.queueCollection = qs.queues;
      this.sortQueueList("QUEUE");
    })
    this.subscriptions.add(queueListSubscription);
  }

  checkUpdatedQueue () {
    if (this.prvQueueCollection !== undefined && this.prvQueueCollection.length > 0 ) {
      for (let i = 0; i < this.queueCollection.length; i++) {
        if (this.queueCollection[i].customersWaiting !== this.prvQueueCollection[i].customersWaiting) {
          this.updatedQueue = this.queueCollection[i];
          break;
        }
      }
    }
    this.prvQueueCollection = this.queueCollection;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSortClickbyQueue() {
    this.sortAscending = !this.sortAscending;
    this.sortQueueList("QUEUE");
    this.sortedBy = "Queue";
  }
  onSortClickbyWaitingCustomers() {

    this.sortedBy = "WaitingCustomers";
    this.sortQueueList("WAITCUSTOMERS");
    this.sortAscending = !this.sortAscending;
  }
  onSortClickbyMaxWaitTime() {
    this.sortedBy = "MaxWaitTime";
    this.sortQueueList("MAXWAITTIME");
    this.sortAscending = !this.sortAscending;
  }

  sortQueueList(type) {
    if (this.queueCollection) {
      // sort by name
      this.queueCollection = this.queueCollection.slice().sort((a, b) => {
        if (type == "QUEUE" || type == "MAXWAITTIME" || type == "ESTWAITTIME") {
          if (type == "QUEUE") {
            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
          } else if (type == "MAXWAITTIME") {
            var nameA = a.max_w_time == "-" ? "0" : a.max_w_time;
            var nameB = b.max_w_time == "-" ? "0" : b.max_w_time;
          } else {
            var nameA = a.est_w_time == "-" ? "0" : a.est_w_time;
            var nameB = b.est_w_time == "-" ? "0" : b.est_w_time;;
          }

          if ((nameA < nameB && this.sortAscending) || (nameA > nameB && !this.sortAscending)) {
            return -1;
          }
          if ((nameA > nameB && this.sortAscending) || (nameA < nameB && !this.sortAscending)) {
            return 1;
          }
          // names must be equal
          return 0;
        } else if (type == "WAITCUSTOMERS") {
          var NumA = a.customersWaiting;
          var NumB = b.customersWaiting;
          if ((NumA < NumB && this.sortAscending) || (NumA > NumB && !this.sortAscending)) {
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
   // Arrow key functions
   onDownButttonPressed (i: number) {
    if (document.getElementById(`${i+1}-queue-name`)) {
      document.getElementById(`${i+1}-queue-name`).focus();
    }
  }
  onUpButttonPressed (i: number) {
    if (document.getElementById(`${i-1}-queue-name`)) {
      document.getElementById(`${i-1}-queue-name`).focus();
    }
  }

  selectQueue(q) {
    if(this.editVisitEnable){
   
    if (this.canDelete == false && this.canSendSMS == false && this.cancherypick == false && this.canTransferSP == false && this.canTransferStaff == false &&
      (this.canTransferQ == false || (this.canTransferQ == true && this.canTransferQFirst == false && this.canTransferQLast == false && this.canTransferQWait == false))) {
      
    } else {
      this.queueDispatchers.setectQueue(q);
      this.queueService.stopQueuePoll();
      this.queueDispatcher.setectQueueName(null);

    }

  }
  
}

}
