import { Component, OnInit, EventEmitter, Output, ElementRef } from "@angular/core";
import { UserSelectors, SystemInfoSelectors } from "src/store";
import { Observable, Subscription } from "rxjs";
import * as moment from "moment";

@Component({
  selector: "qm-time-filter-items",
  templateUrl: "./qm-time-filter-items.component.html",
  styleUrls: ["./qm-time-filter-items.component.scss"]
})
export class QmTimeFilterItemsComponent implements OnInit {
  constructor(
    private userSelectors: UserSelectors,
    private systemInfoSelectors: SystemInfoSelectors,
    private elRef: ElementRef
  ) {
    this.userDirection$ = this.userSelectors.userDirection$;
    this.generateTimeCollection();
  }

  private subscriptions: Subscription = new Subscription();
  userDirection$: Observable<string> = new Observable<string>();
  timeConvention: string = "24";
  timeCollection: Array<moment.Moment> = [];
  selectedTime: moment.Moment;

  @Output()
  public onTimeSelect = new EventEmitter<moment.Moment>();

  ngOnInit() {
    const systemInfoSub = this.systemInfoSelectors.timeConvention$.subscribe(
      tc => {
        this.timeConvention = tc;
      }
    );

    this.subscriptions.add(systemInfoSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  generateTimeCollection() {
    const currentHourStarted = moment().startOf("hour");
    const currentDayEnd = moment()
      .endOf("day")
      .add(1, "second");
    let timeItem = currentHourStarted;
    while (timeItem <= currentDayEnd) {
      this.timeCollection.push(timeItem.clone());
      timeItem = timeItem.add(1, "hour");
    }
  }

  timeSelected(selectedTime: moment.Moment) {
    this.selectedTime = selectedTime;
    this.onTimeSelect.emit(selectedTime);
  }

  scrollToClosest(timeLabel: string) {
    let nextClosestTime = this.getClosestTime(timeLabel);
    const index = this.getPositionOfTimeInList(nextClosestTime);
    const timeSlotControls = this.elRef.nativeElement.querySelectorAll(
      '.qm-time-filter__item'
    );

    if (index !== -1) {
      const itemToScrollTo = timeSlotControls[index];

      if (itemToScrollTo !== undefined) {
        itemToScrollTo.scrollIntoView(true);
      }
    }
  }

  getPositionOfTimeInList(targetTime): number {
    return this.timeCollection.indexOf(targetTime);
  }

  getClosestTime(timeLabel) {
    if (this.timeConvention == "24") {
      return this.getClosest24HourTime(timeLabel);
    } else {
      return this.getClosest12HourTime(timeLabel);
    }
  }

  getClosest24HourTime(timeLabel: string) {
    const timeToScrollTo = this.timeCollection.reduce(
      (nextClosestTime: moment.Moment, currTime: moment.Moment) => {
        const clickedTime: number = parseInt(timeLabel, 10);
        const currentIterTime = currTime.hours();

        if (!nextClosestTime && currentIterTime >= clickedTime) {
          return currTime;
        } else {
          return nextClosestTime;
        }
      },
      null
    );

    return timeToScrollTo;
  }

  getClosest12HourTime(clickedAMPM: string) {
    const timeToScrollTo = this.timeCollection.reduce(
      (nextClosestTime: moment.Moment, currTime: moment.Moment) => {
        if (clickedAMPM === "AM") {
          if (!nextClosestTime) {
            return currTime;
          } else {
            return nextClosestTime;
          }
        }

        if (clickedAMPM === "PM") {
          const currentIterTime = currTime.hours();

          if (!nextClosestTime && currentIterTime >= 12) {
            return currTime;
          } else {
            return nextClosestTime;
          }
        }
      },
      null
    );

    return timeToScrollTo;
  }
}
