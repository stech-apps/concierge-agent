import { Subscription } from 'rxjs';
import { Queue } from './../../../../models/IQueue';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueueSelectors } from 'src/store';

@Component({
  selector: 'qm-queue-list',
  templateUrl: './qm-queue-list.component.html',
  styleUrls: ['./qm-queue-list.component.scss']
})
export class QmQueueListComponent implements OnInit, OnDestroy {

  queueCollection = new Array<Queue>();

  private subscriptions: Subscription = new Subscription();

  constructor(private queueSelectors: QueueSelectors) { }

  ngOnInit() {
    const queueListSubscription = this.queueSelectors.queueSummary$.subscribe((qs)=> {
      this.queueCollection = qs.queues;
    })

    this.subscriptions.add(queueListSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
