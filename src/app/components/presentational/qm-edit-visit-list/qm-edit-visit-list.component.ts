import { Component, OnInit, OnDestroy, Output,EventEmitter } from '@angular/core';
import { QueueVisitsDispatchers, BranchSelectors, QueueVisitsSelectors, QueueDispatchers, QueueSelectors, ServicePointSelectors, InfoMsgDispatchers, DataServiceError } from '../../../../store';
import { Subscription, Observable } from 'rxjs';
import { Visit } from '../../../../models/IVisit';
import { QmModalService } from '../qm-modal/qm-modal.service';
import { SPService } from '../../../../util/services/rest/sp.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ERROR_STATUS, Q_ERROR_CODE } from '../../../../util/q-error';
import { ToastService } from '../../../../util/services/toast.service';


enum SortBy {
  VISITID = "VISITID",
  CUSTOMER = "CUSTOMER",
  SERVICE = "SERVICE",
}


@Component({
  selector: 'qm-edit-visit-list',
  templateUrl: './qm-edit-visit-list.component.html',
  styleUrls: ['./qm-edit-visit-list.component.scss']
})

export class QmEditVisitListComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();
  selectedbranchId: number;
  selectedSpId: number;
  selectedQueueId: number;
  searchText: String;
  visits: Visit[] = [];
  sortByVisitIdAsc = true;
  sortByCustomerAsc = false;
  sortByServiceAsc = false;
  sortingIndicator: string = SortBy.VISITID;
  selectedVisitId: number;
  visitClicked: boolean = false;

  @Output() onFlowNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() NextFlow: EventEmitter<any> = new EventEmitter<any>();

  //utt parameters
  canTransferSP: boolean = false;
  canTransferQ: boolean = false;
  canTransferStaff: boolean = false;
  canTransferQFirst: boolean = false;
  canTransferQLast: boolean = false;
  canTransferQWait: boolean = false;
  canDelete: boolean = false;
  canCherryPick: boolean = false;


  constructor(
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
    private visitDispatchers:QueueDispatchers
  ) {
    const branchSub = this.branchSelectors.selectedBranch$.subscribe(branch => {
      this.selectedbranchId = branch.id;
    });
    this.subscriptions.add(branchSub);

    const servicePointSub = this.servicePointSelectors.openServicePoint$.subscribe(servicePoint => {
      this.selectedSpId = servicePoint.id;
    });
    this.subscriptions.add(servicePointSub);


    const selectedQueueSub = this.queueSelectors.selectedQueue$.subscribe(queue => {
      if (queue) {
        this.selectedQueueId = queue.id;
        if (this.selectedbranchId && this.selectedQueueId) {
          this.queueVisitsDispatchers.fetchQueueVisits(this.selectedbranchId, this.selectedQueueId);
        }
      }
    });
    this.subscriptions.add(selectedQueueSub);

    const queueVisitsSub = this.queueVisitsSelectors.queueVisits$.subscribe(visitList => {
      this.visits = visitList;
    });
    this.subscriptions.add(queueVisitsSub);


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
  }

  ngOnInit() { }

  sortByVisitId() {
    this.sortingIndicator = SortBy.VISITID;
    this.sortByVisitIdAsc = !this.sortByVisitIdAsc;
    if (this.visits && this.visits.length) {
      // sort by visitId
      this.visits = this.visits.sort((a, b) => {
        var nameA = a.ticketNumber.toUpperCase(); // ignore upper and lowercase
        var nameB = b.ticketNumber.toUpperCase(); // ignore upper and lowercase
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

  resetSearch() {
    this.searchText = '';
  }

  selectVisit(visitId: number) {
    this.selectedVisitId === visitId ? this.visitClicked = !this.visitClicked : this.visitClicked = true;
    //visit selection code goes here
    console.log(visitId);
    this.selectedVisitId = visitId;

  }

  keyDownFunction(event, visitSearchText: string) {

  }

  transferToQ() {
    this.NextFlow.emit("TRANSFER_TO_STAFF_POOL");
    // this.visitDispatchers
    this.onFlowNext.emit();
  }

  transferToStaffPool() {

  }

  transferToSPfPool() {

  }

  cherryPickVisit(index: number,event:Event) {
    event.stopPropagation();
  
    let dsOrOutcomeExists: boolean = this.visits[index].currentVisitService.deliveredServiceExists || this.visits[index].currentVisitService.outcomeExists;
    let visitId = this.visits[index].ticketNumber;
    if (!dsOrOutcomeExists && this.canCherryPick) {
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
              console.log(error);
              const err = new DataServiceError(error, null);
              if (error.status == ERROR_STATUS.NOT_FOUND) {
                this.toastService.infoToast('requested_visit_not_found');
              }
              else if (error.status == ERROR_STATUS.CONFLICT && err.errorCode == Q_ERROR_CODE.BLOCK_TRANSFER) {
                this.toastService.infoToast('visit_already_called');
              }
              else {
                this.toastService.infoToast('request_fail');
              }
            }
          );
        }
      },
        () => { }, { visitId: visitId })
    }
  }

  deleteVisit(index: number,event:Event) {
    event.stopPropagation();
    let visitId = this.visits[index].ticketNumber;
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
            console.log(error);
            const err = new DataServiceError(error, null);
            if (error.status == ERROR_STATUS.NOT_FOUND) {
              this.toastService.infoToast('requested_visit_not_found');
            }
            else if (error.status == ERROR_STATUS.CONFLICT && err.errorCode == Q_ERROR_CODE.BLOCK_TRANSFER) {
              this.toastService.infoToast('visit_already_called');
            }
            else {
              this.toastService.infoToast('request_fail');
            }
          }
        );
      }
    },
      () => { }, { visitId: visitId })
  }



  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
