import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { Subscription } from 'rxjs';
import { ServiceSelectors, ServiceDispatchers, BranchSelectors } from '../../../../../src/store';
import { IService } from '../../../../models/IService';
import { IBranch } from '../../../../models/IBranch';
import { QmModalService } from './../qm-modal/qm-modal.service';
import { ToastService } from '../../../../util/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'qm-select-service',
  templateUrl: './qm-select-service.component.html',
  styleUrls: ['./qm-select-service.component.scss']
})
export class QmSelectServiceComponent implements OnInit {

  private subscriptions: Subscription = new Subscription();
  private serviceList: IService[];
  filteredServiceList: IService[];
  selectedServiceList: IService[];
  mostFrequentServiceList: IService[];
  selectedBranch: IBranch;
  private isMultiServiceOn: boolean;
  private maxServiceSelection = 5;

  constructor(
    private serviceSelectors: ServiceSelectors,
    private serviceDispatchers: ServiceDispatchers,
    private branchSelectors: BranchSelectors,
    private qmModalService: QmModalService,
    private translateService: TranslateService,
    private toastService: ToastService
  ) { 
    this.selectedServiceList = [];
    this.filteredServiceList = [];
  }

  onResultChange:  EventEmitter<any> = new EventEmitter();

  @Output()
  onFlowNext:  EventEmitter<any> = new EventEmitter();
  
  @Input()
  flowType: FLOW_TYPE;

  ngOnInit() {
    if(this.flowType === FLOW_TYPE.CREATE_VISIT || this.flowType === FLOW_TYPE.ARRIVE_APPOINTMENT){
      const serviceSubscription = this.serviceSelectors.services$.subscribe((services) => {
        this.serviceList = services;
        this.filteredServiceList = services;
      });
      this.subscriptions.add(serviceSubscription);

      const serviceLoadedSubscription = this.serviceSelectors.isServiceLoaded$.subscribe((val) => {
        const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((branch) => {
          if(branch){
            this.selectedBranch = branch;
            if(!val){
              this.serviceDispatchers.fetchServices(branch);
            }
          }
        });
        this.subscriptions.add(branchSubscription);
      });
      this.subscriptions.add(serviceLoadedSubscription);
    }
    else if(this.flowType === FLOW_TYPE.CREATE_APPOINTMENT){
      
    }
    setTimeout(()=> {
      this.onResultChange.emit('Selected Branch');
    }, 1000);
  }

  goToNext() {
    this.onFlowNext.emit();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onServiceSelect(selectedService: IService, isRemove: boolean) {
    if(this.selectedServiceList.length === 0 || (this.selectedServiceList.length < this.maxServiceSelection && this.isMultiServiceOn)){
      this.handleServiceList(selectedService, isRemove);
    }
    else if(this.selectedServiceList.length === 1 && !this.isMultiServiceOn){
      this.qmModalService.openForTransKeys('', 'enable_multi_serv_switch', 'yes', 'no', (v) => {
        if(v) {
          this.isMultiServiceOn = true;
          this.handleServiceList(selectedService, isRemove);
        }
      }, ()=> {});
    }
    else if(this.selectedServiceList.length === 5){
      this.translateService.get('limit_max_service').subscribe(v => {
        this.toastService.infoToast(v);
      });
    }
  }

  handleServiceList(selectedService: IService, isRemove: boolean){
    this.selectedServiceList.push(selectedService);
    if(isRemove){
      this.filteredServiceList = this.filteredServiceList.filter(
        (val: IService) =>
          val.id !== selectedService.id
      );
    }
  }

  onServiceRemove(selectedService: IService){

  }

  doneButtonClick() {
    this.onFlowNext.emit();
  }
}
