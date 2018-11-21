import { UserSelectors } from './../../../../store/services/user/user.selectors';
import { QueueSelectors, QueueDispatchers, BranchSelectors, QueueVisitsDispatchers } from 'src/store';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Queue } from '../../../../models/IQueue';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../util/services/toast.service';
import { Visit } from '../../../../models/IVisit';

@Component({
  selector: 'qm-queue-summary',
  templateUrl: './qm-queue-summary.component.html',
  styleUrls: ['./qm-queue-summary.component.scss']
})
export class QmQueueSummaryComponent implements OnInit {

  private subscriptions: Subscription = new Subscription();
  isQuickServeEnable: boolean;
  private userDirection$:  Observable<string>;
  public queueSummary: any;
  selectedQueue:Queue;
  searchText: string;
  selectedbranchId: number;
  selectedSpId: number;
  selectedQueueId: number;
  selectedQueueName: string;
  visitSearchText: string;
  selectedVisit:Visit
  isQRReaderOpen:boolean;

  constructor(
    private queueSelectors: QueueSelectors,
    private userSelectors: UserSelectors,
    private queueDispatchers:QueueDispatchers,
    private branchSelectors:BranchSelectors,
    private queueVisitsDispatchers: QueueVisitsDispatchers,
    private translateService: TranslateService,
    private toastService: ToastService,

  
  ) {

    const selectedVisitSubscription = this.queueSelectors.selectedVisit$.subscribe((selectedVisit)=>{
      this.selectedVisit = selectedVisit
    })

    this.subscriptions.add(selectedVisitSubscription);
    

    const queueSubscription = this.queueSelectors.queueSummary$.subscribe((qs) => {
      this.queueSummary = qs;
    });

    this.subscriptions.add(queueSubscription);

    const QueueSelectorSubscription = this.queueSelectors.selectedQueue$.subscribe((queue)=>{
      this.selectedQueue = queue;
    })
    this.subscriptions.add(QueueSelectorSubscription);


    const branchSub = this.branchSelectors.selectedBranch$.subscribe(branch => {
      this.selectedbranchId = branch.id;
    });
    this.subscriptions.add(branchSub);

    const selectedQueueSub = this.queueSelectors.selectedQueue$.subscribe(queue => {
      if (queue) {
        this.selectedQueueId = queue.id;
        this.selectedQueueName = queue.name;
        if (this.selectedbranchId && this.selectedQueueId) {
          this.queueVisitsDispatchers.fetchQueueVisits(this.selectedbranchId, this.selectedQueueId);
        }
      } else {
        this.selectedQueueId = null;
      }
    });
    this.subscriptions.add(selectedQueueSub);

  }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  resetQueue(){
    this.queueDispatchers.resetSelectedQueue();   
    this.queueDispatchers.setectVisit(null); 
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  handleInput($event) {
    if ($event.target.value.length == 0) {
      if (this.selectedbranchId && this.selectedQueueId) {
        this.queueVisitsDispatchers.fetchQueueVisits(this.selectedbranchId, this.selectedQueueId);
      }
    }
  }

  keyDownFunction(event, visitSearchText: string) {
    if (event) {
      this.dismissKeyboard(event);
    }
    this.visitSearchText = visitSearchText;

    if (this.visitSearchText.trim().length == 0) {
      this.translateService.get('visit_no_entry').subscribe(v => {
        this.toastService.infoToast(v);
      });
      return;

    } else if (!this.isAppointmentIdValid(this.visitSearchText.trim())) {
      this.translateService.get('visit_invalid_entry').subscribe(v => {
        this.toastService.infoToast(v);
      });
      return;
    }

    this.queueDispatchers.fetchSelectedVisit(this.selectedbranchId, visitSearchText);

  }

  searchVisit(visitSearchText:string){
    this.visitSearchText = visitSearchText;

    if (this.visitSearchText.trim().length == 0) {
      this.translateService.get('visit_no_entry').subscribe(v => {
        this.toastService.infoToast(v);
      });
      return;

    } else if (!this.isAppointmentIdValid(this.visitSearchText.trim())) {
      this.translateService.get('visit_invalid_entry').subscribe(v => {
        this.toastService.infoToast(v);
      });
      return;
    }

    this.queueDispatchers.fetchSelectedVisit(this.selectedbranchId, visitSearchText);
  }

  dismissKeyboard(event) {
    var elem = event.currentTarget || event.target;
    // #142130605 - Requirement remove keyboard when enter pressed
    elem.blur();
  }

  isAppointmentIdValid(val: string) {
    return /^[0-9a-zA-Z]+$/.test(val);
  }

  SearchQRButtonClick(){
    this.isQRReaderOpen = true;
  }

  closeqr(){
    this.isQRReaderOpen = false;
  }

}
