import { Component, OnInit } from '@angular/core';
import { QEvents } from 'src/services/qevents/qevents.service'

@Component({
  selector: 'qm-profile',
  templateUrl: './qm-profile.component.html',
  styleUrls: ['./qm-profile.component.scss']
})
export class QmProfileComponent implements OnInit {

  constructor(public qevents: QEvents) { }

  ngOnInit() {
  }

  subscribeCometD(){
    this.qevents.initializeCometD(this.qevents);
  }
}
