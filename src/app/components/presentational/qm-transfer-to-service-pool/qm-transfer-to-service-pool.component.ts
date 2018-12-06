import { Component, OnInit } from '@angular/core';
import { UserSelectors, BranchSelectors, ServicePointPoolSelectors, QueueSelectors, ServicePointSelectors, InfoMsgDispatchers, DataServiceError, QueueDispatchers } from '../../../../store';
import { ServicePointPoolDispatchers } from '../../../../store';
import { IBranch } from '../../../../models/IBranch';
import { IServicePointPool } from '../../../../models/IServicePointPool';
import { TranslateService } from '@ngx-translate/core';
import { Visit } from '../../../../models/IVisit';
import { QmModalService } from '../qm-modal/qm-modal.service';
import { SPService } from '../../../../util/services/rest/sp.service';
import { IServicePoint } from '../../../../models/IServicePoint';
import { Router } from '@angular/router';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DEBOUNCE_TIME } from './../../../../constants/config';
import { Subscription, Observable,Subject } from 'rxjs';
import { ToastService } from './../../../../util/services/toast.service';
import { Q_ERROR_CODE } from '../../../../util/q-error';

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
 
  sortAscending = true;
  inputChanged: Subject<string> = new Subject<string>();
  filterText: string = '';
  loaded:boolean;
  loading:boolean;

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
    private router:Router,
    private toastService:ToastService,
    private queueDispatchers:QueueDispatchers
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
    
    const ServicePointPoolLoadingSubscription = this.ServicePointPoolSelectors.ServicePointPoolLoading$.subscribe((loading)=>{
      this.loading = loading
    })
    this.subscriptions.add(ServicePointPoolLoadingSubscription)

    const ServicePointPoolLoadedSubscription = this.ServicePointPoolSelectors.ServicePointPoolLoaded$.subscribe((loaded)=>{
      this.loaded = loaded
    })
    this.subscriptions.add(ServicePointPoolLoadedSubscription)


    const ServicePointPoolSubscription = this.ServicePointPoolSelectors.ServicePointPool$.subscribe((sp)=>{
      this.servicePoints = sp;
      if(this.loaded && this.servicePoints.length===0 ){
        // this.translateService.get('empty_sp_pool').subscribe(
        //   (noappointments: string) => {
        //     this.toastService.infoToast(noappointments);
        //   }
        // ).unsubscribe();
      }else{
        this.sortQueueList();
      }
      

      
  })
  this.subscriptions.add(ServicePointPoolSubscription);
  const visitSubscription = this.queueSelectors.selectedVisit$.subscribe((visit)=>{
    this.selectedVisit = visit;
  })
  this.subscriptions.add(visitSubscription) 
   

  this.inputChanged
    .pipe(distinctUntilChanged(), debounceTime(DEBOUNCE_TIME || 0))
    .subscribe(text => this.filterServicePoints(text));




  }
    
  
  ngOnInit() {
   
  }


  filterServicePoints(newFilter: string) {    
    this.filterText = newFilter;
   }

   handleInput($event) {

    this.inputChanged.next($event.target.value);
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
                // var successMessage = {
                //   firstLineName: label,
                //   firstLineText:this.selectedVisit.ticketId,
                //   icon: "correct",
                // }
                this.toastService.infoToast(label);
              });
            }
            , error => {
              console.log(error);
              const err = new DataServiceError(error, null);
              
              if (error.errorCode == Q_ERROR_CODE.NO_VISIT) {
                this.translateService.get('requested_visit_not_found').subscribe(v => {
                  this.toastService.errorToast(v);
                });
              }  else if (error.errorCode == Q_ERROR_CODE.SERVED_VISIT) {
                this.translateService.get('requested_visit_not_found').subscribe(v => {
                  this.toastService.errorToast(v);
                });
              } else if (err.errorCode === '0') {
                this.translateService.get('request_fail').subscribe(v => {
                  this.toastService.errorToast(v);
                });
              }
              else {
                this.translateService.get('request_fail').subscribe(v => {
                  this.toastService.errorToast(v);
                });
              }
            }
          )
          this.queueDispatchers.resetSelectedQueue();
          this.queueDispatchers.setectVisit(null);
          this.queueDispatchers.resetFetchVisitError();
          this.queueDispatchers.resetQueueInfo();
            }
      }, () => {
      })
      ).unsubscribe()
      
    }}
  
    onSortClickbyServicePoint(){
      this.sortAscending = !this.sortAscending;
      this.sortQueueList();
      // this.sortedBy = "SERVICE_POINT";  
    }

  

    sortQueueList() {
      if (this.servicePoints) {
        // sort by name
        this.servicePoints = this.servicePoints.sort((a, b) => {

              
                // var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                // var nameB = b.name.toUpperCase(); // ignore upper and lowercase

                var stateA = a.state.toUpperCase(); // ignore upper and lowercase
                var stateB = b.state.toUpperCase(); // ignore upper and lowercase
               
                if ((stateA < stateB && this.sortAscending) || (stateA > stateB && !this.sortAscending) ) {
                  return 1;
                }
                if ((stateA > stateB && this.sortAscending) || (stateA < stateB && !this.sortAscending)) {
                  return -1;
                }


                if(stateA === stateB){
                  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
  
                  if ((nameA < nameB && this.sortAscending) || (nameA > nameB && !this.sortAscending) ) {
                    return -1;
                  }
                  if ((nameA > nameB && this.sortAscending) || (nameA < nameB && !this.sortAscending)) {
                    return 1;
                  }
                }
               


                // names must be equal
                return 0;
          })
      }
    
    }

    clearSearchText(){
      this.filterText="";
    }
    
  }
