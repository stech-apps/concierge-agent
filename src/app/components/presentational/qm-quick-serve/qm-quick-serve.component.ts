import { UserSelectors } from 'src/store/services';
import { IService } from './../../../../models/IService';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ServiceSelectors, ServiceDispatchers, BranchSelectors, ServicePointSelectors } from '../../../../../src/store';
import { IBranch } from '../../../../models/IBranch';
import { SPService } from 'src/util/services/rest/sp.service';
import { IServicePoint } from '../../../../models/IServicePoint';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/util/services/toast.service';
import { IServiceConfiguration } from '../../../../models/IServiceConfiguration';

@Component({
  selector: 'qm-quick-serve',
  templateUrl: './qm-quick-serve.component.html',
  styleUrls: ['./qm-quick-serve.component.scss']
})
export class QmQuickServeComponent implements OnInit, OnDestroy {

  @ViewChild('configServiceList') configServiceList: any;

  private subscriptions: Subscription = new Subscription();
  services: IServiceConfiguration[] = new Array<IServiceConfiguration>();
  selectedService: IService;
  private selectedBranch: IBranch;
  private selectedServicePoint: IServicePoint;
  private userDirection$:  Observable<string>;
  private isBottomBarVisible: boolean;
  private isTopBarVisible: boolean;

  constructor(
    private serviceSelectors: ServiceSelectors,
    private servicePointSelectors: ServicePointSelectors,
    private branchSelectors: BranchSelectors,
    private serviceDispatchers: ServiceDispatchers,
    private spService: SPService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private userSelectors: UserSelectors
  ){
    this.userDirection$ = this.userSelectors.userDirection$;
    
    const servicePointSubscription = this.servicePointSelectors.openServicePoint$.subscribe((servicePoint) => this.selectedServicePoint = servicePoint);
    this.subscriptions.add(servicePointSubscription);

    const branchSubscription = this.branchSelectors.selectedBranch$.subscribe((branch) => this.selectedBranch = branch);
    this.subscriptions.add(branchSubscription);

    const serviceConfigSubscription = this.serviceSelectors.quickServices$.subscribe((services) => {
      this.services = services;
      if(services.length > 0){
        setTimeout(() => {
          this.checkShadow();
        }, 1000);
      }
    });
    this.subscriptions.add(serviceConfigSubscription);

    const serviceSubscription = this.serviceSelectors.services$.subscribe((services) => {
      var serviceDispatchers = this.serviceDispatchers;
      var selectedBranch = this.selectedBranch;
      var quickService = this.services;
      if(services.length === 0){
        this.serviceDispatchers.fetchServices(selectedBranch);
      }
      if(services && services.length > 0 && selectedBranch && quickService.length === 0){
        serviceDispatchers.fetchServiceConfiguration(selectedBranch, services);
      }
    });
    this.subscriptions.add(serviceSubscription);

    const selectedServiceSubscription = this.serviceSelectors.selectedServices$.subscribe((services) => {
      if(services.length > 0){
        this.selectedService = services[0];
      }
      else{
        this.selectedService = null;
      }
    });
    this.subscriptions.add(selectedServiceSubscription);
  }

  ngOnInit() {
    this.selectedService = null;
    this.userDirection$ = this.userSelectors.userDirection$;
    this.isBottomBarVisible = true;
    this.isTopBarVisible = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  checkShadow(){
    this.onScroll(this.configServiceList.nativeElement);
  }

  onServiceSelect(selectedService: IService) {
    if(this.selectedService === selectedService){
      this.selectedService = null;
      this.serviceDispatchers.setSelectedServices([]);
    }
    else{
      this.selectedService = selectedService;
      this.serviceDispatchers.setSelectedServices([selectedService]);
    }
  }

  onServe() {
    this.spService.quickServe(this.selectedBranch, this.selectedServicePoint, this.selectedService).subscribe((status: any) => {
      if(status){
        this.translateService.get('customer_served').subscribe(v => {
          this.toastService.infoToast(v + ' - ' + this.selectedService.internalName.toUpperCase());
          this.selectedService = null;
        });
      }
    });
  }

  onScroll(eliment){
    let scrollHeight = eliment.scrollHeight;
    let scrollTop = eliment.scrollTop;
    let viewHight = eliment.offsetHeight;

    if((scrollTop + viewHight) > scrollHeight){
      if(this.isBottomBarVisible){
        this.isBottomBarVisible = false;
      }
    }
    else{
      if(!this.isBottomBarVisible){
        this.isBottomBarVisible = true;
      }
    }

    if(scrollTop === 0){
      if(this.isTopBarVisible){
        this.isTopBarVisible = false;
      }
    }
    else{
      if(!this.isTopBarVisible){
        this.isTopBarVisible = true;
      }
    }
  }
}
