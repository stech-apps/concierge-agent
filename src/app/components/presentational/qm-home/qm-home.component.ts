import { UserSelectors } from "./../../../../store/services/user/user.selectors";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import {
  ServicePointSelectors,
  BranchDispatchers,
  BranchSelectors,
  QueueSelectors
} from "src/store/services";
import { Subscription, Observable } from "rxjs";
import { Util } from "src/util/util";
import { IMessageBox } from "../../../../models/IMessageBox";
import { InfoMsgDispatchers } from "../../../../store/services/Infomation-message-box/info-msg-box.dispatchers";
import { InfoMsgBoxSelector } from "../../../../store/services/Infomation-message-box/info-msg-box.selectors";
import { IServicePoint } from "../../../../models/IServicePoint";
import { IBranch } from "../../../../models/IBranch";
import { TranslateService } from "@ngx-translate/core";
import { QmModalService } from "../qm-modal/qm-modal.service";
import { Queue } from "../../../../models/IQueue";
import { Visit } from "../../../../models/IVisit";

@Component({
  selector: "qm-qm-home",
  templateUrl: "./qm-home.component.html",
  styleUrls: ["./qm-home.component.scss"]
})
export class QmHomeComponent implements OnInit, AfterViewInit {
  private subscriptions: Subscription = new Subscription();
  isQuickServeEnable: boolean;
  isShowQueueView: boolean;
  userDirection$: Observable<string>;
  MessageBoxInfo: IMessageBox;
  MessageBoxInfo$: Observable<IMessageBox>;
  navServicePoint: IServicePoint;
  SelectedBranch: IBranch;
  previousBranch: IBranch;
  selelctedQueue: Queue;
  selectedVisit : Visit;

  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private userSelectors: UserSelectors,
    private util: Util,
    private InfoMsgBoxSelectors: InfoMsgBoxSelector,
    private InfoMsgBoxDispatcher: InfoMsgDispatchers,
    private branchDispatchers: BranchDispatchers,
    private branchSelectors: BranchSelectors,
    private qmModalService: QmModalService,
    private translationService: TranslateService,
    private queueSelectors:QueueSelectors
  ) {
    this.MessageBoxInfo$ = this.InfoMsgBoxSelectors.InfoMsgBoxInfo$;
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe(
      params => {
        if (params) {
          this.isQuickServeEnable = params.quickServe;
          this.isShowQueueView = params.queueView;
        }
      }
    );
    this.subscriptions.add(servicePointsSubscription);
    this.util.setSelectedApplicationTheme();

    const queueSubscription = this.queueSelectors.selectedQueue$.subscribe(q=>{
      this.selelctedQueue = q;
    })
    this.subscriptions.add(queueSubscription);

    const selectedVisitSubscription = this.queueSelectors.selectedVisit$.subscribe((selectedVisit)=>{
      this.selectedVisit = selectedVisit
    })
    this.subscriptions.add(selectedVisitSubscription);
  }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
    const MsgBoxSubscription = this.InfoMsgBoxSelectors.InfoMsgBoxInfo$.subscribe(
      info => {

        if(info && info.heading) {
            this.showDoneModal(info);
        }
        else {
          this.MessageBoxInfo = info;
        }
      }
    );
    this.subscriptions.add(MsgBoxSubscription);
    const navServiceSubscription = this.servicePointSelectors.previousServicePoint$.subscribe(
      spo => {
        this.navServicePoint = spo;
      }
    );
    this.subscriptions.add(navServiceSubscription);
  }

  showDoneModal(info: IMessageBox) {
    this.translationService
    .get([info.heading,
    info.subheading], info.dynamicTransKeys)
    .subscribe(v => {
      this.qmModalService.openDoneModal(v[info.heading],
      v[info.subheading], info.fieldList, null, info.fieldListHeading);
    });
  }

  ngAfterViewInit() {
    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe(
      branch => {
        this.SelectedBranch = branch;
      }
    );
    this.subscriptions.add(branchSubscription);
    this.branchDispatchers.selectPreviousBranch(this.SelectedBranch);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  resetValue() {
    this.InfoMsgBoxDispatcher.resetInfoMsgBoxInfo();
  }
}
