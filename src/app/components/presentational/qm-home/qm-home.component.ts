import { UserSelectors } from './../../../../store/services/user/user.selectors';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ServicePointSelectors } from 'src/store/services';
import { Subscription, Observable } from 'rxjs';
import { Util } from 'src/util/util';

@Component({
  selector: 'qm-qm-home',
  templateUrl: './qm-home.component.html',
  styleUrls: ['./qm-home.component.scss']
})
export class QmHomeComponent implements OnInit, AfterViewInit
{

  private subscriptions: Subscription = new Subscription();
  isQuickServeEnable: boolean;
  isShowQueueView: boolean;
  userDirection$: Observable<string>;

  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private userSelectors: UserSelectors,
    private util: Util
  ) { 
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params){
        this.isQuickServeEnable = params.quickServe;
        this.isShowQueueView = params.queueView;
      }
    });
    this.subscriptions.add(servicePointsSubscription);
    this.util.setSelectedApplicationTheme();
  }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;   
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
