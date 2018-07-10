import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ISystemInfo } from './../models/ISystemInfo';
import { Observable, Subscription } from 'rxjs';
import { SystemInfoDispatchers } from './../store/services/system-info/system-info.dispatchers';
import { Component } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { SystemInfoSelectors, AccountDispatchers, LicenseDispatchers, BranchDispatchers, 
         ServiceDispatchers, ServicePointDispatchers } from '../store';
import { NativeApiService } from 'src/util/services/native-api.service';
import { QEvents } from 'src/services/qevents/qevents.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public systemInformation$: Observable<ISystemInfo>;

  private subscriptions: Subscription = new Subscription();

  constructor(private systemInfoDispatchers: SystemInfoDispatchers, private systemInfoSelectors: SystemInfoSelectors,
              private accountDispatchers: AccountDispatchers,
              private licenseDispatchers: LicenseDispatchers, private nativeApiService: NativeApiService,
              private router: Router, private branchDispatchers: BranchDispatchers, private servicePointDispatchers: ServicePointDispatchers , public qevents: QEvents,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.qevents.handshake();
    this.systemInfoDispatchers.fetchSystemInfo();
    this.accountDispatchers.fetchAccountInfo();
    this.branchDispatchers.fetchBranches();

    const translateSubscription = this.translateService.get('branch').subscribe(
      (branchLabel: string) => {
       this.branchDispatchers.selectBranch({id: -1, name: branchLabel});
      }
    );  
    this.subscriptions.add(translateSubscription);  
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
