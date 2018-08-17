import { QmClearInputDirective } from './../../../directives/qm-clear-input.directive';
import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { Subscription, Subject } from 'rxjs';
import { ServiceSelectors, ServiceDispatchers, BranchSelectors, CalendarBranchSelectors, CalendarServiceDispatchers, CalendarServiceSelectors, ServicePointSelectors } from '../../../../../src/store';
import { IService } from '../../../../models/IService';
import { IBranch } from '../../../../models/IBranch';
import { QmModalService } from './../qm-modal/qm-modal.service';
import { ToastService } from '../../../../util/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { IServiceViewModel } from '../../../../models/IServiceViewModel';
import { DEBOUNCE_TIME } from './../../../../constants/config';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ICalendarService } from '../../../../models/ICalendarService';
import { ICalendarBranch } from '../../../../models/ICalendarBranch';
import { LocalStorage, STORAGE_SUB_KEY } from '../../../../util/local-storage';

@Component({
  selector: 'qm-select-service',
  templateUrl: './qm-select-service.component.html',
  styleUrls: ['./qm-select-service.component.scss']
})
export class QmSelectServiceComponent implements OnInit {

  private subscriptions: Subscription = new Subscription();
  private serviceList: ICalendarService[];
  filteredServiceList: IServiceViewModel[] = new Array<IServiceViewModel>();
  selectedServiceList: IServiceViewModel[] = new Array<IServiceViewModel>();
  mostFrequentServiceList: IServiceViewModel[] = new Array<IServiceViewModel>();
  selectedBranch: IBranch;
  isMultiServiceOn: boolean;
  private maxServiceSelection = 5;
  filterText: string = '';
  inputChanged: Subject<string> = new Subject<string>();
  newf: FLOW_TYPE.CREATE_APPOINTMENT;
  multiServiceEnabled: boolean;
  searchText: string;
  @ViewChild(QmClearInputDirective) clearInputDirective:QmClearInputDirective;

  constructor(
    private serviceSelectors: ServiceSelectors,
    private serviceDispatchers: ServiceDispatchers,
    private branchSelectors: BranchSelectors,
    private qmModalService: QmModalService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private calendarServiceSelectors: CalendarServiceSelectors,
    private calendarServiceDispatchers: CalendarServiceDispatchers,
    private calendarBranchSelectors: CalendarBranchSelectors,
    private localStorage: LocalStorage,
    private servicePointSelectors: ServicePointSelectors
  ) { 
    this.selectedServiceList = [];
    this.filteredServiceList = [];
  }

  onResultChange:  EventEmitter<any> = new EventEmitter();

  private _isVisible: boolean;

  @Input() set isVisible(value: boolean) {
    this._isVisible = value;

    if(value) {
      this.onFlowStepActivated();  
   }
 }
 
 get isVisible(): boolean {  
     return this._isVisible;  
 }

  @Output()
  onFlowNext:  EventEmitter<any> = new EventEmitter<any>();
  
  @Input()
  flowType: FLOW_TYPE;

  ngOnInit() {
    if(this.flowType === FLOW_TYPE.CREATE_VISIT || this.flowType === FLOW_TYPE.ARRIVE_APPOINTMENT){
      this.multiServiceEnabled = true;
      const serviceSubscription = this.serviceSelectors.services$.subscribe((services) => {
        this.serviceList = <Array<IServiceViewModel>>services;
        this.filteredServiceList = <Array<IServiceViewModel>>services;

        this.checkMostFrequentService();
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
      const calendarServiceSubscription = this.calendarServiceSelectors.services$.subscribe((services) => {
        this.serviceList = <Array<IServiceViewModel>>services;
        this.filteredServiceList = <Array<IServiceViewModel>>services;
      });
      this.subscriptions.add(calendarServiceSubscription);

      const calendarServiceLoadedSubscription = this.calendarServiceSelectors.isCalendarServiceLoaded$.subscribe((val) => {
       
      });
      this.subscriptions.add(calendarServiceLoadedSubscription);


      // calendar branch subscription

      const calendarBranchSubscription = this.calendarBranchSelectors.selectedBranch$.subscribe((branch) => {
        if(branch.publicId){
          //if(!this.selectedBranch && this.selectedBranch !== branch || !val){
            this.calendarServiceDispatchers.fetchServices(branch);
          //}
          this.selectedBranch = branch;
        }
      });
      this.subscriptions.add(calendarBranchSubscription);


      const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
        if(params){
          this.multiServiceEnabled = params.mltyService;;
        }
      });
      this.subscriptions.add(servicePointsSubscription);
    }

    this.inputChanged
    .pipe(distinctUntilChanged(), debounceTime(DEBOUNCE_TIME || 0))
    .subscribe(text => this.filterServices(text));

    let storeKey: STORAGE_SUB_KEY;
    if(this.flowType === FLOW_TYPE.CREATE_APPOINTMENT){
      storeKey = STORAGE_SUB_KEY.MULTI_SERVICE_ENABLE_CA;
    }
    else if(this.flowType === FLOW_TYPE.CREATE_VISIT){
      storeKey = STORAGE_SUB_KEY.MULTI_SERVICE_ENABLE_CV;
    }
    else if(this.flowType === FLOW_TYPE.ARRIVE_APPOINTMENT){
      storeKey = STORAGE_SUB_KEY.MULTI_SERVICE_ENABLE_AA;
    }
    this.isMultiServiceOn = this.localStorage.getSettingForKey(storeKey);
  }

  onFlowStepActivated() {
    this.searchText = '';
    this.filterText = '';
    this.clearInputDirective.updateButtonVisibility('');
  }

  goToNext() {
    this.onFlowNext.emit();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onServiceSelect(selectedService: IServiceViewModel, isRemove: boolean) {
    this.onFlowStepActivated();
    if(this.selectedServiceList.length === 0 || (this.selectedServiceList.length < this.maxServiceSelection && this.isMultiServiceOn)){
      this.handleServiceList(selectedService, isRemove);
    }
    else if(!this.multiServiceEnabled){
      this.translateService.get('limit_max_service').subscribe(v => {
        this.toastService.infoToast(v);
      });
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
    this.selectedServiceList.push(selectedService);
    if(this.flowType === FLOW_TYPE.CREATE_APPOINTMENT){
      this.calendarServiceDispatchers.setSelectedServices(this.selectedServiceList);
      this.calendarServiceDispatchers.fetchServiceGroups(this.selectedServiceList, this.selectedBranch as ICalendarBranch);
    }
    else{
      this.serviceDispatchers.setSelectedServices(this.selectedServiceList);
      if(isRemove){
        this.filteredServiceList = this.filteredServiceList.filter(
          (val: IService) =>
            val.id !== selectedService.id
        );
        this.checkMostFrequentService();
      }
    }

    if(this.selectedServiceList.length === 1 && !(this.isMultiServiceOn)){
      this.doneButtonClick();
    }
  }

  onServiceRemove(selectedService: IServiceViewModel){
    if(this.flowType === FLOW_TYPE.CREATE_APPOINTMENT){
      this.selectedServiceList = this.selectedServiceList.filter(
        (val: ICalendarService) =>
          val.publicId !== selectedService.publicId
      );
      this.calendarServiceDispatchers.setSelectedServices(this.selectedServiceList);
      this.calendarServiceDispatchers.fetchServiceGroups(this.selectedServiceList, this.selectedBranch as ICalendarBranch);
    }
    else{
      this.selectedServiceList = this.selectedServiceList.filter(
        (val: IService) =>
          val.id !== selectedService.id
      );

      this.checkMostFrequentService();
      this.filteredServiceList.push(selectedService);
      this.filteredServiceList = <Array<IServiceViewModel>>this.sortServices(this.filteredServiceList);
      
      this.serviceDispatchers.setSelectedServices(this.selectedServiceList);
    }
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

  onSwitchChange(){
    let storeKey: STORAGE_SUB_KEY;
    if(this.flowType === FLOW_TYPE.CREATE_APPOINTMENT){
      storeKey = STORAGE_SUB_KEY.MULTI_SERVICE_ENABLE_CA;
    }
    else if(this.flowType === FLOW_TYPE.CREATE_VISIT){
      storeKey = STORAGE_SUB_KEY.MULTI_SERVICE_ENABLE_CV;
    }
    else if(this.flowType === FLOW_TYPE.ARRIVE_APPOINTMENT){
      storeKey = STORAGE_SUB_KEY.MULTI_SERVICE_ENABLE_AA;
    }
    this.localStorage.setSettings(storeKey, this.isMultiServiceOn)
  }

  sortServices(serviceList: ICalendarService[]): ICalendarService[] {
    return serviceList.sort(
      (service1: ICalendarService, service2: ICalendarService) => {
        if(this.flowType === FLOW_TYPE.CREATE_APPOINTMENT){
          if (service1.name.toLowerCase() < service2.name.toLowerCase() ) { return -1; }
          if (service1.name.toLowerCase() > service2.name.toLowerCase() ) { return 1; }
          return 0;
        }
        else{
          if (service1.internalName.toLowerCase() < service2.internalName.toLowerCase() ) { return -1; }
          if (service1.internalName.toLowerCase() > service2.internalName.toLowerCase() ) { return 1; }
          return 0;
        }
      }
    );
  }

  getMostFrequnetServices(){
    var serviceIds = null;
    if(this.flowType === FLOW_TYPE.CREATE_VISIT){
      serviceIds = this.localStorage.getStoreForKey(STORAGE_SUB_KEY.MOST_FRQUENT_SERVICES);
    }
    else{
      serviceIds = this.localStorage.getStoreForKey(STORAGE_SUB_KEY.MOST_FRQUENT_SERVICES_APPOINTMENT);
    }

    return serviceIds;
  }

  checkMostFrequentService(){
    var serviceIds = this.getMostFrequnetServices();
    
    if(serviceIds === null || serviceIds === undefined){
      return
    }
    var currentList = [];
    this.serviceList.forEach(val => {
      var elementPos = serviceIds.map(function(x) {return x; }).indexOf(val.id);
      if(elementPos >= 0){
        currentList.push(val);
      }
    })

    if(this.selectedServiceList.length > 0){
      var tempList = [];
      currentList.forEach(val => {
        var elementPos = this.selectedServiceList.map(function(x) {return x.id; }).indexOf(val.id);
        if(elementPos < 0){
          tempList.push(val);
        }
      })
      this.mostFrequentServiceList = tempList;
    }
    else{
      this.mostFrequentServiceList = currentList;
    }
  }

  setMostFrequentService(){
    var currentList = [];
    this.selectedServiceList.forEach(val => {
      currentList.push(val.id);
    })

    this.localStorage.setStoreValue(STORAGE_SUB_KEY.MOST_FRQUENT_SERVICES, currentList);
  }
}
