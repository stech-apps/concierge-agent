import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ElementRef,
  OnDestroy,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import { UserSelectors, SystemInfoSelectors } from "src/store";
import { Observable, Subscription } from "rxjs";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { CalendarDate } from "../qm-calendar/qm-calendar.component";
import { DEFAULT_LOCALE } from "src/constants/config";
import { ISystemInfo } from "src/models/ISystemInfo";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "qm-qm-time-filter",
  templateUrl: "./qm-time-filter.component.html",
  styleUrls: ["./qm-time-filter.component.scss"]
})
export class QmTimeFilterComponent implements OnInit, AfterViewInit, OnDestroy,OnChanges {
  constructor(
    private userSelectors: UserSelectors,
    public activeModal: NgbActiveModal,
    public elRef: ElementRef,
    private systemInfoSelectors: SystemInfoSelectors,
    private translate: TranslateService
  ) {
    this.isCalendarOpen = false;
  }

  private subscriptions: Subscription = new Subscription();
  public header: string;
  public subheader: string;
  userDirection$: Observable<string> = new Observable<string>();
  userLocale: string = DEFAULT_LOCALE
  validationFailed: boolean;
  @Input()
  public selectedStartTime: moment.Moment;

  @Input()
  public selectedEndTime: moment.Moment;
  showDateFilter: boolean;
  public selectedDate: CalendarDate;
  isCalendarOpen: boolean;
  isCalendarEverShown: boolean;
  dateType: string;
  systemInformation: ISystemInfo;
  enterDateErrorMsg: string;
  currentDate:string;
  userDirection:string;
  
  @ViewChild("endContainer", { static: true }) endTimeFilters: TemplateRef<any>;

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
    const userLocaleSubscription = this.userSelectors.userLocale$.subscribe((ul)=> {
      this.userLocale = ul;
    });
    
    this.subscriptions.add(userLocaleSubscription);
    setTimeout(() => {
      if(document.getElementById('qm-time-filter-header')) {
        document.getElementById('qm-time-filter-header').focus();
      }
    }, 100);
    const userSubscription = this.userDirection$.subscribe((ud)=> {
      this.userDirection = ud.toLowerCase();
    });
    this.subscriptions.add(userSubscription);

    const systemInfoSubscription = this.systemInfoSelectors.systemInfo$.subscribe(systemInfo => {
      this.systemInformation = systemInfo;
    });
    this.subscriptions.add(systemInfoSubscription);

    this.dateType = this.systemInformation.dateConvention;
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
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedDate) {
      console.log(changes.selectedDate);
      
    }
  }

  onApplyClick() {
    this.activeModal.close({
      start: moment(this.selectedDate.mDate.format('YYYY-MM-DD') + ' ' + this.selectedStartTime.format('HH:mm')),
      end:  moment(this.selectedDate.mDate.format('YYYY-MM-DD') + ' ' + this.selectedEndTime.format('HH:mm')),
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

  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }


  validateDate(value) {
    console.log(value);
    
    if (this.dateType[2] == '-') {
      if (value.match(/[0-9]{2}-[0-9]{2}-[0-9]{2}/g) && moment(value, this.dateType).isValid()) {
        this.enterDateErrorMsg = "";
        var selectedDateAvailable = false;
        if (this.isToday(moment(value, this.dateType)) || moment(value, this.dateType).isAfter(moment.now())) {
          selectedDateAvailable = true;
          this.selectedDate = 
                     ({
                        mDate: moment(value, this.dateType),
                        selected: true
                      })
                      this.isCalendarOpen = false;
        }

  
        setTimeout(() => {
          if (selectedDateAvailable == false) {
            const translateSubscription = this.translate
              .get("select_date_not_available")
              .subscribe((res: string) => {
                this.enterDateErrorMsg = res
              });
            translateSubscription.unsubscribe();
          }
        }, 100);

      } else {
        
        const translateSubscription = this.translate
          .get("invalid_date_format")
          .subscribe((res: string) => {
            this.enterDateErrorMsg = res
          });
        translateSubscription.unsubscribe();
      }
    } else if (this.dateType[2] == '/') {
      if (value.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{2}/g) && moment(value, this.dateType).isValid()) {
        this.enterDateErrorMsg = "";
        var selectedDateAvailable = false;
        if (this.isToday(moment(value, this.dateType)) || moment(value, this.dateType).isAfter(moment.now())) {
          selectedDateAvailable = true;
          this.selectedDate = 
                     ({
                        mDate: moment(value, this.dateType),
                        selected: true
                      })
                      this.isCalendarOpen = false;
        }
        setTimeout(() => {
          if (selectedDateAvailable == false) {
            const translateSubscription = this.translate
              .get("select_date_not_available")
              .subscribe((res: string) => {
                this.enterDateErrorMsg = res
              });
            translateSubscription.unsubscribe();
          }
        }, 100);

      } else {
        const translateSubscription = this.translate
          .get("invalid_date_format")
          .subscribe((res: string) => {
            this.enterDateErrorMsg = res
          });
        translateSubscription.unsubscribe();
      }
    }
  }

  onTimeEndSelect(endTime: moment.Moment) {
    this.selectedEndTime = endTime;
    this.checkValidation();
  }

  showCalendar() {
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  onSelectDate(selectedDate: CalendarDate) {
    this.selectedDate = selectedDate;
    this.isCalendarOpen = false;
    this.enterDateErrorMsg = "";
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  onFocus() {
    if(this.userDirection == 'rtl') {
      var setInput = document.getElementById("enterDate");
      this.setSelectionRange(setInput,(<HTMLInputElement>document.getElementById("enterDate")).value.length,(<HTMLInputElement>document.getElementById("enterDate")).value.length)
    }
  }

  setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  }
}
