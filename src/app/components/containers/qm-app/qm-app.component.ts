import { Observable } from 'rxjs';
import { ISystemInfo } from './../../../../models/ISystemInfo';
import { Component, OnInit } from '@angular/core';
import { SystemInfoSelectors } from 'src/store';

@Component({
  selector: 'qm-app',
  templateUrl: './qm-app.component.html',
  styleUrls: ['./qm-app.component.scss']
})
export class QmAppComponent implements OnInit {

  public systemInformation$: Observable<ISystemInfo> = this.systemInfoSelectors.systemInfo$;
  constructor(private systemInfoSelectors: SystemInfoSelectors) { }

  ngOnInit() {
  }
}
