import { Router } from '@angular/router';
import { NativeApiService } from './../../../../util/services/native-api.service';
import { IServicePoint } from './../../../../models/IServicePoint';
import { IService } from './../../../../models/IService';
import { IDropDownItem } from './../../../../models/IDropDownItem';
import { IBranch } from './../../../../models/IBranch';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BranchSelectors, ServiceSelectors, ServicePointSelectors, ServicePointDispatchers,
         BranchDispatchers } from '../../../../../src/store';
import { QEvents } from 'src/util/services/qevents/qevents.service'
import { TranslateService } from '@ngx-translate/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ToastService } from 'src/util/services/toast.service';

@Component({
  selector: 'qm-quick-serve',
  templateUrl: './qm-quick-serve.component.html',
  styleUrls: ['./qm-quick-serve.component.scss']
})
export class QmQuickServeComponent implements OnInit, OnDestroy, AfterViewInit {

  private subscriptions: Subscription = new Subscription();
  branches: IBranch[] = new Array<IBranch>();
  services: IServicePoint[] = new Array<IServicePoint>();
  selectedService: IServicePoint;

  constructor(private branchSelectors: BranchSelectors, private servicePointSelectors: ServicePointSelectors, private branchDispatchers: BranchDispatchers,
              private servicePointDispatchers: ServicePointDispatchers, public qevents: QEvents, private translateService: TranslateService,
              private nativeApiService: NativeApiService, private toastService: ToastService, private router: Router){

    const branchSubscription = this.branchSelectors.branches$.subscribe((bs) => this.branches = bs);
    this.subscriptions.add(branchSubscription);

    const servicePointsSubscription = this.servicePointSelectors.servicePoints$.subscribe((sps) => this.services = sps);
    this.subscriptions.add(servicePointsSubscription);
  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.nativeApiService.showNativeLoader(false);
  }


  onServiceSelect(selectedService: IServicePoint) {
    this.selectedService = selectedService;
     
  }

  onServe() {

  }
}
