import { Component, OnInit } from '@angular/core';
import { QueueSelectors, UserSelectors, QueueDispatchers } from '../../../../store';
import { Queue } from '../../../../models/IQueue';
import { Subscription, Observable } from 'rxjs';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { ICustomer } from '../../../../models/ICustomer';

@Component({
  selector: 'qm-qm-edit-visit',
  templateUrl: './qm-edit-visit.component.html',
  styleUrls: ['./qm-edit-visit.component.scss']
})
export class QmEditVisitComponent implements OnInit {
  selectedQueue:Queue;
  userDirection$: Observable<string> = new Observable<string>();
  private subscriptions: Subscription = new Subscription();
  flowType= FLOW_TYPE.EDIT_VIST;
  selectedCustomer: ICustomer;

  constructor(private queueSelectors:QueueSelectors,
    private QueueDispatchers:QueueDispatchers,
    private userSelectors: UserSelectors
  ) { 
    const QueueSelectorSubscription = this.queueSelectors.selectedQueue$.subscribe((queue)=>{
      this.selectedQueue = queue;
      
    })
    this.subscriptions.add(QueueSelectorSubscription);
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngOnInit() {
  }

  headerClick(){
    this.QueueDispatchers.resetSelectedQueue();
  }

  branchHeaderClick(){}

}
