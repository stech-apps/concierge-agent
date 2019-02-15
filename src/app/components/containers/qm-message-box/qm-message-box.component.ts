import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { IMessageBox } from '../../../../models/IMessageBox';
import { InfoMsgBoxSelector, InfoMsgDispatchers } from '../../../../store';
import { QueueService } from '../../../../util/services/queue.service';

@Component({
  selector: 'qm-message-box',
  templateUrl: './qm-message-box.component.html',
  styleUrls: ['./qm-message-box.component.scss']
})
export class QmMessageBoxComponent implements OnInit {
  private subscriptions: Subscription = new Subscription();
  MessageBoxInfo:IMessageBox;
  MessageBoxInfo$:Observable<IMessageBox>;
  constructor(
    private InfoMsgBoxSelectors:InfoMsgBoxSelector,
    private InfoMsgBoxDispatcher:InfoMsgDispatchers,
    private queueService: QueueService
  ) {

    this.MessageBoxInfo$=this.InfoMsgBoxSelectors.InfoMsgBoxInfo$;   
    const MsgBoxSubscription = this.InfoMsgBoxSelectors.InfoMsgBoxInfo$.subscribe((info) => {
      if(info){
        this.queueService.stopQueuePoll();
      }
      this.MessageBoxInfo = info;
    });
    this.subscriptions.add(MsgBoxSubscription);
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  resetValue(){
    this.InfoMsgBoxDispatcher.resetInfoMsgBoxInfo();
    this.queueService.setQueuePoll();
  }


}
