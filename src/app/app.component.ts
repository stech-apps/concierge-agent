import { ISystemInfo } from './../models/ISystemInfo';
import { Observable } from 'rxjs';
import { SystemInfoDispatchers } from './../store/services/system-info/system-info.dispatchers';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { SystemInfoSelectors } from 'src/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public systemInformation$: Observable<ISystemInfo>;
  constructor( private systemInfoDispatchers: SystemInfoDispatchers, private systemInfoSelectors: SystemInfoSelectors) {
    this.systemInformation$ = this.systemInfoSelectors.systemInfo$;
  }

  ngOnInit() {
    this.systemInfoDispatchers.fetchSystemInfo();
  }
}
