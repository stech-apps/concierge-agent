import { LocalStorage } from './../../../../util/local-storage';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LicenseInfoSelectors, BranchSelectors, ServicePointSelectors, BranchDispatchers,
  ServicePointDispatchers } from '../../../../store';
import { Subscription } from 'rxjs';
import { STORAGE_SUB_KEY } from 'src/util/local-storage';
import { Util } from 'src/util/util';

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

  constructor( private licenseSelector: LicenseInfoSelectors,
    private router: Router, private localStorage: LocalStorage,
    private branchDispatchers: BranchDispatchers, private branchSelectors: BranchSelectors,
    private servicePointSelectors: ServicePointSelectors, private servicePointDispatchers: ServicePointDispatchers,
    private util: Util) {

    
    this.branchSelectors.branches$;
    this.licenseSubscription = this.licenseSelector.isLicenseLoaded$.subscribe(loadedState => {
      if (loadedState) {
       this.handleRefreshEvent();
      }
    });
  }

  handleRefreshEvent() {
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
