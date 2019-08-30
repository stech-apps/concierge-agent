import { ReserveSelectors } from "./../../../../store/services/reserve/reserve.selectors";
import { IService } from "./../../../../models/IService";
import { ICalendarBranch } from "./../../../../models/ICalendarBranch";
import { IBookingInformation } from "./../../../../models/IBookingInformation";
import { TimeslotSelectors } from "./../../../../store/services/timeslot/timeslot.selectors";
import { CalendarDate, QmCalendarComponent } from "./../../containers/qm-calendar/qm-calendar.component";
import { IBranch } from "src/models/IBranch";
import { Subscription, Observable } from "rxjs";
import {
  BranchSelectors,
  TimeslotDispatchers,
  CalendarBranchSelectors,
  ServiceSelectors,
  CalendarServiceSelectors,
  ReserveDispatchers,
  ReservationExpiryTimerDispatchers,
  CalendarSettingsSelectors,
  ReservationExpiryTimerSelectors,
  CalendarSettingsDispatchers,
  UserSelectors,
  SystemInfoSelectors
} from "src/store";
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from "@angular/core";
import { BookingHelperService } from "src/util/services/booking-helper.service";
import { ICalendarService } from "src/models/ICalendarService";
import * as moment from "moment";
import { concat } from "rxjs/internal/operators/concat";
import { ITimeSlot } from "src/models/ITimeSlot";
import { IAppointment } from "src/models/IAppointment";
import { Moment } from "moment";
import { DEFAULT_LOCALE } from "src/constants/config";
import { ISystemInfo } from "src/models/ISystemInfo";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "qm-appointment-time-select",
  templateUrl: "./qm-appointment-time-select.component.html",
  styleUrls: ["./qm-appointment-time-select.component.scss"]
})
export class QmAppointmentTimeSelectComponent implements OnInit, OnDestroy {
  noOfCustomers: number = 1;
  private subscriptions: Subscription = new Subscription();
  selectedBranch: ICalendarBranch = new ICalendarBranch();
  private branchSubscription$: Observable<ICalendarBranch>;
  private serviceSubscription$: Observable<ICalendarService[]>;
  private reservedAppointment$: Observable<IAppointment>;
  private currentlyActiveDate: CalendarDate;
  private getExpiryReservationTime$: Observable<Number>;
  private settingReservationExpiryTime: number;
  public showExpiryReservationTime$: Observable<Boolean>;
  public preselectedTimeSlot: string = null;
  selectedTimeHeading: string = "";
  public reservableDates: moment.Moment[] = [];
  public userDirection$: Observable<string>;
  userDirection: string;
  selectedTime$: Observable<Moment>;
  showTimer: Boolean;
  systemInformation: ISystemInfo;
  selectedServices: ICalendarService[] = [];
  selectedDates: CalendarDate[];
  dateType: string;
  selectedTime: string = '';
  enterDateErrorMsg: string = '';
  @Output()
  onFlowNext: EventEmitter<any> = new EventEmitter();

  reloadTimeSlots: EventEmitter<any> = new EventEmitter();
  private readonly HOUR_24FORMAT = "24";
  private readonly HOUR_12FORMAT = "AMPM";
  timeFormat: string = this.HOUR_12FORMAT; //todo read from orchestra setting
  userLocale: string = DEFAULT_LOCALE;
  currentDate: string = '';

  @ViewChild('timeSlotContainer') timeSlotContainer: ElementRef;
  @ViewChild(QmCalendarComponent) calendarRef: QmCalendarComponent;

  constructor(
    private branchSelectors: BranchSelectors,
    private timeSlotSelectors: TimeslotSelectors,
    private timeSlotDispatchers: TimeslotDispatchers,
    private bookingHelperService: BookingHelperService,
    private calendarBranchSelectors: CalendarBranchSelectors,
    private calendarServiceSelectors: CalendarServiceSelectors,
    private reserveDispatchers: ReserveDispatchers,
    private calendarSettingsSelectors: CalendarSettingsSelectors,
    private reserveSelectors: ReserveSelectors,
    private reservationExpiryTimerDispatchers: ReservationExpiryTimerDispatchers,
    private calendarSettingsDispatchers: CalendarSettingsDispatchers,
    private userSelectors: UserSelectors,
    private systemInfoSelectors: SystemInfoSelectors,
    private resevationTimeSelectors: ReservationExpiryTimerSelectors,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.branchSubscription$ = this.calendarBranchSelectors.selectedBranch$;
    this.serviceSubscription$ = this.calendarServiceSelectors.selectedServices$;
    this.reservedAppointment$ = this.reserveSelectors.reservedAppointment$;
    this.getExpiryReservationTime$ = this.calendarSettingsSelectors.getReservationExpiryTime$;
    this.userDirection$ = this.userSelectors.userDirection$;

    const branchSubscription = this.branchSubscription$.subscribe(cb => {
      this.selectedBranch = cb;
    });

    const serviceSubscription = this.serviceSubscription$.subscribe(s => {
      this.selectedServices = s;
    });

    const systemInfoSubscription = this.systemInfoSelectors.systemInfo$.subscribe(systemInfo => {
      this.systemInformation = systemInfo;
    });
    this.subscriptions.add(systemInfoSubscription)
    this.dateType = this.systemInformation.dateConvention;

    const reservableDatesSub = this.reserveSelectors.reservableDates$.subscribe(
      (dates: moment.Moment[]) => {
        this.reservableDates = dates;
        this.selectedDates = [
          {
            mDate: this.reservableDates[0],
            selected: true
          }
        ];
      }
    );

    const serviceSelectionSubscription = this.calendarServiceSelectors.isCalendarServiceSelected$.subscribe(
      val => {
        if (
          val &&
          this.selectedServices.length > 0 &&
          this.selectedBranch &&
          this.selectedBranch.id
        ) {
          this.fetchReservableDates();
        }
      }
    );

    const reloadTimeSlotSub = this.reloadTimeSlots.subscribe(() => {
      this.preselectedTimeSlot = this.selectedTime;
      this.getTimeSlots();
    });

    const userLocaleSubscription = this.userSelectors.userLocale$.subscribe((ul) => this.userLocale = ul)

    this.subscriptions.add(branchSubscription);
    this.subscriptions.add(serviceSubscription);
    this.subscriptions.add(reservableDatesSub);
    this.subscriptions.add(serviceSelectionSubscription);
    this.subscriptions.add(reloadTimeSlotSub);
    this.subscriptions.add(userLocaleSubscription);
  }

  ngOnInit() {
    const timeConventionSubscriptioon = this.systemInfoSelectors.timeConvention$.subscribe(
      tf => {
        this.timeFormat = tf;
      }
    );
    const userSubscription = this.userDirection$.subscribe((ud)=> {
      this.userDirection = ud.toLowerCase();
    });
    this.subscriptions.add(userSubscription);

    const expiryReservationCalendarSettingSubscription = this.getExpiryReservationTime$.subscribe(
      (time: number) => {
        this.settingReservationExpiryTime = time;
      }
    );
    const showTimerSubscription = this.resevationTimeSelectors.showReservationExpiryTime$.subscribe(
      hide => {
        this.showTimer = hide;
      }
    );

    const appointmentSubscription = this.reservedAppointment$.subscribe(
      (app: IAppointment) => {
        if (app) {
          this.reservationExpiryTimerDispatchers.hideReservationExpiryTimer();
          this.calendarSettingsDispatchers.fetchCalendarSettingsInfo();
          this.reservationExpiryTimerDispatchers.showReservationExpiryTimer();
          this.reservationExpiryTimerDispatchers.setReservationExpiryTimer(
            this.settingReservationExpiryTime
          );
        } else {
          this.reservationExpiryTimerDispatchers.hideReservationExpiryTimer();
        }
      }
    );

    const timeSlotSubscription = this.timeSlotSelectors.selectedTime$.subscribe(
      (st: string) => {
        this.selectedTime = st;
      }
    );

    this.subscriptions.add(appointmentSubscription);

    this.subscriptions.add(timeSlotSubscription);
    this.timeSlotDispatchers.selectTimeslotDate(this.selectedDates[0].mDate);
    const timeSlotsSubscription = this.timeSlotSelectors.times$.subscribe(
      ts => {
        if (ts.length) {

        }
      }
    );
    this.subscriptions.add(timeSlotsSubscription);
    this.subscriptions.add(timeConventionSubscriptioon);
    const reservedSub = this.reserveSelectors.reservedAppointment$.subscribe(
      alreadyReserved => {
        if (alreadyReserved) {
          let timeFormat: string = "HH:mm";

          this.selectedTimeHeading = this.currentlyActiveDate.mDate.clone().locale(this.userLocale).format(
            "dddd DD MMMM, "
          );
          if (this.timeFormat != this.HOUR_24FORMAT) {
            timeFormat = "hh:mm A";
          }

          this.selectedTimeHeading += `${moment(alreadyReserved.start)
            .tz(alreadyReserved.branch.fullTimeZone)
            .format(timeFormat)} - `;

          this.selectedTimeHeading += `${moment(alreadyReserved.end)
            .tz(alreadyReserved.branch.fullTimeZone)
            .format(timeFormat)}`;

          this.onFlowNext.emit();
        }
      }
    );

    this.subscriptions.add(reservedSub);
    this.subscriptions.add(expiryReservationCalendarSettingSubscription);
    this.subscriptions.add(showTimerSubscription);
  }

  fetchReservableDates() {
    const bookingInformation: IBookingInformation = {
      branchPublicId: this.selectedBranch.publicId,
      serviceQuery: this.getServicesQueryString(),
      numberOfCustomers: this.noOfCustomers
    };

    this.reserveDispatchers.fetchReservableDates(bookingInformation);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSelectDate(date: CalendarDate) {
    if (this.selectedServices && this.selectedServices.length > 0) {
      this.preselectedTimeSlot = null;
      this.currentlyActiveDate = date;
      this.timeSlotDispatchers.selectTimeslotDate(date.mDate);
      this.getTimeSlots();
      this.reservationExpiryTimerDispatchers.hideReservationExpiryTimer();
      this.timeSlotDispatchers.selectTimeslot(null);
      this.selectedTimeHeading = date.mDate.clone().locale(this.userLocale).format("dddd DD MMMM");
      this.currentDate = this.currentlyActiveDate.mDate.clone().locale('en').format(this.dateType).toString();
      this.enterDateErrorMsg = "";
      this.cdr.detectChanges();
      if (this.calendarRef && this.calendarRef.isUserDateSelected && this.timeSlotContainer && this.timeSlotContainer.nativeElement) {
        this.timeSlotContainer.nativeElement.scrollIntoView();
      }
    }
  }

  validateDate() {
    if (this.dateType[2] == '-') {
      if (this.currentDate.match(/[0-9]{2}-[0-9]{2}-[0-9]{2}/g) && moment(this.currentDate, this.dateType).isValid()) {
        this.enterDateErrorMsg = "";
        var selectedDateAvailable = false;
        this.reservableDates.forEach(ed => {
          if (ed.isSame(moment(this.currentDate, this.dateType))) {
            selectedDateAvailable = true;
            this.selectedDates = [
              {
                mDate: moment(this.currentDate, this.dateType),
                selected: true
              }
            ];
            if(document.getElementById('qm-time-slot-categories')) {
              document.getElementById('qm-time-slot-categories').focus();
            }
          }
        });
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
      if (this.currentDate.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{2}/g) && moment(this.currentDate, this.dateType).isValid()) {
        this.enterDateErrorMsg = "";
        var selectedDateAvailable = false;
        this.reservableDates.forEach(ed => {
          if (ed.isSame(moment(this.currentDate, this.dateType))) {
            selectedDateAvailable = true;
            this.selectedDates = [
              {
                mDate: moment(this.currentDate, this.dateType),
                selected: true
              }
            ];
          }
        });
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

  doneButtonClick() {
    this.onFlowNext.emit();
  }

  onTimeSlotSelect(timeSlot: ITimeSlot) {
    this.selectedTime = timeSlot.title;
    const bookingInformation: IBookingInformation = {
      branchPublicId: this.selectedBranch.publicId,
      serviceQuery: this.getServicesQueryString(),
      numberOfCustomers: this.noOfCustomers,
      date: this.currentlyActiveDate.mDate.locale(DEFAULT_LOCALE).format("YYYY-MM-DD"),
      time: timeSlot.title
    };

    const appointment: IAppointment = {
      services: this.selectedServices
    };
    if (this.preselectedTimeSlot == timeSlot.title) {
      this.onFlowNext.emit();
    }
    if (this.preselectedTimeSlot != timeSlot.title) {
      if (this.showTimer) {
        this.timeSlotDispatchers.deselectTimeslot();
      }
      this.timeSlotDispatchers.selectTimeslot(timeSlot.title);
      this.reserveDispatchers.reserveAppointment(
        bookingInformation,
        appointment
      );
    }
  }

  private getTimeSlots() {
    const bookingInformation: IBookingInformation = {
      branchPublicId: this.selectedBranch.publicId,
      serviceQuery: this.getServicesQueryString(),
      numberOfCustomers: this.noOfCustomers,
      date: this.currentlyActiveDate.mDate.format("YYYY-MM-DD"),
      time: this.selectedTime
    };

    this.timeSlotDispatchers.getTimeslots(bookingInformation);
  }

  getServicesQueryString(): string {
    return this.selectedServices.reduce(
      (queryString, service: ICalendarService) => {
        return queryString + `;servicePublicId=${service.publicId}`;
      },
      ""
    );
  }

  changeCustomerCount(step) {
    this.timeSlotDispatchers.deselectTimeslot();
    if (this.noOfCustomers + step == 0) {
      return;
    }
    this.preselectedTimeSlot = null;
    this.noOfCustomers += step;
    this.getTimeSlots();
    this.reservationExpiryTimerDispatchers.hideReservationExpiryTimer();
    this.timeSlotDispatchers.selectTimeslot(null);
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
