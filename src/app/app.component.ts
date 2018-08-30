import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ISystemInfo } from './../models/ISystemInfo';
import { Observable, Subscription } from 'rxjs';
import { SystemInfoDispatchers } from './../store/services/system-info/system-info.dispatchers';
import { Component } from '@angular/core';
import { OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  SystemInfoSelectors, AccountDispatchers, LicenseDispatchers, BranchDispatchers,
  ServiceDispatchers, ServicePointDispatchers, UserStatusDispatchers, UserSelectors
} from '../store';
import { NativeApiService } from 'src/util/services/native-api.service';
import { QEvents } from 'src/util/services/qevents/qevents.service'
import { ToastService } from 'src/util/services/toast.service';
import { ToastContainerDirective } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public systemInformation$: Observable<ISystemInfo>;
  hostAddress = "127.0.0.1";

  private subscriptions: Subscription = new Subscription();
  userDirection$: Observable<string>;
  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  constructor(private systemInfoDispatchers: SystemInfoDispatchers, private systemInfoSelectors: SystemInfoSelectors,
    private accountDispatchers: AccountDispatchers,
    private licenseDispatchers: LicenseDispatchers, private nativeApiService: NativeApiService,
    private router: Router, private branchDispatchers: BranchDispatchers, private userStatusDispatchers: UserStatusDispatchers, private servicePointDispatchers: ServicePointDispatchers, public qevents: QEvents,
    private translateService: TranslateService, private toastService: ToastService, private userSelectors: UserSelectors) {
  }

  ngOnInit() {
    this.qevents.handshake(this.qevents);
    this.systemInfoDispatchers.fetchSystemInfo();
    this.accountDispatchers.fetchAccountInfo();
    this.branchDispatchers.fetchBranches();
    this.userStatusDispatchers.fetchUserStatus();
    this.userDirection$ = this.userSelectors.userDirection$;

    const translateSubscription = this.translateService.get('branch').subscribe(
      (branchLabel: string) => {
        this.branchDispatchers.selectBranch({ id: -1, name: branchLabel });
      }
    );
    this.subscriptions.add(translateSubscription);
    console.log('setting toast container', this.toastContainer);
    this.toastService.setToastContainer(this.toastContainer);

    this.systemInfoSelectors.systemInfoHost$.subscribe(host => {
      if (host && this.hostAddress != host) {
        this.systemInfoDispatchers.setDistributedAgent();
      }
    }

    )
    
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  
  }

