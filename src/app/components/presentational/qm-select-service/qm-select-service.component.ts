import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { Subscription, Subject } from 'rxjs';
import { ServiceSelectors, ServiceDispatchers, BranchSelectors } from '../../../../../src/store';
import { IService } from '../../../../models/IService';
import { IBranch } from '../../../../models/IBranch';
import { QmModalService } from './../qm-modal/qm-modal.service';
import { ToastService } from '../../../../util/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { IServiceViewModel } from '../../../../models/IServiceViewModel';
import { DEBOUNCE_TIME } from './../../../../constants/config';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'qm-select-service',
  templateUrl: './qm-select-service.component.html',
  styleUrls: ['./qm-select-service.component.scss']
})
export class QmSelectServiceComponent implements OnInit {

  private subscriptions: Subscription = new Subscription();
  private serviceList: IService[];
  filteredServiceList: IServiceViewModel[] = new Array<IServiceViewModel>();
  selectedServiceList: IServiceViewModel[] = new Array<IServiceViewModel>();
  mostFrequentServiceList: IServiceViewModel[] = new Array<IServiceViewModel>();
  selectedBranch: IBranch;
  isMultiServiceOn: boolean;
  private maxServiceSelection = 5;
  filterText: string = '';
  inputChanged: Subject<string> = new Subject<string>();

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
        this.serviceList = <Array<IServiceViewModel>>services;
        this.filteredServiceList = <Array<IServiceViewModel>>services;
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

    this.inputChanged
    .pipe(distinctUntilChanged(), debounceTime(DEBOUNCE_TIME || 0))
    .subscribe(text => this.filterServices(text));
  }

  goToNext() {
    this.onFlowNext.emit();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onServiceSelect(selectedService: IServiceViewModel, isRemove: boolean) {
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

  handleServiceList(selectedService: IServiceViewModel, isRemove: boolean){
    this.serviceDispatchers.setSelectedServices(this.selectedServiceList);
    this.selectedServiceList.push(selectedService);
    if(isRemove){
      this.filteredServiceList = this.filteredServiceList.filter(
        (val: IService) =>
          val.id !== selectedService.id
      );
    }
  }

  onServiceRemove(selectedService: IServiceViewModel){
    this.selectedServiceList = this.selectedServiceList.filter(
      (val: IService) =>
        val.id !== selectedService.id
    );
    this.filteredServiceList.push(selectedService);
    this.filteredServiceList = <Array<IServiceViewModel>>this.sortServices(this.filteredServiceList);
    this.serviceDispatchers.setSelectedServices(this.selectedServiceList);
  }

  handleInput($event) {
    this.inputChanged.next($event.target.value);
  }

  filterServices(newFilter: string) {    
    this.filterText = newFilter;
   }

  doneButtonClick() {
    this.onFlowNext.emit();
  }

  sortServices(serviceList: IService[]): IService[] {
    return serviceList.sort(
      (service1: IService, service2: IService) => {
        if (service1.internalName.toLowerCase() < service2.internalName.toLowerCase() ) { return -1; }
        if (service1.internalName.toLowerCase() > service2.internalName.toLowerCase() ) { return 1; }
        return 0;
      }
    );
  }
}
