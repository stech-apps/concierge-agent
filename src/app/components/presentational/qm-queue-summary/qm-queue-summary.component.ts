import { UserSelectors } from './../../../../store/services/user/user.selectors';
import { QueueSelectors, QueueDispatchers, BranchSelectors, QueueVisitsDispatchers, NativeApiSelectors, NativeApiDispatchers, ServicePointSelectors } from 'src/store';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Queue } from '../../../../models/IQueue';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../util/services/toast.service';
import { Visit } from '../../../../models/IVisit';
import { NativeApiService } from '../../../../util/services/native-api.service';

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
  searchText: string; // qr value
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
  isSelectedVisitFail:boolean;
  isInvalidVisitEntry:boolean;
  queueName:string;
  qrCodeListnerTimer: any;
  public qrRelatedData: any;
  isRequestFromQR:boolean;
  visitQR:boolean;

  constructor(
    private queueSelectors: QueueSelectors,
    private userSelectors: UserSelectors,
    private queueDispatchers:QueueDispatchers,
    private branchSelectors:BranchSelectors,
    private queueVisitsDispatchers: QueueVisitsDispatchers,
    private translateService: TranslateService,
    private toastService: ToastService,
    public nativeApi: NativeApiService,
    private nativeApiSelector: NativeApiSelectors,
    private nativeApiDispatcher: NativeApiDispatchers,
   
    private servicePointSelectors:ServicePointSelectors
  
  ) {

    const selectedVisitSubscription = this.queueSelectors.selectedVisit$.subscribe((selectedVisit)=>{
      this.selectedVisit = selectedVisit
    })
    this.subscriptions.add(selectedVisitSubscription);
    

    const uttpSubscriptions = this.servicePointSelectors.uttParameters$.subscribe((uttpParams) => {
      if (uttpParams) { 
        this.editVisitEnable = uttpParams.editVisit;
        this.visitQR = uttpParams.visitQR;       
       }
    })
    this.subscriptions.add(uttpSubscriptions);


    const queueSubscription = this.queueSelectors.queueSummary$.subscribe((qs) => {
      this.queueSummary = qs;
    });
    this.subscriptions.add(queueSubscription);


    const queueNameSubscription = this.queueSelectors.queueName$.subscribe((name) => {
      this.queueName = name;
    });
    this.subscriptions.add(queueNameSubscription);


    const QueueSelectorSubscription = this.queueSelectors.selectedQueue$.subscribe((queue)=>{
      this.selectedQueue = queue;
    })
    this.subscriptions.add(QueueSelectorSubscription);

    // check the visit error
    const QueueVisitErrorSubscription = this.queueSelectors.isFetchVisiitError$.subscribe((error)=>{
      if(error){
        this.isSelectedVisitFail = true;
        if(this.isRequestFromQR){
        this.translateService.get('visit_not_found').subscribe(
          (label: string) => {
            this.toastService.infoToast(label);
          }
        ).unsubscribe();
        this.queueDispatchers.resetFetchVisitError();
        this.queueDispatchers.resetSelectedQueue();
      }
      }else{
        this.isSelectedVisitFail = false;
      }
    })
    this.subscriptions.add(QueueVisitErrorSubscription);


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
    
    // QR code subscription
    const qrCodeSubscription = this.nativeApiSelector.qrCode$.subscribe((value) => {
      if (value != null) {
        this.setQRRelatedData({ "branchId": this.selectedbranchId, "qrCode": value, "isQrCodeLoaded": true })
        if (!this.nativeApi.isNativeBrowser()) {
          this.removeDesktopQRReader();
        }
      }
    });
    this.subscriptions.add(qrCodeSubscription);

    

  //QR Scanner subscription 
    const qrCodeScannerSubscription = this.nativeApiSelector.qrCodeScannerState$.subscribe((value) => {
      if (value === true) {
        this.setQRRelatedData({ "branchId": null, "qrCode": null, "isQrCodeLoaded": false })
        this.qrCodeListner();
        if (!this.nativeApi.isNativeBrowser()) {
          this.checkDesktopQRReaderValue();
        }
      }
      else {
        this.removeQRCodeListner();
        
        this.isQRReaderOpen = false; 
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
    var searchBox = document.getElementById("visitSearchVisit") as any;
    searchBox.value="";

  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  handleInput($event) {
    if ($event.target.value.length == 0) {
      if (this.selectedbranchId && this.selectedQueueId) {
        this.queueVisitsDispatchers.fetchQueueVisits(this.selectedbranchId, this.selectedQueueId);
      }
    }else{
      this.searchText = $event.target.value
    }
  }

  keyDownFunction(event, visitSearchText: string) {
    if (event) {
      this.dismissKeyboard(event);
    }
    this.visitSearchText = visitSearchText;
    this.noVisitId = false;
    this.isInvalidVisitEntry = false;

    if (this.visitSearchText.trim().length == 0) {
      this.noVisitId = true;
      return;

    } else if (!this.isAppointmentIdValid(this.visitSearchText.trim())) {
      this.isInvalidVisitEntry = true;
      return;
    }
    this.isRequestFromQR = false;
    this.queueDispatchers.fetchSelectedVisit(this.selectedbranchId, visitSearchText);
    this.queueDispatchers.resetSelectedQueue();

  }

  searchVisit(visitSearchText:string){
    this.visitSearchText = visitSearchText;
 
    this.noVisitId = false;
    this.isInvalidVisitEntry = false;
    if (this.visitSearchText.trim().length == 0) {
      this.noVisitId = true;
      return;
    } else if (!this.isAppointmentIdValid(this.visitSearchText.trim())) {
      this.isInvalidVisitEntry = true;
      return;     
    }
    this.isRequestFromQR = false;
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
      this.nativeApiDispatcher.openQRCodeScanner();
      setTimeout(() => {
      var searchBox = document.getElementById("SearchFeild") as any;
      this.translateService.get('qr_code_scanner').subscribe(v => {
        searchBox.placeholder = v
      });
      searchBox.focus();
      }, 100);
    
    }
  }

  
  checkDesktopQRReaderValue() {
    this.desktopQRCodeListnerTimer = setInterval(() => {
      if (this.searchText && this.searchText.length > 0) {
        this.nativeApiDispatcher.fetchQRCodeInfo(this.searchText);
        console.log('text');
        
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
    this.searchText = '';
    this.nativeApiDispatcher.closeQRCodeScanner();
    this.removeQRCodeListner();
    
  }

  clearInput(){
    this.queueDispatchers.resetFetchVisitError();
    this.searchText = null;
    this.isInvalidVisitEntry = false;
    this.queueDispatchers.setectVisit(null);
  }
  foucusInput(){
    var searchBox = document.getElementById("SearchFeild") as any;
    searchBox.focus();
  }

  // from util file
  qrCodeListner() {
    this.qrCodeListnerTimer = setInterval(() => {
        if (this.qrRelatedData && this.qrRelatedData.isQrCodeLoaded) {
            this.qrRelatedData.isQrCodeLoaded = false;
            this.isRequestFromQR = true;
            this.queueDispatchers.fetchSelectedVisit(this.qrRelatedData.branchId, this.qrRelatedData.qrCode);
            this.searchText = '';
            this.qrRelatedData = null;
            this.removeQRCodeListner();
            // this.isQRReaderOpen = false;
            this.nativeApiDispatcher.closeQRCodeScanner();
        }
    }, 1000);
}

removeQRCodeListner() {
    if (this.qrCodeListnerTimer) {
        this.qrRelatedData = null;
        this.isQRReaderOpen = false;
        clearInterval(this.qrCodeListnerTimer);
    }
}

setQRRelatedData(qrData: any) {
    this.qrRelatedData = qrData;
}

}
