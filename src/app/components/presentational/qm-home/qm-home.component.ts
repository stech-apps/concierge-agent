import { UserSelectors } from './../../../../store/services/user/user.selectors';
import { Component, OnInit } from '@angular/core';
import { ServicePointSelectors } from 'src/store/services';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'qm-qm-home',
  templateUrl: './qm-home.component.html',
  styleUrls: ['./qm-home.component.scss']
})
export class QmHomeComponent implements OnInit {

  private subscriptions: Subscription = new Subscription();
  isQuickServeEnable: boolean;
  userDirection$: Observable<string>;

  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private userSelectors: UserSelectors
  ) { 
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params){
        this.isQuickServeEnable = params.quickServe;
      }
    });
    this.subscriptions.add(servicePointsSubscription);
  }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
