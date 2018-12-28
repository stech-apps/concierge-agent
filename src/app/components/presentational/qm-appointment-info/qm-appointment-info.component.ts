import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'qm-appointment-info',
  templateUrl: './qm-appointment-info.component.html',
  styleUrls: ['./qm-appointment-info.component.scss']
})
export class QmAppointmentInfoComponent implements OnInit {

  @Input()
  appointmentInfo: any = {};

  @Output() onClose = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    console.log(this.appointmentInfo);    
  }

  onModalClick() {
    this.onClose.emit(true);
  }
}
