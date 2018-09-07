import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueueVisitsDispatchers, BranchSelectors, QueueVisitsSelectors, QueueDispatchers, QueueSelectors } from '../../../../store';
import { Subscription, Observable } from 'rxjs';
import { Visit } from '../../../../models/IVisit';

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
  selectedQueueId: number;
  searchText: String;
  visits: Visit[] = [];
  sortByVisitIdAsc = true;
  sortByCustomerAsc = false;
  sortByServiceAsc = false;
  sortingIndicator: string = SortBy.VISITID;
  selectedVisitID:number;
  visitClicked:boolean= false;

  constructor(
    private branchSelectors: BranchSelectors,
    private queueDispatchers: QueueDispatchers,
    private queueSelectors: QueueSelectors,
    private queueVisitsDispatchers: QueueVisitsDispatchers,
    private queueVisitsSelectors: QueueVisitsSelectors
  ) {
    const branchSub = this.branchSelectors.selectedBranch$.subscribe(branch => {
      this.selectedbranchId = branch.id;
    });
    this.subscriptions.add(branchSub);

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
    this.selectedVisitID===visitId ? this.visitClicked = !this.visitClicked: this.visitClicked=true;
    //visit selection code goes here
    console.log(visitId);
    this.selectedVisitID=visitId;

  }

  keyDownFunction(event, visitSearchText: string) {

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
