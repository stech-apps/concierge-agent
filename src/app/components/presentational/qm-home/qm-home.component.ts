import { Component, OnInit } from '@angular/core';
import { ServicePointSelectors } from 'src/store/services';
import { Subscription } from 'rxjs';
import { QueueSelectors } from 'src/store';

@Component({
  selector: 'qm-qm-home',
  templateUrl: './qm-home.component.html',
  styleUrls: ['./qm-home.component.scss']
})
export class QmHomeComponent implements OnInit {

  private subscriptions: Subscription = new Subscription();
  isQuickServeEnable: boolean;

  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private queueSelectors: QueueSelectors
  ) { 
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params){
        this.isQuickServeEnable = params.quickServe;
      }
    });
    this.subscriptions.add(servicePointsSubscription);

    const queueSubscription = this.queueSelectors.queueSummary$.subscribe((qs)=> {
      console.log(qs);
    });
    this.subscriptions.add(queueSubscription);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
