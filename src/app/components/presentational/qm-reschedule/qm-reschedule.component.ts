import { QmModalService } from "./../qm-modal/qm-modal.service";
import { IAppointment } from "./../../../../models/IAppointment";
import { ICalendarService } from "./../../../../models/ICalendarService";
import { IBranch } from "./../../../../models/IBranch";
import {
  CalendarBranchSelectors,
  UserSelectors,
  BranchSelectors,
  ReserveDispatchers,
  ReserveSelectors,
  TimeslotDispatchers,
  ReservationExpiryTimerDispatchers,
  AppointmentDispatchers,
  AppointmentSelectors,
  InfoMsgDispatchers
} from "./../../../../store";
import { ICalendarBranch } from "./../../../../models/ICalendarBranch";
import { Subscription, Observable } from "rxjs";
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef
} from "@angular/core";
import {
  CalendarDate,
  QmCalendarComponent
} from "src/app/components/containers/qm-calendar/qm-calendar.component";
import * as moment from "moment";
import { IBookingInformation } from "src/models/IBookingInformation";
import {
  CalendarServiceSelectors,
  ServicePointSelectors,
  SystemInfoSelectors
} from "src/store/services";
import { TranslateService } from "@ngx-translate/core";
import { QueueService } from "../../../../util/services/queue.service";
import { DEFAULT_LOCALE } from "src/constants/config";
import { ISystemInfo } from "src/models/ISystemInfo";

enum RescheduleState {
  Default = 1,
  OnDeletion
}

@Component({
  selector: "qm-reschedule",
  templateUrl: "./qm-reschedule.component.html",
  styleUrls: ["./qm-reschedule.component.scss"]
})
export class QmRescheduleComponent implements OnInit, OnDestroy {
  currentlyActiveDate: CalendarDate;
  selectedServices: any;

  private subscriptions: Subscription = new Subscription();
  private branchSubscription$: Observable<ICalendarBranch | IBranch>;
  public reservableDates: moment.Moment[] = [];
  private serviceSubscription$: Observable<ICalendarService[]>;
  public selectedCalendarBranch: ICalendarBranch;
  private rescheduleTime: string;
  noOfCustomers: number = 1;
  originalAppointmentTime: string;
  enableReschedule: boolean = false;
  selectedBranch: ICalendarBranch | IBranch;
  isRescheduleEnabledInUtt: boolean = true;
  isDeleteEnabledInUtt: boolean = true;
  isOriginalAppointmentTimeChanged = false;
  isDateSelected: boolean = false;
  isShowExpandedAppointment: boolean = false;

  timeConvention: string = "24";
  userDirection$: Observable<string>;
  @ViewChild("qmcalendar") qmCalendar: QmCalendarComponent;
  userLocale: string = DEFAULT_LOCALE;

  currentRescheduleState: RescheduleState = RescheduleState.Default;
  selectedDates: CalendarDate[];

  @Input()
  editAppointment: IAppointment;

  @Output()
  onFlowExit: EventEmitter<any> = new EventEmitter();

  @ViewChild('timeSlotsContainer') timeSlotContainer: ElementRef;

  
  // date format related variables
  systemInformation:ISystemInfo;

  constructor(
    private userSelectors: UserSelectors,
    private branchSelectors: BranchSelectors,
    private reserveSelectors: ReserveSelectors,
    private reserveDispatchers: ReserveDispatchers,
    private calendarServiceSelectors: CalendarServiceSelectors,
    private timeSlotDispatchers: TimeslotDispatchers,
    private qmModalService: QmModalService,
    private reservationExpiryTimerDispatchers: ReservationExpiryTimerDispatchers,
    private appointmentDispatchers: AppointmentDispatchers,
    private calendarBranchSelectors: CalendarBranchSelectors,
    private servicePointSelectors: ServicePointSelectors,
    private systemInfoSelectors: SystemInfoSelectors,
    private translationService: TranslateService,
    private appointmentSelectors: AppointmentSelectors,
    private queueService: QueueService,
    private SystemInfoSelectors : SystemInfoSelectors
  ) {
    this.branchSubscription$ = this.branchSelectors.selectedBranch$;
    this.serviceSubscription$ = this.calendarServiceSelectors.selectedServices$;
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["editAppointment"] && this.editAppointment) {

      this.enableReschedule = false;
      window["moment"] = moment;
      const calculatedAppointmentTime = moment(this.editAppointment.start).tz(
        this.editAppointment.branch.fullTimeZone
      );
      if (calculatedAppointmentTime.isAfter(moment.now())) {
        this.isOriginalAppointmentTimeChanged = false;
      }
      this.selectedDates = [];
      this.isDateSelected = false;
      this.timeSlotDispatchers.deselectTimeslot();
      this.fetchReservableDates();
    }
  }

  ngOnInit() {
    const branchSubscription = this.branchSubscription$.subscribe(cb => {
      this.selectedBranch = cb;
    });

    const systemInfoSubscription = this.systemInfoSelectors.systemInfo$.subscribe(systemInfo=>{
      this.systemInformation = systemInfo;
    });

    this.subscriptions.add(systemInfoSubscription)
    
    const reservableDatesSub = this.reserveSelectors.reservableDates$.subscribe(
      (dates: moment.Moment[]) => {
        this.reservableDates = dates;
      }
    );

    const serviceSubscription = this.serviceSubscription$.subscribe(s => {
      this.selectedServices = s;
    });

    const uttSubscription = this.servicePointSelectors.uttParameters$
      .subscribe(uttParameters => {
        if (uttParameters) {
          this.isRescheduleEnabledInUtt = uttParameters.reSheduleAppointment;
          this.isDeleteEnabledInUtt = uttParameters.delAppointment;
        }
      })
      .unsubscribe();

    const calendarBranchsSub = this.calendarBranchSelectors.branches$.subscribe(
      bs => {
        if (this.selectedBranch) {
          this.selectedCalendarBranch = bs.find(
            x => x.qpId == this.selectedBranch.id
          );
        }
      }
    );

    const timeConventionSub = this.systemInfoSelectors.timeConvention$.subscribe(
      tc => {
        this.timeConvention = tc;
      }
    );

    const userLocaleSub = this.userSelectors.userLocale$.subscribe(ul => this.userLocale = ul);

    this.subscriptions.add(calendarBranchsSub);
    this.subscriptions.add(timeConventionSub);
    this.subscriptions.add(uttSubscription);
    this.subscriptions.add(branchSubscription);
    this.subscriptions.add(reservableDatesSub);
    this.subscriptions.add(serviceSubscription);
    this.subscriptions.add(userLocaleSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  fetchReservableDates() {
    const bookingInformation: IBookingInformation = {
      branchPublicId: this.editAppointment.branch.publicId,
      serviceQuery: this.getServicesQueryString(),
      numberOfCustomers: this.noOfCustomers
    };

    this.reserveDispatchers.fetchReservableDates(bookingInformation);
  }

  onSelectDate(date: CalendarDate) {
    
    this.isDateSelected = true;
    this.originalAppointmentTime = null;
    const selectedDate = {...date , mDate : date.mDate.clone()};

    if (
      this.editAppointment &&
      this.editAppointment.services &&
      this.editAppointment.services.length > 0
    ) {
      this.currentlyActiveDate = selectedDate;
      this.timeSlotDispatchers.selectTimeslotDate(selectedDate.mDate.clone());
      this.getTimeSlots();
      this.reservationExpiryTimerDispatchers.hideReservationExpiryTimer();
      this.timeSlotDispatchers.selectTimeslot(null);
      if (moment(this.editAppointment.start).date() !== selectedDate.mDate.date()) {
        this.originalAppointmentTime = null;
      }
      this.enableReschedule = false;
    }

    if(this.timeSlotContainer && this.timeSlotContainer.nativeElement) {
      this.timeSlotContainer.nativeElement.scrollIntoView();
    }

    this.timeSlotDispatchers.deselectTimeslot();    
  }

  onTimeSlotSelect(time: { title: string }) {
    this.rescheduleTime = time.title;
    this.enableReschedule =
      moment(this.editAppointment.start)
        .tz(this.selectedCalendarBranch.fullTimeZone)
        .format("YYYY-MM-DD HH:mm") !=
      this.currentlyActiveDate.mDate.clone().format("YYYY-MM-DD") +
        " " +
        time.title;
  }

  private getTimeSlots() {
    const bookingInformation: IBookingInformation = {
      branchPublicId: this.editAppointment.branch.publicId,
      serviceQuery: this.getServicesQueryString(),
      numberOfCustomers: this.noOfCustomers,
      date: this.currentlyActiveDate.mDate.format("YYYY-MM-DD"),
      time: this.editAppointment.startTime
    };

    this.timeSlotDispatchers.getTimeslots(bookingInformation);
  }

  getServicesQueryString(): string {
    return this.editAppointment.services.reduce(
      (queryString, service: ICalendarService) => {
        return queryString + `;servicePublicId=${service.publicId}`;
      },
      ""
    );
  }

  onCancelAppointment() {
    this.isDateSelected = false;

    this.qmModalService.openForTransKeys(
      "",
      "modal.cancel.appointment.message",
      "label.yes",
      "label.no",
      result => {
        if (result) {
          this.appointmentDispatchers.deleteAppointment(
            this.editAppointment,
            () => {
              this.showCancelAppointmentSuccessMessage();
            },
            () => {}
          );
          this.onFlowExit.next(true);
          this.queueService.fetechQueueInfo();
        }
      },
      () => {
        this.onFlowExit.next(true);
        this.queueService.fetechQueueInfo();
      },
      {
        date: this.getSelectedAppointmentInfoDate("DD MMM YYYY")
      }
    );
  }

  showCancelAppointmentSuccessMessage() {
    this.translationService
      .get(
        [
          "label.appointment.cancel.done.heading",
          "label.appointment.cancel.done.subheading"
        ],
        { date: this.getSelectedAppointmentInfoDate("DD MMMM YYYY") }
      )
      .subscribe(v => {
        this.qmModalService.openDoneModal(
          v["label.appointment.cancel.done.heading"],
          v["label.appointment.cancel.done.subheading"],
          []
        );
      });
  }

  onRescheduleAppointment() {
    if (this.enableReschedule) {
      this.qmModalService.openForTransKeys(
        "",
        "modal.reschedule.appointment.message",
        "label.yes",
        "label.no",
        result => {
          if (result) {
            let rescheduleAppointment = this.editAppointment;
            const originalAppointmentStartTime = this.editAppointment.start;
            rescheduleAppointment.start = `${this.currentlyActiveDate.mDate.locale(DEFAULT_LOCALE).format(
              "YYYY-MM-DD"
            )}T${this.rescheduleTime}`;

            const timeDiff = moment.duration(
              moment(this.editAppointment.end).diff(
                originalAppointmentStartTime
              )
            );
            let endTime = moment(rescheduleAppointment.start).add(
              timeDiff.asMinutes(),
              "minutes"
            );
            rescheduleAppointment.end = `${endTime.locale(DEFAULT_LOCALE).format(
              "YYYY-MM-DD"
            )}T${endTime.locale(DEFAULT_LOCALE).format("HH:mm")}`;

            this.appointmentDispatchers.rescheduleAppointment(
              rescheduleAppointment
            );

            this.appointmentSelectors.rescheduleProgress$.subscribe(
              progress => {
                if (progress === true) {
                  this.onFlowExit.next(true);
                  this.queueService.fetechQueueInfo();
                }
                else if(progress === false) {
                  this.getTimeSlots();
                }
              }
            );
          }
        },
        () => {}
      );
    }
  }

  getSelectedAppointmentInfoTime() {
    let appointmentInfo = "";
    let timeformat = "hh:mm A";
    if (this.timeConvention === "24") {
      timeformat = "HH:mm";
    }

    if (this.editAppointment) {
      appointmentInfo += moment(this.editAppointment.start)
        .tz(
          this.editAppointment.branch.fullTimeZone ||
            this.selectedCalendarBranch.fullTimeZone
        )
        .format(timeformat);
    }

    return appointmentInfo;
  }

  expandAppointment() {
    this.isShowExpandedAppointment = !this.isShowExpandedAppointment;
  }

  getSelectedAppointmentInfoDate(timeFormat = this.systemInformation.dateConvention) {
    let appointmentInfo = "";

    if (this.editAppointment) {
      //time data
      appointmentInfo += moment(this.editAppointment.start)
        .tz(
          this.editAppointment.branch.fullTimeZone ||
            this.selectedCalendarBranch.fullTimeZone
        )
        .locale(timeFormat.indexOf('MMMM') > 0 ?  this.userLocale : DEFAULT_LOCALE)
        .format(timeFormat);
    }
    return appointmentInfo;
  }

  getSelectedDate(timeFormat = "DD/MM/YYYY") {
    let selectedDate = "";

    if (this.editAppointment && this.currentlyActiveDate) {
      
      selectedDate = this.currentlyActiveDate.mDate.clone()
        .locale(this.userLocale || DEFAULT_LOCALE)
        .format(timeFormat);
    } else {
      selectedDate = this.getSelectedAppointmentInfoDate(timeFormat);
    }

    return selectedDate;
  }

  getSelectedAppointmentInfoCustomer() {
    let appointmentInfo = "";
    if (this.editAppointment && this.editAppointment.customers[0]) {
      appointmentInfo += `${this.editAppointment.customers[0].firstName} `;
      appointmentInfo += `${this.editAppointment.customers[0].lastName}`;
    }
    return appointmentInfo;
  }
  onBlurMethod(){
    this.isShowExpandedAppointment = false;
    
  }
}
