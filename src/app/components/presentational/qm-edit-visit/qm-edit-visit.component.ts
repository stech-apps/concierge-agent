import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { QueueSelectors, UserSelectors, QueueDispatchers } from '../../../../store';
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
  SelectedVisit:Visit
  selectedQueue:Queue;
  userDirection$: Observable<string> = new Observable<string>();
  private subscriptions: Subscription = new Subscription();
  flowType= FLOW_TYPE.EDIT_VIST;
  selectedCustomer: ICustomer;
  currentFlow:string;
  HeaderSelectedVisit:Visit;

  @Output() Transfer: EventEmitter<any> = new EventEmitter<any>();

  constructor(private queueSelectors:QueueSelectors,
    private QueueDispatchers:QueueDispatchers,
    private userSelectors: UserSelectors,
  ) { 
    const QueueSelectorSubscription = this.queueSelectors.selectedQueue$.subscribe((queue)=>{
      this.selectedQueue = queue;
    })
    this.subscriptions.add(QueueSelectorSubscription);
    this.userDirection$ = this.userSelectors.userDirection$;

    const VisitSubscription = this.queueSelectors.selectedVisit$.subscribe((visit)=>{
      this.SelectedVisit=visit;
      this.HeaderSelectedVisit=this.SelectedVisit;
    });
    this.subscriptions.add(VisitSubscription);  
  }

  ngOnInit() {
    
  }

  queueHeaderClick(){
    this.HeaderSelectedVisit=null;
    this.QueueDispatchers.resetSelectedQueue();
    this.currentFlow=null;

  }

  visitHeaderClick(){
    this.currentFlow=null;
    this.HeaderSelectedVisit=null;
  }

  NextFlow(flow){
    this.HeaderSelectedVisit=this.SelectedVisit;
    this.currentFlow = flow;
    this.Transfer.emit(flow);
    
  }

 

}
