import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { Queue } from '../../../../models/IQueue';
import { Subscription, Observable } from 'rxjs';
import { IBranch } from '../../../../models/IBranch';
import { QueueSelectors, QueueDispatchers, BranchSelectors, UserSelectors, NativeApiSelectors } from '../../../../store';
import { QueueIndicator } from '../../../../util/services/queue-indication.helper';
import { QueueService } from '../../../../util/services/queue.service';
import { Visit } from '../../../../models/IVisit';
import { ToastService } from '../../../../util/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { NativeApiService } from '../../../../util/services/native-api.service';


@Component({
  selector: 'qm-identify-queue',
  templateUrl: './qm-identify-queue.component.html',
  styleUrls: ['./qm-identify-queue.component.scss']
})
export class QmIdentifyQueueComponent implements OnInit {
  @Output() onFlowNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() NextFlow: EventEmitter<any> = new EventEmitter<any>();

  @Input() set isVisible(value: boolean) {
   if(value) {
      this.onFlowStepActivated();  
   }
 }

  
  queueCollection = new Array<Queue>();
  searchText:String;
  private subscriptions: Subscription = new Subscription();
  private selectedBranch: IBranch;
  sortAscending = true;
  userDirection$: Observable<string>;
  selectedVisit:Visit;
  sortedBy:string = "Queue";
  visitSearched:boolean= false;
  
 

  constructor(
    private queueSelectors: QueueSelectors,
    private queueDispatchers: QueueDispatchers,
    private branchSelectors: BranchSelectors,
    public queueIndicator: QueueIndicator,
    private toastService: ToastService,
    private queueService: QueueService,
    private userSelectors: UserSelectors,
    private translateService:TranslateService,
    private nativeApi: NativeApiService,
    private nativeApiSelector: NativeApiSelectors
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

  const qrCodeSubscription = this.nativeApiSelector.qrCode$.subscribe((value) => {
    if(value != null){
      this.queueDispatchers.fetchSelectedVisit(this.selectedBranch.id, value);
    }
  });
  this.subscriptions.add(qrCodeSubscription);

  const qrCodeScannerSubscription = this.nativeApiSelector.qrCodeScannerState$.subscribe((value) => {
    if(value === false){
      
    }
  });
  this.subscriptions.add(qrCodeScannerSubscription);

  const visitSubscription = this.queueSelectors.selectedVisit$.subscribe((visit)=>{
    this.selectedVisit = visit;
    if(this.selectedVisit){
        this.onFlowNext.emit();
    }

  })
  this.subscriptions.add(visitSubscription)
}

ngOnInit() {
  const queueListSubscription = this.queueSelectors.queueSummary$.subscribe((qs) => {
    this.queueCollection = qs.queues;
    this.sortQueueList("QUEUE");
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


onFlowStepActivated(){
 this.searchText = "";
}

onQRCodeSelect(){
  this.nativeApi.openQRScanner();
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



keyDownFunction(visitSearchText) {
  if(visitSearchText ==""){
    this.translateService.get('visit_no_entry').subscribe(v => {
      this.toastService.infoToast(v);
    });
  }else if(!this.isAppointmentIdValid(visitSearchText))
  this.translateService.get('visit_invalid_entry').subscribe(v => {
    this.toastService.infoToast(v);
  });
  {
    this.visitSearched=true;
    if(visitSearchText!=""){
      this.queueDispatchers.fetchSelectedVisit(this.selectedBranch.id,visitSearchText.toUpperCase());
    }
  }
  
}

selectQueue(queue){
  this.NextFlow.emit("TRANSFER_TO_STAFF_POOL");
  this.queueDispatchers.setectQueue(queue);
  this.onFlowNext.emit();
  
}

isAppointmentIdValid(val) {
  return /^[0-9a-zA-Z]+$/.test(val);
}

}
