import { QmClearInputDirective } from './../../../directives/qm-clear-input.directive';
import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FLOW_TYPE } from '../../../../util/flow-state';
import { Subscription, Subject, Observable } from 'rxjs';
import { ServiceSelectors, ServiceDispatchers, BranchSelectors, CalendarBranchSelectors, CalendarServiceDispatchers, CalendarServiceSelectors, ServicePointSelectors, ArriveAppointmentSelectors, TimeslotDispatchers, ReserveDispatchers, UserSelectors } from '../../../../../src/store';
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
  styleUrls: ['./qm-select-service.component.scss'],
  host: {'class': 'qm-service-page'}
})
export class QmSelectServiceComponent implements OnInit {

  private subscriptions: Subscription = new Subscription();
  public serviceList: ICalendarService[];
  filteredServiceList: IServiceViewModel[] = new Array<IServiceViewModel>();
  selectedServiceList: IServiceViewModel[] = new Array<IServiceViewModel>();
  mostFrequentServiceList: IServiceViewModel[] = new Array<IServiceViewModel>();
  selectedBranch: IBranch;
  loginBranch: IBranch;
  isMultiServiceOn: boolean;
  private maxServiceSelection = 5;
  filterText: string = '';
  inputChanged: Subject<string> = new Subject<string>();
  newf: FLOW_TYPE.CREATE_APPOINTMENT;
  multiServiceEnabled: boolean;
  searchText: string;
  userDirection$: Observable<string>; 

  multiserviceButtonFocused:boolean;
  @ViewChild(QmClearInputDirective) clearInputDirective:QmClearInputDirective;

  mostFrequentServiceCount = 5;
  searchFieldServiceCount = 10;

  isInitialServiceLoaded = false;
  showToolTip:boolean;

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
    private servicePointSelectors: ServicePointSelectors,
    private appointmentSelectors: ArriveAppointmentSelectors,
    public userSelectors:UserSelectors,
    private timeSlotDispatchers: TimeslotDispatchers,
    private reserveDispatcher: ReserveDispatchers
  ) { 
    this.selectedServiceList = [];
    this.filteredServiceList = [];
    this.userDirection$ = this.userSelectors.userDirection$;
    this.showToolTip = false;
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
        this.resetShowInfoFlags(services);
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

      const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((branch) => this.loginBranch = branch);
      this.subscriptions.add(branchSubscription);

      const calendarBranchSubscription = this.calendarBranchSelectors.selectedBranch$.subscribe((branch) => {
        this.selectedBranch = branch;
        this.selectedServiceList = [];
        if(branch.id !== -1 && (((this.selectedBranch as ICalendarBranch).qpId !== this.loginBranch.id) || !this.isInitialServiceLoaded)){
          this.calendarServiceDispatchers.fetchServices(branch as ICalendarBranch);
        }
        else if((this.selectedBranch as ICalendarBranch).qpId === this.loginBranch.id){
          this.calendarServiceDispatchers.setCalendarServiceFromCache();
        }
      });
      this.subscriptions.add(calendarBranchSubscription);

      const initialCalendarServiceSubscription = this.calendarServiceSelectors.initialService$.subscribe((services) => {
        if(services === null){
          this.isInitialServiceLoaded = false;
        if(this.selectedBranch.id !==-1){
          this.calendarServiceDispatchers.fetchServices(this.selectedBranch as ICalendarBranch);
        }
        
        }
        else{
          if((this.selectedBranch as ICalendarBranch).qpId === this.loginBranch.id){
            this.calendarServiceDispatchers.setCalendarServiceFromCache();
          }
        }
      });
      this.subscriptions.add(initialCalendarServiceSubscription);

      // calendar branch subscription
      const calendarServiceSubscription = this.calendarServiceSelectors.services$.subscribe((services) => {
        this.serviceList = <Array<IServiceViewModel>>services;
        if(this.serviceList !== null){
          this.filteredServiceList = <Array<IServiceViewModel>>services;
          this.checkMostFrequentService();

          if((this.selectedBranch as ICalendarBranch).qpId === this.loginBranch.id && this.isInitialServiceLoaded === false){
            this.isInitialServiceLoaded = true;
            this.calendarServiceDispatchers.setInitialService();
          }
        }
      });
      this.subscriptions.add(calendarServiceSubscription);
    }

    if(this.flowType === FLOW_TYPE.ARRIVE_APPOINTMENT){
      const appointmentSubscription = this.appointmentSelectors.selectedAppointment$.subscribe((appointment) => {
        if(appointment){
          this.selectedServiceList = <Array<IServiceViewModel>>appointment.services;
          this.selectedServiceList.forEach(val => {
            val.isBind = true;
          })
          
          this.serviceDispatchers.setSelectedServices(this.selectedServiceList as IService[]);
          this.checkAvaibleServices();
          this.checkMostFrequentService();
        }
      });
      this.subscriptions.add(appointmentSubscription);
    }

    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params){
        if(this.flowType === FLOW_TYPE.CREATE_APPOINTMENT) {
          this.multiServiceEnabled = params.mltyService;
        }
        else {
          this.multiServiceEnabled = true; // multi service switch is only considered for create flows
        }

        this.mostFrequentServiceCount = params.serviceThreshold2ShowHideServiceCategories;
        this.searchFieldServiceCount = params.serviceThreshold2ShowHideSearchArea;
        this.checkMultiServiceSettings();
      }
    });
    this.subscriptions.add(servicePointsSubscription);

    this.inputChanged
    .pipe(distinctUntilChanged(), debounceTime(DEBOUNCE_TIME || 0))
    .subscribe(text => this.filterServices(text));
  }

  resetShowInfoFlags(services: Array<any>) {
    if(services && services.length > 0) {
      for (let index = 0; index < services.length; index++) {
        services[index].showInfo = false;
        services[index].showInfoInMostFrequent = false;
      }
    }
  }

  checkMultiServiceSettings() {
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

    if(this.multiServiceEnabled){
      let multiServiceSetting = this.localStorage.getSettingForKey(storeKey);
      if (typeof multiServiceSetting !== 'undefined') {
        this.isMultiServiceOn = multiServiceSetting;
      }
      else {
        this.isMultiServiceOn = false;
      }
    }
  }

  onFlowStepActivated() {
    this.searchText = '';
    this.filterText = '';
    if(this.serviceList && this.serviceList.length >= this.searchFieldServiceCount){
      if(this.clearInputDirective){
        this.clearInputDirective.updateButtonVisibility('');
      }
    }
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

      /*
      this.translateService.get('limit_max_service').subscribe(v => {
        this.toastService.errorToast(v);
      });
      */

      this.selectedServiceList = [];

      this.handleServiceList(selectedService, isRemove);
    }
    else if(this.selectedServiceList.length > 0 && !this.isMultiServiceOn){
      this.qmModalService.openForTransKeys('', 'enable_multi_serv_switch', 'yes', 'no', (v) => {
        if(v) {
          this.isMultiServiceOn = true;
          this.onSwitchChange();
          this.handleServiceList(selectedService, isRemove);
        }
      }, ()=> {});
    }
    else if(this.selectedServiceList.length === 5){
      this.translateService.get('limit_max_service').subscribe(v => {
        this.toastService.errorToast(v);
      });
    }
    else{
      this.translateService.get('limit_max_service').subscribe(v => {
        this.toastService.errorToast(v);
      });
    }
  }

  handleServiceList(selectedService: IServiceViewModel, isRemove: boolean){
    this.selectedServiceList.push(selectedService);
    this.selectedServiceList = this.selectedServiceList.filter(
      (val: IService) =>
        val.id !== 0
    );
    
    if(this.flowType === FLOW_TYPE.CREATE_APPOINTMENT){
      this.timeSlotDispatchers.resetTimeslots();
      this.timeSlotDispatchers.deselectTimeslot();
      this.reserveDispatcher.resetReserveAppointment();
      this.calendarServiceDispatchers.setSelectedServices(this.selectedServiceList);
      this.calendarServiceDispatchers.fetchServiceGroups(this.selectedServiceList, this.selectedBranch as ICalendarBranch, this.multiServiceEnabled);
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
      this.timeSlotDispatchers.deselectTimeslot();
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

  checkAvaibleServices(){
    if(this.selectedServiceList.length > 0){
      var tempList = [];
      this.serviceList.forEach(val => {
        var elementPos = this.selectedServiceList.map(function(x) {return x.id; }).indexOf(val.id);
        if(elementPos < 0){
          tempList.push(val);
        }
      })
      this.filteredServiceList = tempList;
    }
  }

  handleInput($event) {
    this.inputChanged.next($event.target.value);
  }

  filterServices(newFilter: string) {    
    this.filterText = newFilter;
   }

  doneButtonClick() {
    this.calendarServiceDispatchers.setCalendarServiceSelected(true);
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
    var serviceIds = serviceIds = this.localStorage.getStoreForKey(this.localStorage.getStorageKey(this.flowType));

    if(serviceIds !== null && serviceIds !== undefined){
      serviceIds.sort(function(a,b) {return (a.usage > b.usage) ? -1 : ((b.usage > a.usage) ? 1 : 0);} ); 

      if(serviceIds.length >= this.mostFrequentServiceCount){
        serviceIds = serviceIds.slice(0, this.mostFrequentServiceCount);
      }
    }

    return serviceIds;
  }

  checkMostFrequentService(){
    var serviceIds = this.getMostFrequnetServices();
    
    if(serviceIds === null || serviceIds === undefined){
      return
    }
    var currentList = [];
    serviceIds.forEach(val => {
      var tempObj = this.serviceList.filter(obj => {
        if(this.flowType === FLOW_TYPE.CREATE_VISIT || this.flowType === FLOW_TYPE.ARRIVE_APPOINTMENT){
          return val.id === obj.id;
        }
        else if(this.flowType === FLOW_TYPE.CREATE_APPOINTMENT){
          return val.publicId === obj.publicId;
        }
      })

      if(tempObj && tempObj.length > 0){
        currentList.push(tempObj[0]);
      }
    })

    if(this.selectedServiceList.length > 0){
      var tempList = [];
      currentList.forEach(val => {
        var elementPos = 1;
        if(this.flowType === FLOW_TYPE.CREATE_VISIT || this.flowType === FLOW_TYPE.ARRIVE_APPOINTMENT){
          elementPos = this.selectedServiceList.map(function(x) {return x.id; }).indexOf(val.id);
        }
        else if(this.flowType === FLOW_TYPE.CREATE_APPOINTMENT){
          elementPos = this.selectedServiceList.map(function(x) {
            return x.publicId; 
          }).indexOf(val.publicId);
        }
        if(elementPos < 0){
          tempList.push(val);
        }
      })
      if(this.serviceList.length >= this.mostFrequentServiceCount){
        this.mostFrequentServiceList = tempList;
      }
      else{
        this.mostFrequentServiceList = [];
      }
    }
    else{
      if(this.serviceList.length >= this.mostFrequentServiceCount){
        this.mostFrequentServiceList = currentList;
      }
      else{
        this.mostFrequentServiceList = [];
      }
    }
  }

  setMostFrequentService(){
    var currentList = [];
    this.selectedServiceList.forEach(val => {
      currentList.push(val.id);
    })

    this.localStorage.setStoreValue(STORAGE_SUB_KEY.MOST_FRQUENT_SERVICES, currentList);
  }
  
  clickedshowToolTip(){  
    if(this.showToolTip){
      this.showToolTip = false;
    }else{
      this.showToolTip = true;
    }
  
  }
}
