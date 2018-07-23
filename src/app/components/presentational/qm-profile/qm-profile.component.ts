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
import { APP_URL } from "src/util/url-helper";
import { SPService } from '../../../../util/services/rest/sp.service';
import { IUserStatus } from '../../../../models/IUserStatus';
import { USER_STATE } from '../../../../util/q-state';
import { LoginService } from 'src/util/services/login.service';

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
  currentStatus: IUserStatus;

  constructor(private branchSelectors: BranchSelectors, private servicePointSelectors: ServicePointSelectors, private branchDispatchers: BranchDispatchers,
    private servicePointDispatchers: ServicePointDispatchers, public qevents: QEvents, private translateService: TranslateService,
    private nativeApiService: NativeApiService, private toastService: ToastService, private spService: SPService, private loginService: LoginService) {

    const branchSubscription = this.branchSelectors.branches$.subscribe((bs) => {
      this.branches = bs;
      if(bs.length === 1){
        this.onBranchSelect(bs[0]);
      }
    });
    this.subscriptions.add(branchSubscription);

    const servicePointsSubscription = this.servicePointSelectors.servicePoints$.subscribe((sps) => {
      this.servicePoints = sps;
      if(sps.length === 1){
        this.onServicePointSelect(sps[0]);
        if(this.branches.length === 1){
          this.onConfirmProfile();
        }
      }
    });
    this.subscriptions.add(servicePointsSubscription);

    const userStateSubscription = this.spService.fetchUserStatus().subscribe((status: any) => this.currentStatus = status);
    this.subscriptions.add(userStateSubscription);
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
    if(this.nativeApiService.isNativeBrowser){
      window.location.href = APP_URL;
    }
    else{
      this.nativeApiService.logOut();
    }
  }

  onConfirmProfile() {
    if (this.selectedBranch.id === -1) {
      this.translateService.get('no_branch_set').subscribe(v => {
        this.toastService.infoToast(v);
      });
    }
    else if (this.selectedServicePoint.id === -1) {
      this.translateService.get('no_workstation_set').subscribe(v => {
        this.toastService.infoToast(v);
      });
    }
    else {
      this.loginService.login(this.selectedServicePoint);
    }
  }
}
