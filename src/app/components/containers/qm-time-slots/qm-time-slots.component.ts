import { OnDestroy, EventEmitter, Input } from '@angular/core';
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
  
  private readonly TIME_GAP = 6;
  private subscriptions: Subscription = new Subscription();

  constructor(private timeSlotSelectors: TimeslotSelectors) {
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
    let slotCount = Math.ceil(24 / this.TIME_GAP);
    let startTime = 0;

    for (let i = 0; i < slotCount; i++) {
      this.timeSlotCategories.push({
        title: this.pad(startTime, 2) + '-' + this.pad(startTime + this.TIME_GAP, 2),
        startTime: startTime,
        endTime: startTime + this.TIME_GAP,
        isActive: false,
        category: i + 1
      });

      startTime = startTime + this.TIME_GAP;
    }
  }

  timeSlotSelect(timeSlot: ITimeSlot) {

    this.timeSlots.forEach(ti => {
      ti.isActive = false;
    });

    timeSlot.isActive = true;
    this.onTimeSlotSelect.emit(timeSlot);
  }

  timeSlotCategorySelect(timeSlotCategory: ITimeSlotCategory) {
    this.timeSlotCategories.forEach((ts) => {
      ts.isActive = false;
    });
    timeSlotCategory.isActive = true;

    this.selectedCategory = timeSlotCategory.category;
  }

  pad(n, width, z = '0') {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }


  addCategory(timeString) {
    let category = 1;
    if (this.getMinutesFromTime(timeString) < this.getMinutesFromTime("06:00")) {
      category = 1;
    } else if (this.getMinutesFromTime(timeString) < this.getMinutesFromTime("12:00")) {
      category = 2;
    } else if (this.getMinutesFromTime(timeString) < this.getMinutesFromTime("18:00")) {
      category = 3;
    } else if (this.getMinutesFromTime(timeString) < this.getMinutesFromTime("24:00")) {
      category = 4;
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
}
