import { OnDestroy, EventEmitter, Input, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ITimeSlot } from './../../../../models/ITimeSlot';
import { ITimeSlotCategory } from './../../../../models/ITimeInterval';
import { Component, OnInit, Output } from '@angular/core';
import { TimeslotSelectors } from 'src/store';

@Component({
  selector: 'qm-time-slots',
  templateUrl: './qm-time-slots.component.html',
  styleUrls: ['./qm-time-slots.component.scss']
})
export class QmTimeSlotsComponent implements OnInit, OnDestroy {
  isTimeSlotLoading: boolean;

  timeSlotCategories: Array<ITimeSlotCategory> = [];
  timeSlots: Array<ITimeSlot> = [];
  selectedCategory: number = 1;
  private readonly HOUR_24FORMAT = '24';
  private readonly HOUR_12FORMAT = 'AMPM';
  timeFormat: string = this.HOUR_12FORMAT; //todo read from orchestra setting
  
  private readonly TIME_GAP = 4;
  private subscriptions: Subscription = new Subscription();

  constructor(private timeSlotSelectors: TimeslotSelectors, private elRef: ElementRef) {
    this.generateTimeSlotCategories();
    this.timeSlotCategories[0].isActive = true;
  }

  @Input()
  preselectedTimeSlot: string;

  @Output()
  onTimeSlotSelect: EventEmitter<ITimeSlot> = new EventEmitter<ITimeSlot>();

  ngOnInit() {
    const timeSlotSubscription = this.timeSlotSelectors.times$.subscribe((times) => {
      this.timeSlots = [];
      if (times && times.length > 0) {
        
        times.forEach((t) => {
          this.timeSlots.push({
            title: t,
            isActive: false,
            category: this.addCategory(t)
          });
        });

        if(this.preselectedTimeSlot) {
          const preselectedTimeSlotCategory = this.addCategory(this.preselectedTimeSlot);
          this.timeSlots.push(
            {
              title: this.preselectedTimeSlot,
              isActive: true,
              category: preselectedTimeSlotCategory
            }
          );

          this.timeSlots.sort((a, b) => a.title.localeCompare(b.title));
          this.selectedCategory = preselectedTimeSlotCategory;
        }
        else {
          this.selectedCategory = this.timeSlots[0].category;
        }

        this.timeSlotCategories.forEach((tc) => tc.isActive = this.selectedCategory == tc.category);

      }
    });

    const timeSlotLoadingSubscription = this.timeSlotSelectors.timeslotsLoading$.subscribe((loading)=> {
      this.isTimeSlotLoading = loading;
    });

    this.subscriptions.add(timeSlotSubscription);
    this.subscriptions.add(timeSlotLoadingSubscription);
  }
  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  generateTimeSlotCategories() {

    if(this.timeFormat == this.HOUR_24FORMAT) {
      let slotCategoryCount = 4;
      this.timeSlotCategories.push({
        title: '8', //first category start from 0-8
        startTime: 0,
        endTime: 8,
        isActive: false,
        category: 1
      });
  
      let startTime = 8;
      for (let i = 0; i < slotCategoryCount; i++) {
        this.timeSlotCategories.push({
          title: (startTime + this.TIME_GAP).toString(),
          startTime: startTime,
          endTime: startTime + this.TIME_GAP,
          isActive: false,
          category: i + 2
        });
  
        startTime = startTime + this.TIME_GAP;
      }
    }
    else {
      this.timeSlotCategories.push( {
        title: 'AM',
        startTime: 0,
        endTime: 0,
        isActive: false,
        category: 1
      });

      this.timeSlotCategories.push( {
        title: 'PM',
        startTime: 0,
        endTime: 0,
        isActive: false,
        category: 2
      });
    }
  }

  timeSlotSelect(timeSlot: ITimeSlot) {

    this.timeSlots.forEach(ti => {
      ti.isActive = false;
    });

    timeSlot.isActive = true;
    this.onTimeSlotSelect.emit(timeSlot);
  }

  getNextClosestTime(time: string): string {

    if (this.timeFormat === 'AMPM') {
      return this.getNextClosestTimeAMPM(time);
    } else {
      return this.getNextClosestTime24Hours(time);
    }
  }

  getNextClosestTime24Hours(time: string): string {
    const timeToScrollTo = this.timeSlots.reduce(
      (nextClosestTime: ITimeSlot, currTime: ITimeSlot) => {
        const clickedTime: number = parseInt(time, 10);
        const currentHour: string = currTime.title.split(':')[0];
        const currentIterTime = parseInt(currentHour, 10);

        if (nextClosestTime.title === '' && currentIterTime >= clickedTime) {
          return currTime;
        } else {
          return nextClosestTime;
        }
      }, {title: ''}
    );

    return timeToScrollTo.title;
  }

  getNextClosestTimeAMPM(ampm: string) {
    const timeToScrollTo = this.timeSlots.reduce(
      (nextClosestTime: ITimeSlot, currTime: ITimeSlot) => {
        const clickedAMPM: string = ampm;

        if (clickedAMPM === 'AM') {
          if (nextClosestTime.title === '') {
            return currTime;
          } else {
            return nextClosestTime;
          }
        }

        if (clickedAMPM === 'PM') {
          const currentHour: string = currTime.title.split(':')[0];
          const currentIterTime = parseInt(currentHour, 10);

          if (nextClosestTime.title === '' && currentIterTime >= 12) {
            return currTime;
          } else {
            return nextClosestTime;
          }
        }
      }, {title: ''}
    );

    return timeToScrollTo.title;
  }

  timeSlotCategorySelect(timeSlotCategory: ITimeSlotCategory) {
    const timeString =  this.timeFormat === this.HOUR_24FORMAT ? timeSlotCategory.endTime.toString() : timeSlotCategory.title
    const nextClosestTime = this.getNextClosestTime(timeString);
    const index = this.getPositionOfTimeInList(nextClosestTime);
    const timeSlotControls = this.elRef.nativeElement.querySelectorAll(
      '.qm-time-select-slot'
    );

    if (index !== -1) {
      const itemToScrollTo = timeSlotControls[index];

      if (itemToScrollTo !== undefined) {
        itemToScrollTo.scrollIntoView(true);
      }
    } else {
      const emptyCategory = this.elRef.nativeElement.querySelector(
        '.qm-time-split__empty' + (timeSlotCategory.category + 1)
      );

      if (emptyCategory !== undefined) {
        emptyCategory.scrollIntoView(true);
      }
    }
  }

  getPositionOfTimeInList(timeToFind) {
    return this.timeSlots.map(x =>x.title).indexOf(timeToFind);
  }

  pad(n, width, z = '0') {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }


  addCategory(timeString) {
    let category = 1;

    if(this.timeFormat === this.HOUR_24FORMAT) {
      if (this.getMinutesFromTime(timeString) < this.getMinutesFromTime("08:00")) {
        category = 1;
      } else if (this.getMinutesFromTime(timeString) < this.getMinutesFromTime("12:00")) {
        category = 2;
      } else if (this.getMinutesFromTime(timeString) < this.getMinutesFromTime("16:00")) {
        category = 3;
      } else if (this.getMinutesFromTime(timeString) < this.getMinutesFromTime("20:00")) {
        category = 4;
      }
      else if (this.getMinutesFromTime(timeString) < this.getMinutesFromTime("24:00")) {
        category = 5;
      }
    }
    else {
      if(this.getMeridian(timeString) === 'PM') {
        category = 2;
      }
    }

    return category;
  }

  getMinutesFromTime(timeString) {
    try {
      var hours = parseInt(timeString.split(":")[0]);
      var minutes = parseInt(timeString.split(":")[1]);
    } catch (ex) {
      console.log("timeString issue", { class: "CalendarDatePickerModel", func: "getMinutesFromTime", exception: ex });
    }
    return (hours * 60) + minutes;
  }

  getMeridian(time) {
    if(time) {
      const splitTime = time.split(':');
      if(parseInt(splitTime[0], 10) >= 12) {
        return 'PM';
      }
      else {
        return 'AM';
      }      
    }
    return '';
  }
}
