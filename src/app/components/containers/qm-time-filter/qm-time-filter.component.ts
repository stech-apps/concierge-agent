import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ElementRef
} from "@angular/core";
import { UserSelectors } from "src/store";
import { Observable } from "rxjs";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { CalendarDate } from "../qm-calendar/qm-calendar.component";

@Component({
  selector: "qm-qm-time-filter",
  templateUrl: "./qm-time-filter.component.html",
  styleUrls: ["./qm-time-filter.component.scss"]
})
export class QmTimeFilterComponent implements OnInit, AfterViewInit {
  constructor(
    private userSelectors: UserSelectors,
    public activeModal: NgbActiveModal,
    public elRef: ElementRef
  ) {
    this.isCalendarOpen = false;
  }

  public header: string;
  public subheader: string;
  userDirection$: Observable<string> = new Observable<string>();
  validationFailed: boolean;
  @Input()
  public selectedStartTime: moment.Moment;

  @Input()
  public selectedEndTime: moment.Moment;
  showDateFilter: boolean;
  selectedDate: CalendarDate;
  isCalendarOpen: boolean;
  isCalendarEverShown: boolean;
  @ViewChild("endContainer") endTimeFilters: TemplateRef<any>;

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
    this.selectedDate = {
      mDate: moment()
    };
  }

  ngAfterViewInit() {
    let selectedElements = this.elRef.nativeElement.querySelectorAll(
      ".qm-time-filter__item--selected"
    );

    // selected timeslot elements
    if (selectedElements && selectedElements.length > 0) {
      selectedElements.forEach(element => {
        element.scrollIntoView();
      });

      let timeSlotParents = this.elRef.nativeElement.querySelectorAll(
        "qm-time-filter-items"
      );

      // time slot filter parents
      timeSlotParents.forEach(p => {
        p.scrollTop -= 135;
      });
    }
  }

  onApplyClick() {
    this.activeModal.close({
      start: this.selectedStartTime,
      end: this.selectedEndTime,
      date: this.selectedDate
    });
  }

  onTimeStartSelect(startTime: moment.Moment) {
    this.selectedStartTime = startTime;
    this.checkValidation();
  }

  private checkValidation() {
    if (!this.selectedStartTime || !this.selectedEndTime) {
      return;
    }

    if (
      this.selectedStartTime.isAfter(this.selectedEndTime) ||
      this.selectedStartTime.isSame(this.selectedEndTime)
    ) {
      this.validationFailed = true;
    } else {
      this.validationFailed = false;
    }
  }

  onTimeEndSelect(endTime: moment.Moment) {
    this.selectedEndTime = endTime;
    this.checkValidation();
  }

  showCalendar() {
    this.isCalendarOpen = true;
    console.log(this.isCalendarOpen + "#### show calendar");
  }

  onSelectDate(selectedDate: CalendarDate) {
    this.selectedDate = selectedDate;
    this.isCalendarOpen = false;
    console.log(this.isCalendarOpen + "1#### from on select date");
  }
}
