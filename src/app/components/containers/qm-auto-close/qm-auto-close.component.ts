import { AutoClose } from './../../../../util/services/autoclose.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'qm-auto-close',
  templateUrl: './qm-auto-close.component.html',
  styleUrls: ['./qm-auto-close.component.scss']
})
export class QmAutoCloseComponent implements OnInit {
  constructor(private autoCloseService: AutoClose) {}

  ngOnInit() {}

  refreshAutoClose() {
    this.autoCloseService.refreshAutoClose();
  }
}
