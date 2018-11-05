import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SystemInfoSelectors } from 'src/store';

@Component({
  selector: 'qm-timelist-sidebar',
  templateUrl: './qm-timelist-sidebar.component.html',
  styleUrls: ['./qm-timelist-sidebar.component.scss']
})
export class QmTimelistSidebarComponent implements OnInit {

  private timeConvention$: Observable<string>;
  public timeConvention: string;
  private subscriptions: Subscription = new Subscription();

  @Output()
  optionClicked = new EventEmitter();

  constructor(private systemInfoSelectors: SystemInfoSelectors ) {
    this.timeConvention$ = this.systemInfoSelectors.timeConvention$
   }

  ngOnInit() {
    const timeConventionSubscription = this.timeConvention$.subscribe(
      timeConvention => this.timeConvention = timeConvention
    );

    this.subscriptions.add(timeConventionSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  handleClick($event) {
    this.optionClicked.emit($event);
  }
}
