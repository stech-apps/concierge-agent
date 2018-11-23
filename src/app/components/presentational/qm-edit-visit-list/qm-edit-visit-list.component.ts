import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { UserSelectors, QueueVisitsDispatchers, BranchSelectors, QueueVisitsSelectors, QueueDispatchers, QueueSelectors, ServicePointSelectors, InfoMsgDispatchers, DataServiceError, NativeApiSelectors, NativeApiDispatchers, SystemInfoSelectors } from '../../../../store';
import { Subscription, Observable } from 'rxjs';
import { Visit } from '../../../../models/IVisit';
import { QmModalService } from '../qm-modal/qm-modal.service';
import { SPService } from '../../../../util/services/rest/sp.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ERROR_STATUS, Q_ERROR_CODE } from '../../../../util/q-error';
import { ToastService } from '../../../../util/services/toast.service';
import { NativeApiService } from '../../../../util/services/native-api.service';
import { Util } from '../../../../util/util';
import * as moment from 'moment-timezone';


enum SortBy {
  VISITID = "VISITID",
  CUSTOMER = "CUSTOMER",
  SERVICE = "SERVICE",
  APPTIME = "APPTIME"
}


@Component({
  selector: 'qm-edit-visit-list',
  templateUrl: './qm-edit-visit-list.component.html',
  styleUrls: ['./qm-edit-visit-list.component.scss']
})

export class QmEditVisitListComponent implements OnInit, OnDestroy {

  userDirection$: Observable<string> = new Observable<string>();
  private subscriptions: Subscription = new Subscription();
  selectedbranchId: number;
  selectedSpId: number;
  selectedQueueId: number;
  selectedQueueName: string;
  searchText: string;
  visits: Visit[] = [];
  sortByVisitIdAsc = true;
  sortByCustomerAsc = false;
  sortByServiceAsc = false;
  sortByAppTimeAsc = false;
  sortingIndicator: string = SortBy.VISITID;
  selectedVisitId: number;
  visitClicked: boolean = false;

  @Output() onFlowNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() NextFlow: EventEmitter<any> = new EventEmitter<any>();
  @Output() PreviousFlow: EventEmitter<any> = new EventEmitter<any>();

  //utt parameters
  canTransferSP: boolean = false;
  canTransferQ: boolean = false;
  canTransferStaff: boolean = false;
  canTransferQFirst: boolean = false;
  canTransferQLast: boolean = false;
  canTransferQWait: boolean = false;
  canDelete: boolean = false;
  canCherryPick: boolean = false;
  private timeoutHandle = null;

  dsOrOutcomeExists: boolean = false;
  visitSearchText: string;
  desktopQRCodeListnerTimer: any;
  timeConvention$: Observable<string> = new Observable<string>();
  timeConvention: string = "24";
  queueSummary:any

  constructor(
    private userSelectors: UserSelectors,
    private branchSelectors: BranchSelectors,
    private queueSelectors: QueueSelectors,
    private queueVisitsDispatchers: QueueVisitsDispatchers,
    private queueVisitsSelectors: QueueVisitsSelectors,
    private servicePointSelectors: ServicePointSelectors,
    private qmModalService: QmModalService,
    private spService: SPService,
    private translateService: TranslateService,
    private infoMsgBoxDispatcher: InfoMsgDispatchers,
    private router: Router,
    private toastService: ToastService,
    private visitDispatchers: QueueDispatchers,
    private nativeApi: NativeApiService,
    private nativeApiSelector: NativeApiSelectors,
    private util: Util,
    private nativeApiDispatcher: NativeApiDispatchers,
    private queueDispatcher: QueueDispatchers,
    private systemInfoSelectors: SystemInfoSelectors,
    
  ) {
    // 24 hour time converstion
    this.timeConvention$ = this.systemInfoSelectors.timeConvention$;
    const timeConventionSub = this.timeConvention$.subscribe(tc => {
      this.timeConvention = tc;
    });
    this.subscriptions.add(timeConventionSub);


    this.userDirection$ = this.userSelectors.userDirection$;

    const branchSub = this.branchSelectors.selectedBranch$.subscribe(branch => {
      this.selectedbranchId = branch.id;
    });
    this.subscriptions.add(branchSub);

    const servicePointSub = this.servicePointSelectors.openServicePoint$.subscribe(servicePoint => {
      this.selectedSpId = servicePoint.id;
    });
    this.subscriptions.add(servicePointSub);

    const queueSubscription = this.queueSelectors.queueSummary$.subscribe((qs) => {
      this.queueSummary = qs;
    });
    this.subscriptions.add(queueSubscription);

    //get visits for selected queue 
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

   
    // const qrCodeSubscription = this.nativeApiSelector.qrCode$.subscribe((value) => {
    //   if (value != null) {
    //     this.util.setQRRelatedData({ "branchId": this.selectedbranchId, "qrCode": value, "isQrCodeLoaded": true })
    //     if (!this.nativeApi.isNativeBrowser()) {
    //       this.removeDesktopQRReader();
    //     }
    //   }
    // });
    // this.subscriptions.add(qrCodeSubscription);

    // const qrCodeScannerSubscription = this.nativeApiSelector.qrCodeScannerState$.subscribe((value) => {
    //   if (value === true) {
    //     this.util.setQRRelatedData({ "branchId": null, "qrCode": null, "isQrCodeLoaded": false })
    //     this.util.qrCodeListner();
    //     if (!this.nativeApi.isNativeBrowser()) {
    //       this.checkDesktopQRReaderValue();
    //     }
    //   }
    //   else {
    //     this.util.removeQRCodeListner();
    //   }
    // });
    // this.subscriptions.add(qrCodeScannerSubscription);

    // get visit list
    const queueVisitsSub = this.queueVisitsSelectors.queueVisits$.subscribe(visitList => {
      this.visits = visitList;
      this.visitClicked = false;
      this.selectedVisitId = -1;
      //if only one visit in queue open visit options
      if (this.visits.length === 1) {
        this.visitClicked = true;
        this.selectedVisitId = this.visits[0].visitId;
        this.dsOrOutcomeExists = this.visits[0].currentVisitService.deliveredServiceExists || this.visits[0].currentVisitService.outcomeExists;
      }
    });
    this.subscriptions.add(queueVisitsSub);

    //check utt settings for enabling trasnfer options 
    const uttSubscription = this.servicePointSelectors.uttParameters$
      .subscribe(uttParameters => {
        if (uttParameters) {
          this.canTransferSP = uttParameters.trServPool;
          this.canTransferQ = uttParameters.btnQueueTransfer;
          this.canTransferStaff = uttParameters.trUserPool;
          this.canTransferQFirst = uttParameters.btnTransferFirst;
          this.canTransferQLast = uttParameters.btnTransferLast;
          this.canTransferQWait = uttParameters.btnTransferSort;
          this.canDelete = uttParameters.delVisit;
          this.canCherryPick = uttParameters.cherryPick;

          if (this.canTransferQ == true && (this.canTransferQFirst == true || this.canTransferQLast == true || this.canTransferQWait == true)) {
            this.canTransferQ = true;
          }
          if (this.canTransferQ == true && this.canTransferQFirst == false && this.canTransferQLast == false && this.canTransferQWait == false) {
            this.canTransferQ = false;
          }

        }
      })
      .unsubscribe();
    this.subscriptions.add(uttSubscription);


    const visitSub = this.queueSelectors.selectedVisit$.subscribe(result => {
      //check id defined to detect the search query request
      if (result && !result.id) {
        this.resetQRReader();
        this.spService.getSelectedVisitByVisitId(this.selectedbranchId, result.visitId).subscribe(visit => {
          this.visits.splice(0, this.visits.length, visit);
          this.visitClicked = true;
          this.selectedVisitId = this.visits[0].visitId;
          this.dsOrOutcomeExists = this.visits[0].currentVisitService.deliveredServiceExists || this.visits[0].currentVisitService.outcomeExists;
     
          // to apply name of the queue of selected visit  
          var selectedQ = this.queueSummary.queues.find(obj => {
            return obj.id === this.visits[0].queueId
          });     
          this.queueDispatcher.setectQueueName(selectedQ.name);
          
        }, error => {
          this.translateService.get('request_fail').subscribe(v => {
            this.toastService.infoToast(v);
          });
        })
      }
    }, error => {

    });
    this.subscriptions.add(visitSub);

    const visiInfoFail = this.queueSelectors.isVisitInfoFail$.subscribe((val) => {
      if (!this.nativeApi.isNativeBrowser() && val && this.searchText.length > 0) {
        this.resetQRReader();
        this.queueDispatcher.resetError();
      }
    })
    this.subscriptions.add(visiInfoFail)

  }

  ngOnInit() {
    // this.timeoutHandle = setTimeout(() => {
    //   this.queueDispatcher.resetSelectedQueue();
    //   this.visitDispatchers.resetQueueInfo;
    //  }, 10000)
  }

  resetQRReader() {
    var searchBox = document.getElementById("visitSearchVisit") as any;
    this.translateService.get('visit_search_placeholder').subscribe(v => {
      searchBox.placeholder = v
    });
    this.searchText = "";
    if (!this.nativeApi.isNativeBrowser()) {
      // this.removeDesktopQRReader();
    }
  }

  sortByVisitId() {
    this.sortingIndicator = SortBy.VISITID;
    this.sortByVisitIdAsc = !this.sortByVisitIdAsc;
    if (this.visits && this.visits.length) {
      // sort by visitId
      this.visits = this.visits.sort((a, b) => {
        var nameA = a.ticketId.toUpperCase(); // ignore upper and lowercase
        var nameB = b.ticketId.toUpperCase(); // ignore upper and lowercase
        if ((nameA < nameB && this.sortByVisitIdAsc) || (nameA > nameB && !this.sortByVisitIdAsc)) {
          return -1;
        }
        if ((nameA > nameB && this.sortByVisitIdAsc) || (nameA < nameB && !this.sortByVisitIdAsc)) {
          return 1;
        }

        // names must be equal
        return 0;
      });
    }
  }

  sortByCustomer() {
    this.sortingIndicator = SortBy.CUSTOMER;
    this.sortByCustomerAsc = !this.sortByCustomerAsc;
    if (this.visits && this.visits.length) {
      // sort by customer
      this.visits = this.visits.sort((a, b) => {
        var nameA = a.customerName.toUpperCase(); // ignore upper and lowercase
        var nameB = b.customerName.toUpperCase(); // ignore upper and lowercase
        if ((nameA < nameB && this.sortByCustomerAsc) || (nameA > nameB && !this.sortByCustomerAsc)) {
          return -1;
        }
        if ((nameA > nameB && this.sortByCustomerAsc) || (nameA < nameB && !this.sortByCustomerAsc)) {
          return 1;
        }

        // names must be equal
        return 0;
      });
    }
  }

  sortByService() {
    this.sortingIndicator = SortBy.SERVICE;
    this.sortByServiceAsc = !this.sortByServiceAsc;
    if (this.visits && this.visits.length) {
      // sort by service
      this.visits = this.visits.sort((a, b) => {
        var nameA = a.serviceName.toUpperCase(); // ignore upper and lowercase
        var nameB = b.serviceName.toUpperCase(); // ignore upper and lowercase
        if ((nameA < nameB && this.sortByServiceAsc) || (nameA > nameB && !this.sortByServiceAsc)) {
          return -1;
        }
        if ((nameA > nameB && this.sortByServiceAsc) || (nameA < nameB && !this.sortByServiceAsc)) {
          return 1;
        }
        // names must be equal
        return 0;
      });
    }
  }

  sortByAppTime() {
    this.sortingIndicator = SortBy.APPTIME;
    this.sortByAppTimeAsc = !this.sortByAppTimeAsc;
    if (this.visits && this.visits.length) {
      // sort by service
      this.visits = this.visits.sort((a, b) => {
        var nameA = a.appointmentTime.toUpperCase(); // ignore upper and lowercase
        var nameB = b.appointmentTime.toUpperCase(); // ignore upper and lowercase
        if ((nameA < nameB && this.sortByAppTimeAsc) || (nameA > nameB && !this.sortByAppTimeAsc)) {
          return -1;
        }
        if ((nameA > nameB && this.sortByAppTimeAsc) || (nameA < nameB && !this.sortByAppTimeAsc)) {
          return 1;
        }
        // names must be equal
        return 0;
      });
    }
  }



  selectVisit(index: number, visitId: number) {
    this.selectedVisitId === visitId && this.visits.length > 1 ? this.visitClicked = !this.visitClicked : this.visitClicked = true;
    //visit selection code goes here

    this.selectedVisitId = visitId;
    this.dsOrOutcomeExists = this.visits[index].currentVisitService.deliveredServiceExists || this.visits[index].currentVisitService.outcomeExists;
    this.resetQRReader();
  }

  // onQRCodeSelect() {
  //   this.queueDispatcher.resetError();
  //   if (this.nativeApi.isNativeBrowser()) {
  //     this.nativeApi.openQRScanner();
  //   }
  //   else {
  //     var searchBox = document.getElementById("visitSearchVisit") as any;
  //     this.translateService.get('qr_code_scanner').subscribe(v => {
  //       searchBox.placeholder = v
  //     });
  //     searchBox.focus();
  //     this.nativeApiDispatcher.openQRCodeScanner();
  //   }
  // }

  // checkDesktopQRReaderValue() {
  //   this.desktopQRCodeListnerTimer = setInterval(() => {
  //     if (this.searchText && this.searchText.length > 0) {
  //       this.nativeApiDispatcher.fetchQRCodeInfo(this.searchText);
  //     }
  //   }, 1000);
  // }

  // removeDesktopQRReader() {
  //   if (this.desktopQRCodeListnerTimer) {
  //     clearInterval(this.desktopQRCodeListnerTimer);
  //   }
  // }

  // dismissKeyboard(event) {
  //   var elem = event.currentTarget || event.target;
  //   // #142130605 - Requirement remove keyboard when enter pressed
  //   elem.blur();
  // }


  // isAppointmentIdValid(val: string) {
  //   return /^[0-9a-zA-Z]+$/.test(val);
  // }


  // keyDownFunction(event, visitSearchText: string) {
  //   if (event) {
  //     this.dismissKeyboard(event);
  //   }
  //   this.visitSearchText = visitSearchText;

  //   if (this.visitSearchText.trim().length == 0) {
  //     this.translateService.get('visit_no_entry').subscribe(v => {
  //       this.toastService.infoToast(v);
  //     });
  //     return;

  //   } else if (!this.isAppointmentIdValid(this.visitSearchText.trim())) {
  //     this.translateService.get('visit_invalid_entry').subscribe(v => {
  //       this.toastService.infoToast(v);
  //     });
  //     return;
  //   }

  //   this.visitDispatchers.fetchSelectedVisit(this.selectedbranchId, visitSearchText);

  // }

  transferToQ(visit) {
    this.NextFlow.emit("tq");
    this.visitDispatchers.setectVisit(visit);
    this.onFlowNext.emit();
  }

  transferToStaffPool(visit) {
    this.NextFlow.emit("tsp");
    this.visitDispatchers.setectVisit(visit);
    this.onFlowNext.emit();
  }

  transferToSPfPool(visit) {
    this.NextFlow.emit("tspp");
    this.visitDispatchers.setectVisit(visit);
    this.onFlowNext.emit();
  }

  cherryPickVisit(index: number, event: Event) {
    event.stopPropagation();


    let visitId = this.visits[index].ticketId;

    if (this.dsOrOutcomeExists && this.canCherryPick) {
      return;
    } else if (!this.dsOrOutcomeExists && this.canCherryPick) {
      this.qmModalService.openForTransKeys('', 'cherry_pick_visit_in_modal', 'yes', 'no', (result) => {
        if (result) {
          this.spService.cherryPickVisit(this.selectedbranchId, this.selectedSpId, this.selectedVisitId).subscribe(
            result => {
              this.translateService.get('visit_served').subscribe((label) => {
                var successMessage = {
                  firstLineName: label,
                  firstLineText: visitId,
                  icon: "correct",
                }
                this.infoMsgBoxDispatcher.updateInfoMsgBoxInfo(successMessage);
                this.router.navigate(["/home"]);
              });
            }, error => {
              // console.log(error);
              const err = new DataServiceError(error, null);
              if (error.status == ERROR_STATUS.NOT_FOUND) {
                this.translateService.get('requested_visit_not_found').subscribe(v => {
                  this.toastService.infoToast(v);
                });
              }
              else if (error.status == ERROR_STATUS.CONFLICT && err.errorCode == Q_ERROR_CODE.BLOCK_TRANSFER) {
                this.translateService.get('visit_already_called').subscribe(v => {
                  this.toastService.infoToast(v);
                });
              } else if (err.errorCode === '0') {
                this.translateService.get('request_fail').subscribe(v => {
                  this.toastService.errorToast(v);
                });
              } else {
                this.translateService.get('request_fail').subscribe(v => {
                  this.toastService.infoToast(v);
                });
              }
            }
          );
        }
      },
        () => { }, { visitId: visitId })
    }
  }

  deleteVisit(index: number, event: Event) {
    event.stopPropagation();
    let visitId = this.visits[index].ticketId;
    this.qmModalService.openForTransKeys('', 'delete_visit_in_modal', 'yes', 'no', (result) => {
      if (result) {
        this.spService.deleteVisit(this.selectedbranchId, this.selectedSpId, this.selectedVisitId).subscribe(
          result => {
            this.translateService.get('visit_deleted').subscribe((label) => {
              var successMessage = {
                firstLineName: label,
                firstLineText: visitId,
                icon: "correct",
              }
              this.infoMsgBoxDispatcher.updateInfoMsgBoxInfo(successMessage);
              this.router.navigate(["/home"]);
            });
          }, error => {
            // console.log(error);
            const err = new DataServiceError(error, null);
            if (error.status == ERROR_STATUS.NOT_FOUND) {
              this.translateService.get('requested_visit_not_found').subscribe(v => {
                this.toastService.errorToast(v);
              });
            }
            else if (error.status == ERROR_STATUS.CONFLICT && err.errorCode == Q_ERROR_CODE.BLOCK_TRANSFER) {
              this.translateService.get('visit_already_called').subscribe(v => {
                this.toastService.errorToast(v);
              });
            } else if (err.errorCode === '0') {
              this.translateService.get('request_fail').subscribe(v => {
                this.router.navigate(["/home"]);
                this.toastService.errorToast(v);
              });
            }
            else {
              this.translateService.get('request_fail').subscribe(v => {
                this.toastService.errorToast(v);
              });
            }
          }
        );
      }
    },
      () => { }, { visitId: visitId })
  }


  goBackToQueueSection() {
    this.PreviousFlow.emit();
    this.visitDispatchers.resetSelectedQueue();

  }

  handleTimeoutError(err: DataServiceError<any>, msg: string,routeToHome) {
    if (err.errorCode === '0') {
      this.translateService.get(msg).subscribe(v => {
        this.toastService.errorToast(msg);
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    clearTimeout(this.timeoutHandle);
  }

  getAppointmentTime(visit){
    let timeformat = "hh:mm A";
    if (this.timeConvention === "24") {
      timeformat = "HH:mm";
    }
    if(visit.appointmentTime==='-'){
      return '-';
    }else{
      return moment(visit.appointmentTime,'HH:mm').format(timeformat);
    }    
  }
}
