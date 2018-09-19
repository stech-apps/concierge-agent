import { trigger, style, state, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalNotifySelectors } from 'src/store/services/global-notify';


@Component({
  selector: 'qm-global-error',
  templateUrl: './qm-global-error.component.html',
  styleUrls: ['./qm-global-error.component.scss'],
  animations: [trigger('messageState', [
    state('initial', style({
      'background': 'none'
    })),
    state('shown', style({
      'background': '#e74c3c'
    })),
    transition('initial => shown', animate('1000ms ease-out')),
  ])]
})
export class QmGlobalErrorComponent implements OnInit, OnDestroy {

  constructor(private globalNotifySelectors: GlobalNotifySelectors) { }
  private subscriptions: Subscription = new Subscription();
  messageAnimationState: string = 'initial';
  globalError: any;
  globalWarning: any;

  ngOnInit() {
    const globalNotifySubscription = this.globalNotifySelectors.error$.subscribe((err) => {
      this.globalError = err;
    });

    const globalWarningSubscription = this.globalNotifySelectors.warning$.subscribe((war) => {
      this.globalWarning = war;
    });

    this.subscriptions.add(globalNotifySubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
