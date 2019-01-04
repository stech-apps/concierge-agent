import { QmModalService } from './../../presentational/qm-modal/qm-modal.service';
import { Util } from './../../../../util/util';
import { Router } from '@angular/router';
import { Component, OnInit, ContentChildren, AfterContentInit, Input, Output, EventEmitter } from '@angular/core';
import { QmFlowPanelComponent } from 'src/app/components/containers/qm-flow-panel/qm-flow-panel.component';
import { QueryList } from '@angular/core';
import { HostBinding } from '@angular/core';
import { Recycle } from '../../../../util/services/recycle.service';
import { QueueService } from '../../../../util/services/queue.service';
import { TimeslotDispatchers, AccountDispatchers, UserSelectors, ServicePointSelectors } from '../../../../store';
import { LocalStorage, STORAGE_SUB_KEY } from '../../../../util/local-storage';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'qm-flow',
  templateUrl: './qm-flow.component.html',
  styleUrls: ['./qm-flow.component.scss'],
  host: { 'class': 'qm-flow-component-root animated slideInUp faster' }
})
export class QmFlowComponent implements OnInit,AfterContentInit {
  activeHeader:number;
  public isFlowSkip = true;
  userDirection$: Observable<string>;
  private subscriptions: Subscription = new Subscription();
  @Input() FlowName: string;  
  @Output() headerClicked = new EventEmitter<QmFlowPanelComponent>();
  @Output() onFlowExitInvoked = new EventEmitter();
  mltyBrnch:boolean;

  constructor(
    private router: Router,
    private qmModalService: QmModalService,
    private recycleService: Recycle,
    private queueService: QueueService,
    private timeSlotDispatchers:TimeslotDispatchers,
    private AccountDispatchers:AccountDispatchers,
    private localStorage: LocalStorage,
    private userSelectors: UserSelectors,
    private servicePointSelectors:ServicePointSelectors
  ) {

    this.activeHeader = 0;
    this.isFlowSkip = localStorage.getSettingForKey(STORAGE_SUB_KEY.BRANCH_SKIP);
    
    const uttSubscription = this.servicePointSelectors.uttParameters$
      .subscribe(uttParameters => {
        if (uttParameters) {
         this.mltyBrnch = uttParameters.mltyBrnch;
        }
      })
      .unsubscribe();
    this.subscriptions.add(uttSubscription);
   }

  @HostBinding('class.slideOutDown') exitFlow: boolean = false;

  @ContentChildren(QmFlowPanelComponent)
  flowPanels = new QueryList<QmFlowPanelComponent>();

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;   
  }
  ngAfterContentInit(){
    if(this.FlowName=='create_appointment' && (this.isFlowSkip || this.isFlowSkip==undefined) &&  this.mltyBrnch){
      this.activeHeader = 1;
    }    
  }

  panelHeaderClick(flowPanel: QmFlowPanelComponent) {
    this.headerClicked.emit(flowPanel);
    // let panelFound = false;
    // if (flowPanel.isContentVisible && flowPanel.hasResult()) {
    //   let panelArray = this.flowPanels.toArray();
    //   let panelIndex = panelArray.indexOf(flowPanel);
    //   let nextPanel = panelArray[++panelIndex];
    //   this.onFlowNext(nextPanel);
    //   return;
    // }

    // this.flowPanels.forEach(fp => {
    //   if (fp.id == flowPanel.id) {
    //     fp.isActive = true;
    //     fp.isContentVisible = true;
    //       fp.isHeaderVisible = true;
    //     panelFound = true;
    //   }
    //   else {
    //     fp.isActive = false;
    //     //hide the next panels
    //     if (panelFound) {
    //       fp.isContentVisible = false;
    //       fp.isHeaderVisible = false;
    //     }
    //   }
    // });
  }

  
  onFlowExit(result?: any) {
    this.AccountDispatchers.setMenuItemStatus(true);
   if (result) {
      this.exitFlow = true;
      this.recycleService.clearCache();
      this.queueService.setQueuePoll();
      setTimeout(() => {
        this.AccountDispatchers.setMenuItemStatus(false);
        if(this.router.url!="/profile"){
        this.router.navigate(['home']);
        }
      }, 1000);
    }
    else {
      this.qmModalService.openForTransKeys('', 'msg_cancel_task', 'yes', 'no', (result) => {
        if (result) {
          this.timeSlotDispatchers.deselectTimeslot();
          this.exitFlow = true;
          this.recycleService.clearCache();
          this.queueService.setQueuePoll();
          this.queueService.fetechQueueInfo();
          this.onFlowExitInvoked.emit();
          
          setTimeout(() => {
            this.AccountDispatchers.setMenuItemStatus(false);
            if(this.router.url!="/profile"){
            this.router.navigate(['home']);
            }
          }, 1000);
        }
      }, () => {

      });
    }
  }

  goToPanelByIndex(panelIndex: number) {
    this.activeHeader = panelIndex;
    this.onFlowNext(this.flowPanels.toArray()[panelIndex]);
  }

  onFlowNext(panel: QmFlowPanelComponent) {
    let panelsCollection = this.flowPanels.toArray();
    let panelIndex = panelsCollection.indexOf(panel);
    this.activeHeader=panelIndex;
    this.flowPanels.forEach((fp, index) => {
      fp.isActive = false;
      fp.isContentVisible = false;

      if (!fp.headerVisibilityOverridden && index < panelIndex) {
        fp.isHeaderVisible = true;
      }
    });

    panel.isActive = true;
    panel.isContentVisible = true;
    panel.isHeaderVisible = true;
  }

  
headerItemClicked(n){
  
  if(n<this.activeHeader){
    this.onFlowNext(this.flowPanels.toArray()[n]);
    this.activeHeader = n;
  }
  
}

test(){
  console.log(this.flowPanels.toArray()[0].index);
}
}

