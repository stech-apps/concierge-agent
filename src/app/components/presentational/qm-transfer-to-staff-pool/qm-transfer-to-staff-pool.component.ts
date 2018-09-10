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
  sortedBy:string;
  searchText:string;
  selectedServicePoint:IServicePoint;
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
        visit: this.selectedVisit[0].ticketId,
      }).subscribe(
        (label: string) => 
          this.qmModalService.openForTransKeys('', `${label}`, 'yes', 'no', (result) => {
            if(result){
              
            this.spService.staffPoolTransfer(this.currentBranch,this.selectedServicePoint,s,this.selectedVisit).subscribe( result=>{
             
              this.translateService.get('visit_transferred').subscribe((label)=>{
                var successMessage = {
                  firstLineName: label,
                  firstLineText:this.selectedVisit[0].ticketId,
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
 

}


