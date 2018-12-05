import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Queue } from '../../../../models/IQueue';
import { Subscription, Observable, Subject } from 'rxjs';
import { IBranch } from '../../../../models/IBranch';
import { QueueSelectors, QueueDispatchers, BranchSelectors, UserSelectors, ServicePointSelectors,
            InfoMsgDispatchers, DataServiceError } from '../../../../store';
import { QueueIndicator } from '../../../../util/services/queue-indication.helper';
import { QueueService } from '../../../../util/services/queue.service';
import { Visit } from '../../../../models/IVisit';
import { QmModalService } from '../qm-modal/qm-modal.service';
import { TranslateService } from '@ngx-translate/core';
import { SPService } from '../../../../util/services/rest/sp.service';
import { IServicePoint } from '../../../../models/IServicePoint';
import { Router } from '@angular/router';
import { queue } from 'rxjs/internal/scheduler/queue';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DEBOUNCE_TIME } from './../../../../constants/config';
import { ToastService } from './../../../../util/services/toast.service';
import { ERROR_STATUS, Q_ERROR_CODE } from '../../../../util/q-error';

@Component({
  selector: 'qm-trasfer-to-queue',
  templateUrl: './qm-trasfer-to-queue.component.html',
  styleUrls: ['./qm-trasfer-to-queue.component.scss']
})
export class QmTrasferToQueueComponent implements OnInit {

  queueCollection = new Array<Queue>();
  searchText: String;
  private subscriptions: Subscription = new Subscription();
  private selectedBranch: IBranch;
  sortAscending = true;
  userDirection$: Observable<string>;
  selectedVisit: Visit;
  DropDownselectedQueue: Queue;
  btnTransferFirst: boolean;
  btnTransferLast: boolean;
  btnTransferSort: boolean;
  selectedServicePoint: IServicePoint;
  sortedBy: string = 'Queue';
  inputChanged: Subject<string> = new Subject<string>();
  filterText: string = '';
  queueSearched: boolean;
  selectedQueue: Queue;
  showEstWaitTime: boolean;

  constructor(
    private queueSelectors: QueueSelectors,
    private queueDispatchers: QueueDispatchers,
    private branchSelectors: BranchSelectors,
    public queueIndicator: QueueIndicator,
    private queueService: QueueService,
    private userSelectors: UserSelectors,
    private servicePointSelectors: ServicePointSelectors,
    private qmModalService: QmModalService,
    private translateService: TranslateService,
    private spService: SPService,
    private router: Router,
    private toastService: ToastService,
    private infoMsgBoxDispatcher: InfoMsgDispatchers,
  ) {    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((branch) => {
    if (branch) {
      this.selectedBranch = branch;
      this.queueDispatchers.fetchQueueInfo(branch.id);
      this.queueService.setQueuePoll();
  }
});
this.subscriptions.add(branchSubscription);
this.userDirection$ = this.userSelectors.userDirection$;

const visitSubscription = this.queueSelectors.selectedVisit$.subscribe((visit) => {
  this.selectedVisit = visit;
})
this.subscriptions.add(visitSubscription);

const uttpSubscriptions =  this.servicePointSelectors.uttParameters$.subscribe((uttpParams) => {
  if (uttpParams){

    this.btnTransferFirst  = uttpParams.btnTransferFirst;
    this.btnTransferSort  = uttpParams.btnTransferSort;
    this.btnTransferLast  = uttpParams.btnTransferLast;
    this.showEstWaitTime = uttpParams.estWaitTime;
  }
})
this.subscriptions.add(uttpSubscriptions);

const selectedServicePointSubscriptions = this.servicePointSelectors.openServicePoint$.subscribe((sp) => {
  this.selectedServicePoint = sp;
});

this.subscriptions.add(selectedServicePointSubscriptions);

this.inputChanged
    .pipe(distinctUntilChanged(), debounceTime(DEBOUNCE_TIME || 0))
    .subscribe(text => this.filterQueues(text));

}


ngOnInit() {
  const queueListSubscription = this.queueSelectors.queueSummary$.subscribe((qs) => {
    this.queueCollection = qs.queues;
    this.sortQueueList('QUEUE');
  });
  this.subscriptions.add(queueListSubscription);
  if (this.queueCollection.length === 0) {
    this.translateService.get('empty_queues').subscribe(
      (noappointments: string) => {
        this.toastService.infoToast(noappointments);
      }
    ).unsubscribe();
  }
}


ngOnDestroy() {
  this.subscriptions.unsubscribe();
}

onSortClickbyQueue() {
  this.sortAscending = !this.sortAscending;
  this.sortQueueList('QUEUE');
  this.sortedBy = 'Queue';
}

filterQueues(newFilter: string) {
  this.filterText = newFilter;
 }



sortQueueList(type) {
  if (this.queueCollection) {
    // sort by name
    this.queueCollection = this.queueCollection.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
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
selectQueue(q) {
  if (this.DropDownselectedQueue == q){
    this.DropDownselectedQueue = null;
  } else {
  this.DropDownselectedQueue = q;
}
}

OnTransferButtonClick(type){

  if (this.selectedVisit){
    this.translateService.get(this.transferVisitMsgBoxText(type),
    {
      visit: this.selectedVisit.ticketId,
    }).subscribe(
      (label: string) => 
        this.qmModalService.openForTransKeys('', `${label}`, 'yes', 'no', (result) => {
          if (result){
          this.spService.queueTransfer(this.selectedBranch, this.selectedServicePoint, 
              this.DropDownselectedQueue, this.selectedVisit, type).subscribe( result => {
            this.translateService.get('visit_transferred').subscribe((label) => {
              // var successMessage = {
              //   firstLineName: label,
              //   firstLineText:this.selectedVisit.ticketId,
              //   icon: "correct",
              // }
              this.toastService.infoToast(label);
              // this.router.navigate(["/home"]);
            });
          }, error => {
            const err = new DataServiceError(error, null);
            console.log(error);
            
            if (error.errorCode == Q_ERROR_CODE.NO_VISIT) {
              this.translateService.get('requested_visit_not_found').subscribe(v => {
                this.toastService.errorToast(v);
              });
            }
            else if (error.errorCode == Q_ERROR_CODE.SERVED_VISIT) {
              this.translateService.get('requested_visit_not_found').subscribe(v => {
                this.toastService.errorToast(v);
              });
            } else if (err.errorCode === '0') {
              this.translateService.get('request_fail').subscribe(v => {
                this.toastService.errorToast(v);
              });
            }
            else {
              this.translateService.get('request_fail').subscribe(v => {
                this.toastService.errorToast(v);
              });
            }
          }
        )
          
          this.queueDispatchers.resetSelectedQueue();
          this.queueDispatchers.setectVisit(null);
          this.queueDispatchers.resetFetchVisitError();
          this.queueDispatchers.resetQueueInfo();

          }
    }, () => {
    })
    ).unsubscribe()
  
  } 
}

transferVisitMsgBoxText(type){
  if (type == "FIRST"){
    return 'transfer_visit_first_in_line_confirm_box';  
  } else if (type == "SORTED"){
    return 'transfer_visit_sorted_in_line_confirm_box';
  } else {
    return 'transfer_visit_last_in_line_confirm_box';
  }
  
}



handleInput($event) {
  this.queueSearched = true;
  this.inputChanged.next($event.target.value);
}

clearSearchText() {
  this.filterText = "";
}
  
}
