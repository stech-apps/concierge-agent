import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IBranch } from '../../../../models/IBranch';
import { IStaffPool } from '../../../../models/IStaffPool';
import { UserSelectors, StaffPoolDispatchers, StaffPoolSelectors, BranchSelectors, QueueVisitsSelectors, QueueSelectors, InfoMsgDispatchers, ServicePointSelectors } from '../../../../store';
import { TranslateService } from '@ngx-translate/core';
import { Visit } from '../../../../models/IVisit';
import { QmModalService } from '../qm-modal/qm-modal.service';
import { SPService } from '../../../../util/services/rest/sp.service';
import { Router } from '@angular/router';
import { IServicePoint } from '../../../../models/IServicePoint';

@Component({
  selector: 'qm-transfer-to-staff-pool',
  templateUrl: './qm-transfer-to-staff-pool.component.html',
  styleUrls: ['./qm-transfer-to-staff-pool.component.scss']
})
export class QmTransferToStaffPoolComponent implements OnInit {
  userDirection$: Observable<string>;
  private subscriptions: Subscription = new Subscription();
  currentBranch:IBranch;
  StaffPool:IStaffPool[];
  selectedVisit:Visit;
  SearchVisit:string;
  searchText:string;
  selectedServicePoint:IServicePoint;
  sortedBy:string = "LAST_NAME";
  sortAscending = true;

  constructor(
    private userSelectors:UserSelectors,
    private StaffPoolDispatchers:StaffPoolDispatchers,
    private StaffPoolSelectors:StaffPoolSelectors,
    private translateService:TranslateService,
    private BranchSelectors:BranchSelectors,
    private VisitSelectors:QueueSelectors,
    private qmModalService:QmModalService,
    private spService:SPService,
    private infoMsgBoxDispatcher:InfoMsgDispatchers,
    private router:Router,
    private ServicePointSelectors:ServicePointSelectors

  ) { 
    const staffPoolSubscription = this.StaffPoolSelectors.StaffPool$.subscribe((staffPool)=>{
    if(staffPool){
        this.StaffPool = staffPool;
      }
    });
    this.subscriptions.add(staffPoolSubscription);

    const selectedVisitSubscription =  this.VisitSelectors.selectedVisit$.subscribe((visit)=>{
        this.selectedVisit = visit;
    })
    this.subscriptions.add(selectedVisitSubscription);

    const ServicePointSubscription = this.ServicePointSelectors.openServicePoint$.subscribe((sp)=>{
      this.selectedServicePoint = sp;
    })
    this.subscriptions.add(ServicePointSubscription);
  }

  ngOnInit() {
    const branchSubscription = this.BranchSelectors.selectedBranch$.subscribe((branch)=>{
      this.currentBranch = branch;
    })
    this.subscriptions.add(branchSubscription);

    this.StaffPoolDispatchers.fetchStaffPool(this.currentBranch.id); 

  }

  onSortClickbyQueue(){}
  onSortClickbyWaitingCustomers(){}

  selectPool(s){
    if(this.selectedVisit){
      this.translateService.get('transfer_visit_to_staff_member_confirm_box',
      {
        visit: this.selectedVisit.ticketId,
      }).subscribe(
        (label: string) => 
          this.qmModalService.openForTransKeys('', `${label}`, 'yes', 'no', (result) => {
            if(result){
              
            this.spService.staffPoolTransfer(this.currentBranch,this.selectedServicePoint,s,this.selectedVisit).subscribe( result=>{
             
              this.translateService.get('visit_transferred').subscribe((label)=>{
                var successMessage = {
                  firstLineName: label,
                  firstLineText:this.selectedVisit.ticketId,
                  icon: "correct",
                }
                this.infoMsgBoxDispatcher.updateInfoMsgBoxInfo(successMessage);
                this.router.navigate(["/home"]);
              });
            }
            , error => {
              console.log(error);
            }
          )
            }
      }, () => {
      })
      ).unsubscribe()
      
    }
  }

  onSortClickbyLastName(){
    this.sortAscending = !this.sortAscending;
    this.sortQueueList("LAST_NAME");
    this.sortedBy = "LAST_NAME";  
  }
 
  onSortClickbyFirstName(){
    this.sortAscending = !this.sortAscending;
    this.sortQueueList("FIRST_NAME");
    this.sortedBy = "FIRST_NAME";  
  }
  onSortClickbyUserName(){
    this.sortAscending = !this.sortAscending;
    this.sortQueueList("USER_NAME");
    this.sortedBy = "USER_NAME";  
}

sortQueueList(type) {
  if (this.StaffPool) {
    // sort by name
    this.StaffPool = this.StaffPool.sort((a, b) => {

          if(type=="LAST_NAME"){
            var nameA = a.lastName.toUpperCase(); // ignore upper and lowercase
            var nameB = b.lastName.toUpperCase(); // ignore upper and lowercase
           } else if (type == "FIRST_NAME"){
            var nameA = a.firstName.toUpperCase();
            var nameB = b.firstName.toUpperCase();
           }
            if ((nameA < nameB && this.sortAscending) || (nameA > nameB && !this.sortAscending) ) {
              return -1;
            }
            if ((nameA > nameB && this.sortAscending) || (nameA < nameB && !this.sortAscending)) {
              return 1;
            }
            // names must be equal
            return 0;
      });
  }

}
}


