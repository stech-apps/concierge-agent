import { NativeApiService } from "../../../../util/services/native-api.service";
import { IServicePoint } from "../../../../models/IServicePoint";
import { IService } from "../../../../models/IService";
import { IDropDownItem } from "../../../../models/IDropDownItem";
import { IBranch } from "../../../../models/IBranch";
import { Subscription, Observable } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  BranchSelectors,
  ServiceSelectors,
  ServicePointSelectors,
  ServicePointDispatchers,
  BranchDispatchers,
  UserSelectors,
  UserStatusSelectors
} from "../../../../../src/store";
import { QEvents } from "src/util/services/qevents/qevents.service";
import { TranslateService } from "@ngx-translate/core";
import { AfterViewInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { ToastService } from "../../../../util/services/toast.service";
import { APP_URL } from "../../../../util/url-helper";
import { SPService } from "../../../../util/services/rest/sp.service";
import { IUserStatus } from "../../../../models/IUserStatus";
import { USER_STATE } from "../../../../util/q-state";
import { LoginService } from "../../../../util/services/login.service";
import { Router, NavigationEnd } from "@angular/router";
import { PlatformSelectors, AccountDispatchers } from "src/store/services";
import { LocalStorage, STORAGE_SUB_KEY } from "../../../../util/local-storage";
import { servicePoint } from "../../../../store/services/data.service";
import { ActivatedRoute } from "@angular/router";
import { IAccount } from "../../../../models/IAccount";
import { Recycle } from "../../../../util/services/recycle.service";
import { QueueService } from "src/util/services/queue.service";
import { PlatformLocation } from "@angular/common";

@Component({
  selector: "qm-profile",
  templateUrl: "./qm-profile.component.html",
  styleUrls: ["./qm-profile.component.scss"]
})
export class QmProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscriptions: Subscription = new Subscription();
  branches: IBranch[] = new Array<IBranch>();
  servicePoints: IServicePoint[] = new Array<IServicePoint>();
  selectedServicePoint: IServicePoint;
  navServicePoint: IServicePoint;
  selectedBranch: IBranch;
  privacyPolicyUrl: string = null;
  userDirection$: Observable<string>;
  isEnableUseDefault: boolean;
  previousBranch: IBranch;
  user: IAccount;
  errorMessage: string;
  skipBranchFocus:boolean = false;

  constructor(
    private branchSelectors: BranchSelectors,
    private servicePointSelectors: ServicePointSelectors,
    private branchDispatchers: BranchDispatchers,
    private servicePointDispatchers: ServicePointDispatchers,
    public qevents: QEvents,
    private translateService: TranslateService,
    private nativeApiService: NativeApiService,
    private toastService: ToastService,
    private spService: SPService,
    private loginService: LoginService,
    private userSelectors: UserSelectors,
    private router: Router,
    private userStatusSelectors: UserStatusSelectors,
    private ActivatedRoute: ActivatedRoute,
    private platformSelectors: PlatformSelectors,
    private localStorage: LocalStorage,
    private accountDispatchers: AccountDispatchers,
    private recycleService: Recycle,
    private queueService: QueueService,
    location: PlatformLocation
  ) {

    // on Browser back button pressed
    location.onPopState(() => {
      if (this.previousBranch) {
        // window.alert("back button pressed");
        this.branchDispatchers.selectBranch(this.previousBranch);
        this.servicePointDispatchers.setOpenServicePoint(this.navServicePoint);
      //   this.router.navigate(["home"]);
      // } else {
      //   if (this.nativeApiService.isNativeBrowser()) {
      //     this.nativeApiService.logOut();
      //   } else {
      //     window.location.href = APP_URL;
      //   }
      }
      
    });


    // Get the current User
    const userSubscription = this.userSelectors.user$.subscribe(
      user =>  {
        this.user = user;
        this.isEnableUseDefault = this.localStorage.getUserStoreObjectValue(
          user.id,
          STORAGE_SUB_KEY.REMEMBER_LOGIN,
          STORAGE_SUB_KEY.REMEMBER_LOGIN,
          false
        );
      }
    );
    this.subscriptions.add(userSubscription);

    // For comming through edit button
    const navServiceSubscription = this.servicePointSelectors.previousServicePoint$.subscribe(
      spo => {
        this.navServicePoint = spo;
      }
    );
    this.subscriptions.add(navServiceSubscription);
    const previousBranchSubscription = this.branchSelectors.selectPreviousBranch$.subscribe(
      branch => {
        this.previousBranch = branch;
      }
    );
    this.subscriptions.add(previousBranchSubscription);


    // set default service point and default branch  
    this.servicePointDispatchers.setOpenServicePoint(null);
    this.setDefaultServicePoint();
    this.selectedBranch = {
      name: 'label.profile.select.branch',
      id: -1
    };

    // Check branch is selected
    const branchSubscription = this.branchSelectors.branches$.subscribe(bs => {
      this.branches = bs;
      this.setDefaultServicePoint();
      if (bs.length === 1) {
        this.onBranchSelect(bs[0]);
      } else {
        // Check whether there is a previous selection
        this.checkPreviousSelection(STORAGE_SUB_KEY.ACTIVE_BRANCH);
      }
    });
    this.subscriptions.add(branchSubscription);

    const servicePointsSubscription = this.servicePointSelectors.servicePoints$.subscribe(
      sps => {
        this.servicePoints = sps;
        if (sps.length === 1) {
          this.onServicePointSelect(sps[0]);
          if (this.branches.length === 1 && !this.previousBranch) {
            this.onConfirmProfile();
          }
        } else {
          this.checkPreviousSelection(STORAGE_SUB_KEY.ACTIVE_WORKSTATION);
        }

        if (
          this.isEnableUseDefault &&
          sps.length > 0 &&
          this.selectedBranch &&
          this.selectedServicePoint &&
          !this.previousBranch
        ) {
          this.onConfirmProfile();
        }
      }
    );
    this.subscriptions.add(servicePointsSubscription);
    this.userDirection$ = this.userSelectors.userDirection$;

  }

  ngOnInit() {
    this.queueService.stopQueuePoll();
    setTimeout(() => {
      if( this.isEnableUseDefault && ((this.selectedBranch.id == -1) &&
        (this.selectedServicePoint.id==-1))  ){
          this.isEnableUseDefault =false;
        }
    }, 100 );   
  }

  setDefaultServicePoint() {
        this.selectedServicePoint = {
          name: 'label.profile.select.servicepoint',
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
      this.servicePointDispatchers.fetchServicePointsByBranch(
        selectedBranch.id
      );
      this.selectedBranch = selectedBranch;
      this.branchDispatchers.selectBranch(selectedBranch);
      this.setDefaultServicePoint();
    }
  }

  onServicePointSelect(selectedSp: IServicePoint) {
    this.selectedServicePoint = selectedSp;
    if (
      this.selectedServicePoint.parameters.privacyPolicy &&
      this.selectedServicePoint.parameters.privacyPolicy.length > 0
    ) {
      this.privacyPolicyUrl = this.selectedServicePoint.parameters.privacyPolicy;
    } else {
      this.privacyPolicyUrl = "";
    }
  }

  collapseSiblingDropDowns(dd: any) {
    dd.isExpanded = false;
  }

  onCancel() {
    if (this.previousBranch) {
      this.branchDispatchers.selectBranch(this.previousBranch);
      this.servicePointDispatchers.setOpenServicePoint(this.navServicePoint);
      this.router.navigate(["home"]);
    } else {
      if (this.nativeApiService.isNativeBrowser()) {
        this.nativeApiService.logOut();
      } else {
        window.location.href = APP_URL;
      }
    }
  }

  onConfirmProfile() {
    this.errorMessage = null;
    this.accountDispatchers.setUseDefaultStatus(this.isEnableUseDefault);
    if (this.selectedBranch.id === -1 && !this.isEnableUseDefault) {
      this.translateService.get("no_branch_set").subscribe(v => {
        //this.toastService.infoToast(v);
        this.errorMessage = v;
      });
    } else if (
      this.selectedServicePoint.id === -1 ) {
      this.translateService.get("no_workstation_set").subscribe(v => {
        //this.toastService.infoToast(v);
        this.errorMessage = v;
      });
    }
     else {
      this.recycleService.removeAppCache();
      this.loginService.login(
        this.selectedBranch,
        this.selectedServicePoint,
        this.user,
        this.previousBranch
      );
    }
  }

  showPrivacyPolicyUrl($event) {
    this.platformSelectors.isMobile$
      .subscribe(isMobile => {
        if (isMobile) {
          this.nativeApiService.showPrivacy(this.privacyPolicyUrl);
        } else {
          window.open(this.privacyPolicyUrl, "_blank");
        }
      })
      .unsubscribe();
  }

  checkPreviousSelection(key: STORAGE_SUB_KEY) {
    var previousSelection = this.localStorage.getSettings();
    if((previousSelection.user_id!=this.user.id) && !this.previousBranch){
      this.setDefaultServicePoint();
      return;
    }
    
    if (previousSelection.length === 0) {
      return;
    }
    if (key === STORAGE_SUB_KEY.ACTIVE_BRANCH) {
      var priviousBranchSelection = this.branches.filter(val => {
        return val.id === previousSelection[STORAGE_SUB_KEY.ACTIVE_BRANCH];
      });
      if (priviousBranchSelection.length > 0) {
        this.onBranchSelect(priviousBranchSelection[0]);
      }
    }
    if (key === STORAGE_SUB_KEY.ACTIVE_WORKSTATION) {
      var priviousWorksationSelection = this.servicePoints.filter(val => {
        return val.id === previousSelection[STORAGE_SUB_KEY.ACTIVE_WORKSTATION];
      });
      if (priviousWorksationSelection.length > 0) {
        this.onServicePointSelect(priviousWorksationSelection[0]);
      }
    }
  }

  // onSwitchChange(){
  //   this.accountDispatchers.setUseDefaultStatus(this.isEnableUseDefault);
  // }


  closeDropDown(dd1, dd2) {
    dd1.isExpanded = false;
    dd2.isExpanded = false;
  }
}
