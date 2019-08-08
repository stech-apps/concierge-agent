
import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import * as _ from 'underscore';
import { Observable } from 'rxjs';
import { UserSelectors } from 'src/store';
import { ToastService } from 'src/util/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'qm-calendar',
  templateUrl: './qm-calendar.component.html',
  styleUrls: ['./qm-calendar.component.scss']
})
export class QmCalendarComponent implements OnInit, OnChanges {

  currentDate = moment();
  TempDate = moment();
  dayNames: string[];
  // dayNames = ['calendar.weekday.sun', 'calendar.weekday.mon', 'calendar.weekday.tue', 'calendar.weekday.wed', 'calendar.weekday.thu', 'calendar.weekday.fri', 'calendar.weekday.sat'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];
  userDirection$: Observable<string>;
  locale: string;
  isUserDateSelected: boolean = false;

  @Input() selectedDates: CalendarDate[] = [];
  @Input() multiSelect: boolean;
  @Input() enableAllFutureDates: boolean = false;
  @Input() enableToday: boolean = false;
  @Input() emitOnInitialSelection: boolean = true;
  @Output() onSelectDate = new EventEmitter<CalendarDate>();
  @Input() enabledDates: moment.Moment[] = [];
  @Input() enableRegenerateOnSelectDatesChange: boolean = true;

  private _currentCalendarDates: CalendarDate[] = [];

  constructor(private userSelectors: UserSelectors,
    private toastService: ToastService,
    private translate: TranslateService) {
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngOnInit(): void {
    // set locale
    this.userSelectors.userLocale$.subscribe(
      locale => {
        if (locale) {
          this.locale = locale;
        }

      }
    );
    this.generateCalendar();
  }
  // Focus the first element of the calander date when focus the calendar container
  focusFirstDate() {
    var focusable = document.getElementById("qm-calendar").querySelectorAll('button:not([disabled])');
    setTimeout(() => {
      if (focusable.length > 0) {
        focusable[0].setAttribute("name", "firstElement");
        setTimeout(() => {
          document.getElementsByName("firstElement")[0].focus();
        }, 500);
      }
    }, 10);
  }
  // Go to timeslot selector when press the tab in the calandar container
  TabPressed() {
    document.getElementById('qm-timeslot-container').focus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.selectedDates && 
      changes.selectedDates.currentValue &&
      changes.selectedDates.currentValue.length > 1) || (changes.enabledDates && changes.enabledDates.currentValue && changes.enabledDates.currentValue.length > 0)) {
      // sort on date changes for better performance when range checking
      if (changes.selectedDates) {
        this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDate) => m.mDate.valueOf());
      }
      this.generateCalendar();
    } else if ((changes.selectedDates && changes.selectedDates.previousValue &&
      changes.selectedDates.currentValue &&
      changes.selectedDates.currentValue.length == 1)) {
        if (changes.selectedDates) {
          this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDate) => m.mDate.valueOf());
          this.currentDate = this.selectedDates[0].mDate;
        }
        this.generateCalendar();
    }
  }

  public refresh() {
    this.generateCalendar();
  }

  // arrow functions //

  // When up arrow pressed
  KeyarrowUp(year: string, month: string, day: string) {
    // If date is available in the same month select the date
    if (document.getElementById(month + '-' + (parseInt(day) - 7) + '-enabled')) {
      document.getElementById(month + '-' + (parseInt(day) - 7) + '-enabled').focus();
    } else {
      var isFocused = false;
      // get the previous week date
      this.TempDate = moment(year + '-' + (parseInt(month) + 1).toString() + '-' + day, "YYYY-MM-DD").subtract(1, 'week');
      // check date is a enabled date
      this.enabledDates.forEach(ed => {
        if (ed.isSame(this.TempDate)) {
          if ((parseInt(month)).toString() != this.TempDate.month().toString()) {
            this.prevMonth();
            setTimeout(() => {
              if (document.getElementById(`${this.TempDate.month()}-${this.TempDate.date()}-enabled`)) {
                document.getElementById(`${this.TempDate.month()}-${this.TempDate.date()}-enabled`).focus();
                isFocused = true;
              }
            }, 100);
          }
        }
      });
      if (this.enabledDates.length == 0) {
        this.prevMonth();
        setTimeout(() => {
          if (document.getElementById(`${this.TempDate.month()}-${this.TempDate.date()}-enabled`)) {
            document.getElementById(`${this.TempDate.month()}-${this.TempDate.date()}-enabled`).focus();
            isFocused = true;
          }
        }, 100);
      }
      // if could not focus show a error message 
      setTimeout(() => {
        if (isFocused == false) {
          const translateSubscription = this.translate
            .get("no_enabled_date")
            .subscribe((res: string) => {
              this.toastService.errorToast(res);
            });
          translateSubscription.unsubscribe();
        }
      }, 200);

    }

  }
  // When down arrow is pressed
  KeyarrowDown(year: string, month: string, day: string) {
    // If date is available in the same month
    if (document.getElementById(month + '-' + (parseInt(day) + 7) + '-enabled')) {
      document.getElementById(month + '-' + (parseInt(day) + 7) + '-enabled').focus();
    } else {
      var isFocused = false;
      // get the next week date
      this.TempDate = moment(year + '-' + (parseInt(month) + 1).toString() + '-' + day, "YYYY-MM-DD").add(1, 'week');
      // check date is a enabled date
      this.enabledDates.forEach(ed => {
        if (ed.isSame(this.TempDate)) {
          if ((parseInt(month)).toString() != this.TempDate.month().toString()) {
            this.nextMonth();
            setTimeout(() => {
              if (document.getElementById(`${this.TempDate.month()}-${this.TempDate.date()}-enabled`)) {
                document.getElementById(`${this.TempDate.month()}-${this.TempDate.date()}-enabled`).focus();
                isFocused = true;
              }
            }, 100);
          }
        }
      });
      if (this.enabledDates.length == 0) {
        this.nextMonth();
            setTimeout(() => {
              if (document.getElementById(`${this.TempDate.month()}-${this.TempDate.date()}-enabled`)) {
                document.getElementById(`${this.TempDate.month()}-${this.TempDate.date()}-enabled`).focus();
                isFocused = true;
              }
            }, 100);
      }
      // if could not focus show a error message 
      setTimeout(() => {
        if (isFocused == false) {
          const translateSubscription = this.translate
            .get("no_enabled_date")
            .subscribe((res: string) => {
              this.toastService.errorToast(res);
            });
          translateSubscription.unsubscribe();
        }
      }, 200);
    }

  }
  // When left arrow pressed
  KeyarrowLeft(month: string, day: string) {
    var prevDayDone = false;
    for (var i = parseInt(day); i >= 1; i--) {
      if (document.getElementById(month + '-' + (i - 1) + '-enabled')) {
        document.getElementById(month + '-' + (i - 1) + '-enabled').focus();
        prevDayDone = true;
        break;
      }
    }
    // if there is no date in current month go to previous month to check the date
    if (prevDayDone == false) {
      this.prevMonth();
      setTimeout(() => {
        for (var i = 31; i >= 1; i--) {
          // if current month is january go to december else substract one from current month
          if (month == '0') {
            if (document.getElementById('11-' + (i - 1) + '-enabled')) {
              document.getElementById('11-' + (i - 1) + '-enabled').focus();
              prevDayDone = true;
              break;
            }
          } else {
            if (document.getElementById((parseInt(month) - 1) + '-' + (i - 1) + '-enabled')) {
              document.getElementById((parseInt(month) - 1) + '-' + (i - 1) + '-enabled').focus();
              prevDayDone = true;
              break;
            }
          }
        }
      }, 100);
      // if could not focus show a error message after going to previous month
      setTimeout(() => {
        if (prevDayDone == false) {
          const translateSubscription = this.translate
            .get("no_enabled_date")
            .subscribe((res: string) => {
              this.toastService.errorToast(res);
            });
          translateSubscription.unsubscribe();
          this.nextMonth();
        }
      }, 200);
    }
  }
  // When right arrow key is pressed go to the next date
  KeyarrowRight(month: string, day: string) {
    var nextDayDone = false;
    for (var i = parseInt(day); i <= 31; i++) {
      if (document.getElementById(month + '-' + (i + 1) + '-enabled')) {
        document.getElementById(month + '-' + (i + 1) + '-enabled').focus();
        nextDayDone = true;
        break;
      }
    }
    // if couldn't find the next date on the current month go to the next month for date search
    if (nextDayDone == false) {
      this.nextMonth();
      // if current month is december go to january else add one to the current month number
      if (month == '11') {
        for (var i = 0; i <= 31; i++) {
          if (document.getElementById('0-' + (i + 1) + '-enabled')) {
            document.getElementById('0-' + (i + 1) + '-enabled').focus();
            nextDayDone = true;
            break;
          }
        }
      } else {
        setTimeout(() => {
          for (var i = 0; i <= 31; i++) {
            if (document.getElementById((parseInt(month) + 1) + '-' + (i + 1) + '-enabled')) {
              document.getElementById((parseInt(month) + 1) + '-' + (i + 1) + '-enabled').focus();
              nextDayDone = true;
              break;
            }
          }
        }, 100);
        // if could not focus show a error message 
        setTimeout(() => {
          if (nextDayDone == false) {
            const translateSubscription = this.translate
              .get("no_enabled_date")
              .subscribe((res: string) => {
                this.toastService.errorToast(res);
              });
            translateSubscription.unsubscribe();
            this.prevMonth();
          }
        }, 200);
      }
    }
  }
  // When press any key 
  onKeydown(event, month: string, date: string, firstDay: string, lastDay: string) {
    // when user tab back (alt + tab) go to previous selector
    if (event.shiftKey && event.keyCode == 9) {
      document.getElementById("qm-next-month").focus();
      event.stopPropagation();
      event.preventDefault();
    }
    // alt + page up to next year
    else if (event.altKey && event.keyCode == 33) {
      this.nextYear();
      setTimeout(() => {
        if (document.getElementById(month + '-' + date + '-enabled')) {
          document.getElementById(month + '-' + date + '-enabled').focus();
        } else {
          const translateSubscription = this.translate
            .get("no_enabled_date")
            .subscribe((res: string) => {
              this.toastService.errorToast(res);
            });
          translateSubscription.unsubscribe();
          this.prevYear();
        }
      }, 100);
    }
    // alt + page down to previous year
    else if (event.altKey && event.keyCode == 34) {
      this.prevYear();
      setTimeout(() => {
        if (document.getElementById(month + '-' + date + '-enabled')) {
          document.getElementById(month + '-' + date + '-enabled').focus();
        } else {
          const translateSubscription = this.translate
            .get("no_enabled_date")
            .subscribe((res: string) => {
              this.toastService.errorToast(res);
            });
          translateSubscription.unsubscribe();
          this.nextYear();
        }
      }, 100);
    }
    // page up to next month
    else if (event.keyCode == 33) {
      this.nextMonth();
      if(month == '11') {
        month = '0';
      } else {
        month = (parseInt(month)+1).toString();
      }
      setTimeout(() => {
        if (document.getElementById(month + '-' + date + '-enabled')) {
          document.getElementById(month + '-' + date + '-enabled').focus();
        } else {
          const translateSubscription = this.translate
            .get("no_enabled_date")
            .subscribe((res: string) => {
              this.toastService.errorToast(res);
            });
          translateSubscription.unsubscribe();
          this.prevMonth();
        }
      }, 100);
    }
    // page down to previous month
    else if (event.keyCode == 34) {
      this.prevMonth();
      if(month == '0') {
        month = '11';
      } else {
        month = (parseInt(month)-1).toString();
      }
      setTimeout(() => {
        if (document.getElementById(month + '-' + date + '-enabled')) {
          document.getElementById(month + '-' + date + '-enabled').focus();
        } else {
          const translateSubscription = this.translate
            .get("no_enabled_date")
            .subscribe((res: string) => {
              this.toastService.errorToast(res);
            });
          translateSubscription.unsubscribe();
          this.nextMonth();
        }
      }, 100);
    }
    // Home button to first day of the week 
    else if (event.keyCode == 36) {
      // if first day of the week in prev month set last date to 1
      if (parseInt(firstDay) > parseInt(date)) {
        firstDay = '1';
      }
      // first Day of the week
      for (var i = parseInt(firstDay); i < parseInt(date); i++) {
        if (document.getElementById(month + '-' + (i) + '-enabled')) {
          document.getElementById(month + '-' + (i) + '-enabled').focus();
          break;
        }
      }
    }
    // End button to last day of the week
    else if (event.keyCode == 35) {
      // if last day of the week in next month set last date to 31
      if (parseInt(lastDay) < parseInt(date)) {
        lastDay = '31';
      }
      // last of the week
      for (var i = parseInt(lastDay); i > parseInt(date); i--) {
        if (document.getElementById(month + '-' + (i) + '-enabled')) {
          document.getElementById(month + '-' + (i) + '-enabled').focus();
          break;
        }
      }
    }
  }


  // date checkers

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }

  isSelectedMonth(date: moment.Moment): boolean {
    return moment(date).isSame(this.currentDate, 'month');
  }

  selectDate(date: CalendarDate, userClicked = false): void {
    this.isUserDateSelected = userClicked;
    if (date.disabled) {
      return;
    }
    this.onSelectDate.emit(date);

    if (!this.multiSelect) {
      this._currentCalendarDates.forEach(d => {
        d.selected = false;
      });

      date.selected = true;
      this.selectedDates[0] = date;
    }
  }

  // actions from calendar

  prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  firstMonth(): void {
    this.currentDate = moment(this.currentDate).startOf('year');
    this.generateCalendar();
  }

  lastMonth(): void {
    this.currentDate = moment(this.currentDate).endOf('year');
    this.generateCalendar();
  }

  prevYear(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'year');
    this.generateCalendar();
  }

  nextYear(): void {
    this.currentDate = moment(this.currentDate).add(1, 'year');
    this.generateCalendar();
  }

  // Accessibility keyboard function support moment functions
  calendarNextWeek(): void {
    this.currentDate = moment(this.currentDate).add(1, 'week');
    this.generateCalendar();

  }
  calendarPrevWeek() {
    this.currentDate = moment(this.currentDate).subtract(1, 'week');
    this.generateCalendar();
  }
  calendarNextDay(): void {
    this.currentDate = moment(this.currentDate).add(1, 'day');
    this.generateCalendar();
  }
  calendarPrevDay(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'day');
    this.generateCalendar();
  }

  // generate the calendar grid

  genarateDynamicDayList() {
    moment.locale(this.locale);
    this.dayNames = moment.weekdaysShort(true);
    moment.locale('en');
  }

  generateCalendar(): void {
    this.genarateDynamicDayList();
    this.currentDate = this.currentDate.locale('en');
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
  }

  isDisabledDay(d: moment.Moment) {
    let isDisabled = true;

    if (this.enableAllFutureDates) {
      if (this.isToday(d) || d.isAfter(moment.now())) {
        isDisabled = false;
      }
      else {
        isDisabled = true;
      }
    }
    else {
      this.enabledDates.forEach(ed => {
        if (ed.isSame(d, 'day')) {
          isDisabled = false;
        }
      });
    }

    return isDisabled;
  }

  fillDates(currentMoment: moment.Moment): CalendarDate[] {
    this._currentCalendarDates = [];
    let firstOfMonth: number;
    if (this.locale) {
      firstOfMonth = moment(currentMoment).locale(this.locale).startOf('month').weekday();
    } else {
      firstOfMonth = moment(currentMoment).startOf('month').weekday();
    }

    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);

        const isSelectedDay = this.isSelected(d);

        let calDay = {
          today: this.isToday(d),
          selected: isSelectedDay,
          disabled: this.isDisabledDay(d),
          mDate: d,
        };

        if (isSelectedDay && this.emitOnInitialSelection) {
          this.selectDate(calDay);
        }

        this._currentCalendarDates.push(calDay);
        return calDay;
      });
  }
  getDateName(mDate) {
    return moment(mDate.mDate._d).format('MMMM Do YYYY');
  }
}