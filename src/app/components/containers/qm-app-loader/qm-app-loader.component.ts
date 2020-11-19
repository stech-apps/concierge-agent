import { LocalStorage } from './../../../../util/local-storage';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LicenseInfoSelectors, BranchSelectors, ServicePointSelectors, BranchDispatchers,
  ServicePointDispatchers } from '../../../../store';
import { Subscription } from 'rxjs';
import { STORAGE_SUB_KEY } from 'src/util/local-storage';
import { Util } from 'src/util/util';
import { SPService } from 'src/util/services/rest/sp.service';
import { USER_STATE } from 'src/util/q-state';
import { IUserStatus } from 'src/models/IUserStatus';

@Component({
  selector: 'qm-app-loader',
  templateUrl: './qm-app-loader.component.html',
  styleUrls: ['./qm-app-loader.component.scss']
})
export class QmAppLoaderComponent implements OnInit, OnDestroy {
  licenseSubscription: Subscription;
  branches$: Subscription;
  servicePoints$: Subscription;
  readonly PROFILE_ROUTE = '/profile';
  readonly HOME_ROUTE = 'home';

  constructor( private licenseSelector: LicenseInfoSelectors,
    private router: Router, private localStorage: LocalStorage,
    private branchDispatchers: BranchDispatchers, private branchSelectors: BranchSelectors,
    private servicePointSelectors: ServicePointSelectors, private servicePointDispatchers: ServicePointDispatchers,
    private util: Util, private spService: SPService) {

    
    this.branchSelectors.branches$;
    this.licenseSubscription = this.licenseSelector.isLicenseLoaded$.subscribe(loadedState => {
      if (loadedState) {
        if (window.performance) {
          if(performance.navigation.redirectCount == 1) {
            this.spService.fetchUserStatus().subscribe((us: IUserStatus)=> {
             if(us.userState === USER_STATE.NO_STARTED_USER_SESSION ||
              us.userState === USER_STATE.NO_STARTED_SERVICE_POINT_SESSION || us.workProfileId !== null) {
              this.router.navigate([this.PROFILE_ROUTE]);
             }
             else {
              this.handleHomeNavigate()
             }
            });
          }
          else if (performance.navigation.type == 1 ) {
            this.handleHomeNavigate();
          } else {
            this.router.navigate([this.PROFILE_ROUTE]);
          }
        } else {
          this.router.navigate([this.PROFILE_ROUTE]);
        }
      }
    });
  }

  handleHomeNavigate() {
    var settingsCollection = this.localStorage.getSettings();
    
    let activeBranch = settingsCollection[STORAGE_SUB_KEY.ACTIVE_BRANCH];

    if(typeof activeBranch === 'undefined' || (this.util.getRefreshUrl() || '').toLowerCase().includes(this.PROFILE_ROUTE)) { //no active branch so we must select profile
      this.router.navigate([this.PROFILE_ROUTE]);
      return;
    }

     this.branches$ = this.branchSelectors.branches$.subscribe((bs) => {
      if (bs.length > 0) {
        let branchFound = bs.find(x => x.id == activeBranch);
        this.branchDispatchers.selectBranch(branchFound);
        this.servicePointDispatchers.fetchServicePointsByBranch(branchFound.id);

        let activeSP = settingsCollection[STORAGE_SUB_KEY.ACTIVE_WORKSTATION];
        this.servicePoints$ = this.servicePointSelectors.servicePoints$.subscribe((sps)=> {
          if (sps.length > 0) {
            let selectedSP = sps.find(x => x.id == activeSP);
            this.servicePointDispatchers.setOpenServicePoint(selectedSP);
            this.router.navigate(['/home']);
          }
        });       
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if(this.branches$) {
      this.branches$.unsubscribe();
    }

    if(this.servicePoints$) {
      this.servicePoints$.unsubscribe();
    }
  }
}
