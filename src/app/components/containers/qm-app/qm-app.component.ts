import { UserSelectors } from '../../../../store';
import { NativeApiService } from '../../../../util/services/native-api.service';
import { Observable } from 'rxjs';
import { ISystemInfo } from '../../../../models/ISystemInfo';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SystemInfoSelectors } from '../../../../store';

@Component({
  selector: 'qm-app',
  templateUrl: './qm-app.component.html',
  styleUrls: ['./qm-app.component.scss']
})
export class QmAppComponent implements OnInit, AfterViewInit {

  public systemInformation$: Observable<ISystemInfo> = this.systemInfoSelectors.systemInfo$;
  userDirection$: Observable<string>;
  constructor(private systemInfoSelectors: SystemInfoSelectors, private nativeApiService: NativeApiService,
              private userSelectors: UserSelectors) { 
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if(this.nativeApiService.isNativeBrowser()) {
      this.nativeApiService.showNativeLoader(false);
    }
  }
}
