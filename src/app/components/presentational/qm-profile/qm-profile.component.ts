import { Router } from '@angular/router';
import { NativeApiService } from './../../../../util/services/native-api.service';
import { IServicePoint } from './../../../../models/IServicePoint';
import { IService } from './../../../../models/IService';
import { IDropDownItem } from './../../../../models/IDropDownItem';
import { IBranch } from './../../../../models/IBranch';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  BranchSelectors, ServiceSelectors, ServicePointSelectors, ServicePointDispatchers,
  BranchDispatchers
} from '../../../../../src/store';
import { QEvents } from 'src/util/services/qevents/qevents.service'
import { TranslateService } from '@ngx-translate/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ToastService } from 'src/util/services/toast.service';

@Component({
  selector: 'qm-profile',
  templateUrl: './qm-profile.component.html',
  styleUrls: ['./qm-profile.component.scss']
})
export class QmProfileComponent implements OnInit, OnDestroy, AfterViewInit {

  private subscriptions: Subscription = new Subscription();
  branches: IBranch[] = new Array<IBranch>();
  servicePoints: IServicePoint[] = new Array<IServicePoint>();
  selectedServicePoint: IServicePoint;
  selectedBranch: IBranch;

  constructor(private branchSelectors: BranchSelectors, private servicePointSelectors: ServicePointSelectors, private branchDispatchers: BranchDispatchers,
    private servicePointDispatchers: ServicePointDispatchers, public qevents: QEvents, private translateService: TranslateService,
    private nativeApiService: NativeApiService, private toastService: ToastService, private router: Router) {

    const branchSubscription = this.branchSelectors.branches$.subscribe((bs) => this.branches = bs);
    this.subscriptions.add(branchSubscription);

    const servicePointsSubscription = this.servicePointSelectors.servicePoints$.subscribe((sps) => this.servicePoints = sps);
    this.subscriptions.add(servicePointsSubscription);
  }

  ngOnInit() {
    this.servicePointDispatchers.setOpenServicePoint(null);

    this.selectedServicePoint = {
      name: 'service_point',
      id: -1,
      unitId: null,
      parameters: null,
      state: null
    };

    this.selectedBranch = {
      name: 'branch',
      id: -1
    };
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.nativeApiService.showNativeLoader(false);
  }

  onBranchSelect(selectedBranch: IBranch) {
    if (this.selectedBranch.id != selectedBranch.id) {
      this.servicePointDispatchers.fetchServicePointsByBranch(selectedBranch.id);
      this.selectedBranch = selectedBranch;
      this.branchDispatchers.selectBranch(selectedBranch);
    }
  }

  onServicePointSelect(selectedSp: IServicePoint) {
    this.selectedServicePoint = selectedSp;

  }

  onCancel() {
    this.router.navigate(['home']);
  }

  onConfirmProfile() {
    if (this.selectedServicePoint.id === -1) {
      this.translateService.get('no_workstation_set').subscribe(v => {
        this.toastService.infoToast(v);
      });
    }
    else {
      this.servicePointDispatchers.setOpenServicePoint(this.selectedServicePoint);
      this.router.navigate(['home']);
    }
  }
}
