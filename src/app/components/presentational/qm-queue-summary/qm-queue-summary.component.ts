import { UserSelectors } from './../../../../store/services/user/user.selectors';
import { QueueSelectors } from 'src/store';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

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

  constructor(
    private queueSelectors: QueueSelectors,
    private userSelectors: UserSelectors
  ) {
    const queueSubscription = this.queueSelectors.queueSummary$.subscribe((qs) => {
      this.queueSummary = qs;
    });

    this.subscriptions.add(queueSubscription);
  }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
