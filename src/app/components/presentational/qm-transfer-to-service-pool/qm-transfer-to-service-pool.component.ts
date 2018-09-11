import { Component, OnInit } from '@angular/core';
import { UserSelectors, BranchSelectors, ServicePointPoolSelectors, QueueSelectors, ServicePointSelectors, InfoMsgDispatchers } from '../../../../store';
import { Observable, Subscription } from 'rxjs';
import { ServicePointPoolDispatchers } from '../../../../store';
import { IBranch } from '../../../../models/IBranch';
import { IServicePointPool } from '../../../../models/IServicePointPool';
import { TranslateService } from '@ngx-translate/core';
import { Visit } from '../../../../models/IVisit';
import { QmModalService } from '../qm-modal/qm-modal.service';
import { SPService } from '../../../../util/services/rest/sp.service';
import { IServicePoint } from '../../../../models/IServicePoint';
import { Router } from '@angular/router';

@Component({
  selector: 'qm-transfer-to-service-pool',
  templateUrl: './qm-transfer-to-service-pool.component.html',
  styleUrls: ['./qm-transfer-to-service-pool.component.scss']
})
export class QmTransferToServicePoolComponent implements OnInit {
  userDirection$: Observable<string>;
  private subscriptions: Subscription = new Subscription();
  currentBranch:IBranch;
  servicePoints:IServicePointPool[];
  selectedVisit:Visit;
  selectedServicePoint:IServicePoint
  searchText:string;
  sortedBy:string;

  constructor(  private userSelectors: UserSelectors,
    private ServicePointPoolDispatchers:ServicePointPoolDispatchers,
    private BranchSelectors:BranchSelectors,
    private ServicePointPoolSelectors:ServicePointPoolSelectors,
    private translateService:TranslateService,
    private queueSelectors:QueueSelectors,
    private qmModalService:QmModalService,
    private spService:SPService,
    private servicePointSelectors:ServicePointSelectors,
    private infoMsgBoxDispatcher:InfoMsgDispatchers,
    private router:Router
  ) { 
    this.userDirection$ = this.userSelectors.userDirection$;   
  
    const branchSubscription = this.BranchSelectors.selectedBranch$.subscribe((branch)=>{
      this.currentBranch = branch;
    })
    this.subscriptions.add(branchSubscription);

    const selectedServicePointSubscriptions = this.servicePointSelectors.openServicePoint$.subscribe((sp)=>{
      this.selectedServicePoint = sp;
    })
    
    this.subscriptions.add(selectedServicePointSubscriptions);
    

    this.ServicePointPoolDispatchers.fetchServicePointPool(this.currentBranch.id);
    
    const ServicePointPoolSubscription = this.ServicePointPoolSelectors.ServicePointPool$.subscribe((sp)=>{
      this.servicePoints = sp;
      console.log(this.servicePoints);
      
  })
  this.subscriptions.add(ServicePointPoolSubscription);
  const visitSubscription = this.queueSelectors.selectedVisit$.subscribe((visit)=>{
    this.selectedVisit = visit;
  })
  this.subscriptions.add(visitSubscription) 
   
  }
    

  ngOnInit() {
   
  }

   SearchVisit(test){

  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  selectQueue(s){

    if(this.selectedVisit){
      this.translateService.get('transfer_visit_to_service_pool_confirm_box',
      {
        visit: this.selectedVisit.ticketId,
      }).subscribe(
        (label: string) => 
          this.qmModalService.openForTransKeys('', `${label}`, 'yes', 'no', (result) => {
            if(result){
              
            this.spService.servicePointTransfer(this.currentBranch,this.selectedServicePoint,s,this.selectedVisit).subscribe( result=>{
             
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
      
    }}
    onSortClickbyQueue(){}
    onSortClickbyWaitingCustomers(){}
    
  }
