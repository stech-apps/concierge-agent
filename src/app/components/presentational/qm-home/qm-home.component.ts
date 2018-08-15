import { UserSelectors } from './../../../../store/services/user/user.selectors';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ServicePointSelectors, CustomerSelector } from 'src/store/services';
import { Subscription, Observable } from 'rxjs';
import { Util } from 'src/util/util';
import { IMessageBox } from '../../../../models/IMessageBox';
import { InfoMsgDispatchers } from '../../../../store/services/Infomation-message-box/info-msg-box.dispatchers';
import { InfoMsgBoxSelector } from '../../../../store/services/Infomation-message-box/info-msg-box.selectors';

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
  MessageBoxInfo:IMessageBox;
  MessageBoxInfo$:Observable<IMessageBox>;
  SampleValue:IMessageBox;
  

  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private userSelectors: UserSelectors,
    private util: Util,
    private InfoMsgBoxSelectors:InfoMsgBoxSelector,
    private InfoMsgBoxDispatcher:InfoMsgDispatchers
    
  ) { 
    this.MessageBoxInfo$=this.InfoMsgBoxSelectors.InfoMsgBoxInfo$;   
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
    const MsgBoxSubscription = this.InfoMsgBoxSelectors.InfoMsgBoxInfo$.subscribe((info) => {
      this.MessageBoxInfo = info;
    });
  this.subscriptions.add(MsgBoxSubscription);

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


}
