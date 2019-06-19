import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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

  @Input() 
  public ComponentId: string = '';

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
  // Arrow key functions
  focusFirstElement(ComponentId: string) {
    var focusable = document.getElementById(`${ComponentId}-qm-time-sidebar`).querySelectorAll('button');
    setTimeout(() => {
      if (focusable.length > 0) {
        setTimeout(() => {
          focusable[0].focus();
        }, 10);
      }          
    }, 10);
  }
  KeyarrowUp(i: number, ComponentId: string) {
    if(document.getElementById(`${ComponentId}-sidebar-value-${i-1}`) ){
      document.getElementById(`${ComponentId}-sidebar-value-${i-1}`).focus();
    }
  }
  KeyarrowDown(i: number, ComponentId: string) {
    if(document.getElementById(`${ComponentId}-sidebar-value-${i+1}`) ){
      document.getElementById(`${ComponentId}-sidebar-value-${i+1}`).focus();
    }
  }
  TabToTimeSlots(ComponentId: string) {    
    if(document.getElementById(`${ComponentId}-container`) ){
      setTimeout(() => {
        document.getElementById(`${ComponentId}-container`).focus();
      }, 10);
    }
  }
  onKeydown(event, ComponentId) {
    
    if(event.shiftKey && event.keyCode == 9) {
        if(ComponentId == 'startTime') {
          document.getElementById("qm-date-select-calander").focus();
        } else {
          document.getElementById("startTime-container").focus();
        }
        event.stopPropagation();
        event.preventDefault();        
  
  }
}
}