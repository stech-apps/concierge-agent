import { TranslateService } from "@ngx-translate/core";
import { ToastService } from "./../../../../util/services/toast.service";
import { TimeUtils } from "./../../../../util/services/timeUtils.service";
import { ReservationExpiryTimerDispatchers } from "./../../../../store/services/reservation-expiry-timer/reservation-expiry-timer.dispatchers";
import { CalendarSettingsSelectors } from "./../../../../store/services/calendar-settings/calendar-settings.selectors";
import { ReservationExpiryTimerSelectors } from "./../../../../store/services/reservation-expiry-timer/reservation-expiry-timer.selectors";
import { Component, OnInit, OnDestroy, Output ,EventEmitter, Input} from "@angular/core";
import { Subscription } from "rxjs";
import { Observable } from "rxjs";
import { UserSelectors } from "../../../../store";
import { registerLocaleData } from "@angular/common";
// import {  } from "events";

@Component({
  selector: "qm-reservation-timer",
  templateUrl: "./qm-reservation-timer.component.html",
  styleUrls: ["./qm-reservation-timer.component.scss"]
})
export class QmReservationTimerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  userDirection$: Observable<string>;
  getExpiryReservationTime$: Observable<number>;
  counterString: string;
  intervalRef = null;
  prevTimeStamp = undefined;
  timerStringWCAG: string;
  @Output() ThirtySecondsGone: EventEmitter<string> = new EventEmitter<string>();
  @Output() ExpandtheTimer: EventEmitter<string> = new EventEmitter<string>();
  calendarExpiryTime : number;
  @Input() events: Observable<void>;
  

  constructor(
    private userSelectors: UserSelectors,
    private reservationExpiryTimerSelectors: ReservationExpiryTimerSelectors,
    private calendarSettingsSelectors: CalendarSettingsSelectors,
    private reservationExpiryTimerDispatchers: ReservationExpiryTimerDispatchers,
    private timeUtils: TimeUtils,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    this.userDirection$ = this.userSelectors.userDirection$;
    this.getExpiryReservationTime$ = this.calendarSettingsSelectors.getReservationExpiryTime$;
  }

  ngOnInit() {
    const expiryReservationCalendarSettingSubscription = this.getExpiryReservationTime$.subscribe(
      (calendarExpiryTime: number) => {       
        // If view is rendered on screen again reset timer!!
        this.calendarExpiryTime = calendarExpiryTime;
        const showTimerSubscription = this.reservationExpiryTimerSelectors.showReservationExpiryTime$.subscribe(
          value => {
            if (value) {
              this.startTimer(calendarExpiryTime);
            }
          }
        );
        this.subscriptions.add(showTimerSubscription);
      }
    );
    this.subscriptions.add(expiryReservationCalendarSettingSubscription);
   var eventsSubscription = this.events.subscribe(() => {
      this.timerStringWCAG = this.counterString;
   });
   this.subscriptions.add(eventsSubscription);
  }

  startTimer(onGoingTime: number) {
    this.ExpandtheTimer.emit('initial');
    // Stop any ongoing timer!!
    clearInterval(!!this.intervalRef && this.intervalRef);

    // Format Number into string (Initial Value)
    this.counterString = this.timeUtils.formatSecondsIntoMinituesAndSeconds(
      onGoingTime
    );

    this.timerStringWCAG = this.counterString;
    var TimeSlotinterval = setInterval(() => {
      if (onGoingTime >= 120) {
        this.timerStringWCAG = this.counterString;
      } else {
        this.timerStringWCAG = undefined;
        clearInterval(TimeSlotinterval);
      }
    }, 120000);

    // Start timer!!
    this.intervalRef = setInterval(() => {
      // Decrement counter
      if(onGoingTime > 0){
        var nowTimeStamp = Math.floor(new Date().getTime()/1000);
        if(this.prevTimeStamp){
          var diffTimeStamp = nowTimeStamp - this.prevTimeStamp;
          if(diffTimeStamp > 3){
            // If more than 3 seconds substract it from the original time!!!
            // 5 extra seconds added to accomodate for time loss in digest loop
            onGoingTime = onGoingTime - diffTimeStamp - 5;
          }
        }
        this.prevTimeStamp = Math.floor(new Date().getTime()/1000);
        onGoingTime--;
      }
      if (onGoingTime < 0){
        onGoingTime = 0;
      }

      // Format Number into string
      this.counterString = this.timeUtils.formatSecondsIntoMinituesAndSeconds(
        onGoingTime
      );

      // Set value in store!!
      this.reservationExpiryTimerDispatchers.setReservationExpiryTimer(
        onGoingTime
      );
      

      // auto collapse reservation timer view after 30 seconds
      if ( onGoingTime > 120 && (this.calendarExpiryTime - onGoingTime == 30)) {       
        console.log(this.calendarExpiryTime - onGoingTime);
        this.ThirtySecondsGone.emit('ThirtySecondsgone');
      }
      
      if(onGoingTime > 120 && (this.calendarExpiryTime-onGoingTime - 30) !== 0 &&(this.calendarExpiryTime-onGoingTime - 30)%120 == 0) {
        this.ExpandtheTimer.emit('EveryTwoMins');
      }

      // 2min before expire show message "Timer about the expire!!" and expand the timer.
      if (onGoingTime === 120) {
        const translateSubscription = this.translate
          .get("warning_message_on_cancel_reservation")
          .subscribe((res: string) => {
            this.toastService.errorToast(res);
          });
        translateSubscription.unsubscribe();
        this.ExpandtheTimer.emit('TwoMins');
      }

      // After timer expired show message "Timer has expired!!"
      if (onGoingTime === 0) {
        const translateSubscription = this.translate
          .get("reservation_cancelled")
          .subscribe((res: string) => {
            this.toastService.errorToast(res);
          });
        translateSubscription.unsubscribe();
        this.reservationExpiryTimerDispatchers.hideReservationExpiryTimer();
      }

      // Stop timer when hit 0
      if (onGoingTime === 0) {
        clearInterval(this.intervalRef);
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalRef);
    this.subscriptions.unsubscribe();
  }
}
