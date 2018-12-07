
import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import * as _ from 'underscore';
import { Observable } from 'rxjs';
import { UserSelectors } from 'src/store';

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
  dayNames: string[];
  // dayNames = ['calendar.weekday.sun', 'calendar.weekday.mon', 'calendar.weekday.tue', 'calendar.weekday.wed', 'calendar.weekday.thu', 'calendar.weekday.fri', 'calendar.weekday.sat'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];
  userDirection$: Observable<string>;
  locale: string;

  @Input() selectedDates: CalendarDate[] = [];
  @Input() multiSelect: boolean;
  @Input() enableAllFutureDates: boolean = false;
  @Input() enableToday: boolean = false;
  @Input() emitOnInitialSelection: boolean = true;
  @Output() onSelectDate = new EventEmitter<CalendarDate>();
  @Input() enabledDates: moment.Moment[] = [];
  @Input() enableRegenerateOnSelectDatesChange: boolean = true;

  private _currentCalendarDates: CalendarDate[] = [];

  constructor(private userSelectors: UserSelectors) {
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngOnInit(): void {
    this.userSelectors.userLocale$.subscribe(
      locale => {
        if (locale) {
          this.locale = locale;
        }

      }
    );
    this.generateCalendar();
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
    }
  }

  public refresh() {
    this.generateCalendar();
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

  selectDate(date: CalendarDate): void {
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

  // generate the calendar grid

  genarateDynamicDayList() {
    moment.locale(this.locale);
    this.dayNames = moment.weekdaysShort(true);
    moment.locale('en');
  }

  generateCalendar(): void {
    console.log('generate calendar called');
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
}