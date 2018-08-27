import { NativeApiService } from '../../../../util/services/native-api.service';
import { IServicePoint } from '../../../../models/IServicePoint';
import { IService } from '../../../../models/IService';
import { IDropDownItem } from '../../../../models/IDropDownItem';
import { IBranch } from '../../../../models/IBranch';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  BranchSelectors, ServiceSelectors, ServicePointSelectors, ServicePointDispatchers,
  BranchDispatchers,
  UserSelectors,
  UserStatusSelectors
} from '../../../../../src/store';
import { QEvents } from 'src/util/services/qevents/qevents.service'
import { TranslateService } from '@ngx-translate/core';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ToastService } from '../../../../util/services/toast.service';
import { APP_URL } from "../../../../util/url-helper";
import { SPService } from '../../../../util/services/rest/sp.service';
import { IUserStatus } from '../../../../models/IUserStatus';
import { USER_STATE } from '../../../../util/q-state';
import { LoginService } from '../../../../util/services/login.service';
import { Router } from '@angular/router';
import { PlatformSelectors, AccountDispatchers } from 'src/store/services';
import { LocalStorage, STORAGE_SUB_KEY } from '../../../../util/local-storage';
import { servicePoint } from '../../../../store/services/data.service';

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
  navServicePoint:IServicePoint ;
  selectedBranch: IBranch;
  privacyPolicyUrl: string = null;
  userDirection$: Observable<string>;
  isEnableUseDefault: boolean;
  previousBranch:IBranch;

  constructor(private branchSelectors: BranchSelectors, private servicePointSelectors: ServicePointSelectors, private branchDispatchers: BranchDispatchers,
    private servicePointDispatchers: ServicePointDispatchers, public qevents: QEvents, private translateService: TranslateService,
    private nativeApiService: NativeApiService, private toastService: ToastService, private spService: SPService, private loginService: LoginService,
    private userSelectors: UserSelectors, private router:Router, private userStatusSelectors: UserStatusSelectors, private platformSelectors: PlatformSelectors, private localStorage: LocalStorage, private accountDispatchers: AccountDispatchers) {

             
      // this.servicePointDispatchers.setOpenServicePoint(null);
    

      this.setDefaultServicePoint();
     
      this.selectedBranch = {
        name: 'branch',
        id: -1
      };

      this.isEnableUseDefault = this.localStorage.getSettingForKey(STORAGE_SUB_KEY.REMEMBER_LOGIN);
      const previousBranchSubscription = this.branchSelectors.selectPreviousBranch$.subscribe((branch)=>{
        this.previousBranch = branch;
    })
    this.subscriptions.add(previousBranchSubscription);
      
    const branchSubscription = this.branchSelectors.branches$.subscribe((bs) => {
      this.branches = bs;
      this.setDefaultServicePoint();
      if (bs.length === 1) {
        this.onBranchSelect(bs[0]);
      }
      else{
        this.checkPreviousSelection(STORAGE_SUB_KEY.ACTIVE_BRANCH);
      }
});
    this.subscriptions.add(branchSubscription);

    
    const servicePointsSubscription = this.servicePointSelectors.servicePoints$.subscribe((sps) => {
     
      this.servicePoints = sps;
      if (sps.length === 1) {
        this.onServicePointSelect(sps[0]);
        if (this.branches.length === 1) {
          this.onConfirmProfile();
        }
      }
      else{
        this.checkPreviousSelection(STORAGE_SUB_KEY.ACTIVE_WORKSTATION);
        
      }

      if(this.isEnableUseDefault && this.selectedBranch && this.selectedServicePoint && !this.previousBranch){
        this.onConfirmProfile();
      }
    });
    this.subscriptions.add(servicePointsSubscription);
    this.userDirection$ = this.userSelectors.userDirection$;

  }

  ngOnInit() {
   const navServiceSubscription = this.servicePointSelectors.previousServicePoint$.subscribe((spo)=>{
      this.navServicePoint = spo
    }
  );
  this.subscriptions.add(navServiceSubscription);
  
 
}

  setDefaultServicePoint() {
   
    this.selectedServicePoint = {
      name: 'service_point',
      id: -1,
      unitId: null,
      parameters: null,
      state: null
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
      this.setDefaultServicePoint();
    }
  }

  onServicePointSelect(selectedSp: IServicePoint) {
    
    this.selectedServicePoint = selectedSp;
    if (this.selectedServicePoint.parameters.privacyPolicy && this.selectedServicePoint.parameters.privacyPolicy.length > 0) {
      this.privacyPolicyUrl = this.selectedServicePoint.parameters.privacyPolicy;
    }
    else {
      this.privacyPolicyUrl = '';
    }
  }

  collapseSiblingDropDowns(dd: any) {
    dd.isExpanded = false;
  }
  

  onCancel() {
    if(this.previousBranch){
      this.branchDispatchers.selectBranch(this.previousBranch);
      this.servicePointDispatchers.setOpenServicePoint(this.navServicePoint);
      this.router.navigate(['home']);
    } else{

      if (this.nativeApiService.isNativeBrowser()) {
        this.nativeApiService.logOut();
      }
      else {
        window.location.href = APP_URL;
      }
    }
  
  }

  onConfirmProfile() {
    if (this.selectedBranch.id === -1 && !this.isEnableUseDefault) {
      this.translateService.get('no_branch_set').subscribe(v => {
        this.toastService.infoToast(v);
      });
    }
    else if (this.selectedServicePoint.id === -1 && !this.isEnableUseDefault) {
      this.translateService.get('no_workstation_set').subscribe(v => {
        this.toastService.infoToast(v);
      });
    }
    else {
      this.loginService.login(this.selectedServicePoint);
    }
  }

  showPrivacyPolicyUrl($event) {
    this.platformSelectors.isMobile$.subscribe((isMobile)=> {
      if(isMobile) {
        this.nativeApiService.showPrivacy(this.privacyPolicyUrl);
      }
      else {
        window.open(this.privacyPolicyUrl, "_blank");
      }
    }).unsubscribe();
  }

  checkPreviousSelection(key: STORAGE_SUB_KEY){
    var previousSelection = this.localStorage.getSettings();
    if(previousSelection.length === 0){
      return
    }
    if(key === STORAGE_SUB_KEY.ACTIVE_BRANCH){
      var priviousBranchSelection = this.branches.filter(val => {
        return val.id === previousSelection[STORAGE_SUB_KEY.ACTIVE_BRANCH]
      })
      if(priviousBranchSelection.length > 0){
        this.onBranchSelect(priviousBranchSelection[0]);
      }
    }
    if(key === STORAGE_SUB_KEY.ACTIVE_WORKSTATION){
      var priviousWorksationSelection = this.servicePoints.filter(val => {
        return val.id === previousSelection[STORAGE_SUB_KEY.ACTIVE_WORKSTATION]
      })
      if(priviousWorksationSelection.length > 0){
        this.onServicePointSelect(priviousWorksationSelection[0]);
      }
    }
  }

  onSwitchChange(){
    this.accountDispatchers.setUseDefaultStatus(this.isEnableUseDefault);
  }
  
  // Temp function
  goToCustomer(){
   this.router.navigate(['customers']);
    console.log(this.branches)
  }
}
