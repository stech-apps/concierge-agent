import { Component, OnInit } from '@angular/core';
import { FLOW_TYPE } from '../../../../util/flow-state';

@Component({
  selector: 'qm-qm-arrive-appointment',
  templateUrl: './qm-arrive-appointment.component.html',
  styleUrls: ['./qm-arrive-appointment.component.scss']
})
export class QmArriveAppointmentComponent implements OnInit {

  flowType = FLOW_TYPE.ARRIVE_APPOINTMENT;

  constructor() { 
    
  }

  ngOnInit() {
  }
  branchHeaderClick(){}
}
