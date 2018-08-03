import { ITimeSlot } from './../../../../models/ITimeSlot';
import { ITimeInterval } from './../../../../models/ITimeInterval';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qm-time-slots',
  templateUrl: './qm-time-slots.component.html',
  styleUrls: ['./qm-time-slots.component.scss']
})
export class QmTimeSlotsComponent implements OnInit {

  timeIntervals :Array<ITimeInterval> = [];
  timeSlots: Array<ITimeSlot> = [];
  private readonly TIME_GAP = 6;

  constructor() {
    this.generateTimeIntervals();
    this.timeIntervals[0].isActive = true;
    this.generateTimeSlots();
  }

  ngOnInit() {
  }

  generateTimeIntervals() {
    let slotCount = Math.ceil(24/this.TIME_GAP);
    let startTime = 0;

    for(let i = 0; i < slotCount; i++) {
      this.timeIntervals.push( {
        title: this.pad(startTime, 2) + '-' + this.pad(startTime + this.TIME_GAP, 2),
        startTime: startTime,
        endTime: startTime + this.TIME_GAP,
        isActive: false
      });

      startTime = startTime + this.TIME_GAP;
    }
  }

  timeIntervalSelect(timeInterval: ITimeInterval) {

    this.timeIntervals.forEach(ti=> {
      ti.isActive = false;
    });

    timeInterval.isActive = true;    
  }

  generateTimeSlots() {
    for(let i = 0;i < 50; i++) {
      this.timeSlots.push( {
        title : `${i} : ${i + 5}`,
        isActive: false
      }); 
    }
  }

  timeSlotSelect(timeSlot: ITimeSlot) {

    this.timeSlots.forEach((ts)=> {
      ts.isActive = false;
    });
    timeSlot.isActive = true;
  }

  pad(n, width, z = '0') {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
}
