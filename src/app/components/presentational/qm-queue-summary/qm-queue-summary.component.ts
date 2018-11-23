import { UserSelectors } from './../../../../store/services/user/user.selectors';
import { QueueSelectors, QueueDispatchers, BranchSelectors, QueueVisitsDispatchers, NativeApiSelectors, NativeApiDispatchers, ServicePointSelectors } from 'src/store';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Queue } from '../../../../models/IQueue';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../util/services/toast.service';
import { Visit } from '../../../../models/IVisit';
import { NativeApiService } from '../../../../util/services/native-api.service';
import { Util } from '../../../../util/util';

@Component({
  selector: 'qm-queue-summary',
  templateUrl: './qm-queue-summary.component.html',
  styleUrls: ['./qm-queue-summary.component.scss']
})
export class QmQueueSummaryComponent implements OnInit {

  private subscriptions: Subscription = new Subscription();
  isQuickServeEnable: boolean;
  userDirection$:  Observable<string>;
  public queueSummary: any;
  selectedQueue:Queue;
  searchText: string;
  selectedbranchId: number;
  selectedSpId: number;
  selectedQueueId: number;
  selectedQueueName: string;
  visitSearchText: string;
  selectedVisit:Visit
  isQRReaderOpen:boolean;
  desktopQRCodeListnerTimer: any;
  editVisitEnable:boolean;
  noVisitId:boolean;
  invalidVisitId:boolean;

  constructor(
    private queueSelectors: QueueSelectors,
    private userSelectors: UserSelectors,
    private queueDispatchers:QueueDispatchers,
    private branchSelectors:BranchSelectors,
    private queueVisitsDispatchers: QueueVisitsDispatchers,
    private translateService: TranslateService,
    private toastService: ToastService,
    private nativeApi: NativeApiService,
    private nativeApiSelector: NativeApiSelectors,
    private nativeApiDispatcher: NativeApiDispatchers,
    private util: Util,
    private servicePointSelectors:ServicePointSelectors
  
  ) {

    const selectedVisitSubscription = this.queueSelectors.selectedVisit$.subscribe((selectedVisit)=>{
      this.selectedVisit = selectedVisit
    })

    this.subscriptions.add(selectedVisitSubscription);
    
    const uttpSubscriptions = this.servicePointSelectors.uttParameters$.subscribe((uttpParams) => {
      if (uttpParams) { 
        this.editVisitEnable = uttpParams.editVisit;
        
       }
    })
    this.subscriptions.add(uttpSubscriptions);

    const queueSubscription = this.queueSelectors.queueSummary$.subscribe((qs) => {
      this.queueSummary = qs;
    });

    this.subscriptions.add(queueSubscription);

    const QueueSelectorSubscription = this.queueSelectors.selectedQueue$.subscribe((queue)=>{
      this.selectedQueue = queue;
    })
    this.subscriptions.add(QueueSelectorSubscription);


    const branchSub = this.branchSelectors.selectedBranch$.subscribe(branch => {
      this.selectedbranchId = branch.id;
    });
    this.subscriptions.add(branchSub);

    const selectedQueueSub = this.queueSelectors.selectedQueue$.subscribe(queue => {
      if (queue) {
        this.selectedQueueId = queue.id;
        this.selectedQueueName = queue.name;
        if (this.selectedbranchId && this.selectedQueueId) {
          this.queueVisitsDispatchers.fetchQueueVisits(this.selectedbranchId, this.selectedQueueId);
        }
      } else {
        this.selectedQueueId = null;
      }
    });
    this.subscriptions.add(selectedQueueSub);


    // regarding QR code
    
    const qrCodeSubscription = this.nativeApiSelector.qrCode$.subscribe((value) => {
      if (value != null) {
        this.util.setQRRelatedData({ "branchId": this.selectedbranchId, "qrCode": value, "isQrCodeLoaded": true })
        if (!this.nativeApi.isNativeBrowser()) {
          this.removeDesktopQRReader();
        }
      }
    });
    this.subscriptions.add(qrCodeSubscription);

    const qrCodeScannerSubscription = this.nativeApiSelector.qrCodeScannerState$.subscribe((value) => {
      if (value === true) {
        this.util.setQRRelatedData({ "branchId": null, "qrCode": null, "isQrCodeLoaded": false })
        this.util.qrCodeListner();
        if (!this.nativeApi.isNativeBrowser()) {
          this.checkDesktopQRReaderValue();
        }
      }
      else {
        this.util.removeQRCodeListner();
      }
    });
    this.subscriptions.add(qrCodeScannerSubscription);

  }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  resetQueue(){
    this.queueDispatchers.resetSelectedQueue();   
    this.queueDispatchers.setectVisit(null); 
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  handleInput($event) {
    if ($event.target.value.length == 0) {
      if (this.selectedbranchId && this.selectedQueueId) {
        this.queueVisitsDispatchers.fetchQueueVisits(this.selectedbranchId, this.selectedQueueId);
      }
    }
  }

  keyDownFunction(event, visitSearchText: string) {
    if (event) {
      this.dismissKeyboard(event);
    }
    this.visitSearchText = visitSearchText;
    this.noVisitId = false;

    if (this.visitSearchText.trim().length == 0) {
      this.noVisitId = true;
      return;

    } else if (!this.isAppointmentIdValid(this.visitSearchText.trim())) {
      this.translateService.get('visit_invalid_entry').subscribe(v => {
        this.toastService.infoToast(v);
      });
      return;
    }

    this.queueDispatchers.fetchSelectedVisit(this.selectedbranchId, visitSearchText);

  }

  searchVisit(visitSearchText:string){
    this.visitSearchText = visitSearchText;
 
    this.noVisitId = false;
    if (this.visitSearchText.trim().length == 0) {
      this.noVisitId = true;
      return;

    } else if (!this.isAppointmentIdValid(this.visitSearchText.trim())) {
      this.translateService.get('visit_invalid_entry').subscribe(v => {
        this.toastService.infoToast(v);
      });
      return;
      
    }

    this.queueDispatchers.fetchSelectedVisit(this.selectedbranchId, visitSearchText);
  }

  dismissKeyboard(event) {
    var elem = event.currentTarget || event.target;
    // #142130605 - Requirement remove keyboard when enter pressed
    elem.blur();
  }

  isAppointmentIdValid(val: string) {
    return /^[0-9a-zA-Z]+$/.test(val);
  }

  SearchQRButtonClick(){
    this.isQRReaderOpen = true;
    this.queueDispatchers.resetError();
    if (this.nativeApi.isNativeBrowser()) {
      this.nativeApi.openQRScanner();
    }
    else {
      var searchBox = document.getElementById("visitSearch") as any;
      this.translateService.get('qr_code_scanner').subscribe(v => {
        searchBox.placeholder = v
      });
      searchBox.focus();
      this.nativeApiDispatcher.openQRCodeScanner();
    }
  }

  
  checkDesktopQRReaderValue() {
    this.desktopQRCodeListnerTimer = setInterval(() => {
      if (this.searchText && this.searchText.length > 0) {
        this.nativeApiDispatcher.fetchQRCodeInfo(this.searchText);
      }
    }, 1000);
  }

  removeDesktopQRReader() {
    if (this.desktopQRCodeListnerTimer) {
      clearInterval(this.desktopQRCodeListnerTimer);
    }
  }

  closeqr(){
    this.isQRReaderOpen = false;
  }

}
