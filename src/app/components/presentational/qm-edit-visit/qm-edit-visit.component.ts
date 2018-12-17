import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { QueueSelectors, UserSelectors, StaffPoolDispatchers, ServicePointPoolDispatchers, QueueDispatchers, QueueDataService } from '../../../../store';
import { Queue } from '../../../../models/IQueue';
import { Subscription, Observable } from 'rxjs';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { ICustomer } from '../../../../models/ICustomer';
import { Visit } from '../../../../models/IVisit';

@Component({
  selector: 'qm-qm-edit-visit',
  templateUrl: './qm-edit-visit.component.html',
  styleUrls: ['./qm-edit-visit.component.scss']
})
export class QmEditVisitComponent implements OnInit {
  SelectedVisit: Visit
  selectedQueue: Queue;
  userDirection$: Observable<string> = new Observable<string>();
  private subscriptions: Subscription = new Subscription();
  flowType= FLOW_TYPE.EDIT_VIST;
  selectedCustomer: ICustomer;
  currentFlow: string;
  HeaderSelectedVisit: Visit;
  visitFlowActive: boolean;
  queueFlowActive: boolean;
  userDirections: string;

  @Output() Transfer: EventEmitter<any> = new EventEmitter<any>();

  constructor(private queueSelectors: QueueSelectors,
    private QueueDispatchers: QueueDispatchers,
    private userSelectors: UserSelectors,
    private staffPoolDispatchers: StaffPoolDispatchers,
    private servicePointPoolDispatchers: ServicePointPoolDispatchers,
    private queueDispatchers: QueueDispatchers,
    private servicePoolDispatcher: ServicePointPoolDispatchers
  ) { 
    const QueueSelectorSubscription = this.queueSelectors.selectedQueue$.subscribe((queue)=>{
      this.selectedQueue = queue;
    })
    this.subscriptions.add(QueueSelectorSubscription);
    this.userDirection$ = this.userSelectors.userDirection$;

    const userDirectionSubscription = this.userSelectors.userDirection$.subscribe(direction=>{
      this.userDirections = direction;
    });
    this.subscriptions.add(userDirectionSubscription);
    

    const VisitSubscription = this.queueSelectors.selectedVisit$.subscribe((visit)=>{
      this.SelectedVisit=visit;
      this.HeaderSelectedVisit=this.SelectedVisit;
    });
    this.subscriptions.add(VisitSubscription);  
  }

  ngOnInit() {
    if(this.selectedQueue){
      this.showVisitFlow()
      this.queueFlowActive = false;
    }
    else{
      this.queueFlowActive= true;
    }
  }

  queueHeaderClick(){
    this.HeaderSelectedVisit=null;
    this.QueueDispatchers.resetSelectedQueue();
    this.currentFlow=null;
    this.queueDispatchers.resetSelectedQueue();
    this.servicePoolDispatcher.resetServicePointPool();
    this.staffPoolDispatchers.resetStaffPool();
  }

  visitHeaderClick(){
    this.currentFlow=null;
    this.HeaderSelectedVisit=null;
    this.staffPoolDispatchers.resetStaffPool();
    this.servicePointPoolDispatchers.resetServicePointPool();
    this.QueueDispatchers.resetQueueInfo();
  }

  NextFlow(flow){
    this.HeaderSelectedVisit=this.SelectedVisit;
    this.currentFlow = flow;
    this.Transfer.emit(flow);
    
  }

  goBack(){
    this.visitFlowActive = false;
  }

  showVisitFlow(){
    this.visitFlowActive = true;
  }

}
