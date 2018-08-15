import { ActionReducerMap } from "@ngrx/store";
import * as fromSystemInfo from "./system-info.reducer";
import { Store } from "@ngrx/store";
import * as fromLicense from "./license.reducer";
import * as fromAccount from "./account.reducer";
import * as fromPlatform from "./platform.reducer";
import * as fromBranch from "./branch.reducer";
import * as fromServices from "./service.reducer";
import * as fromServicePoints from "./service-point.reducer";
import * as fromUserStatus from "./user-status.reducer";
import * as fromQueue from "./queue.reducer";
import * as fromCustomer from "./customer.reducer";
import * as fromCalendarSettings from "./calendar-settings.reducer";
import * as fromReservationTimer from "./reservation-expiry-timer.reducer";
import * as fromCalendarBranches from "./calendar-branch.reducer";
import * as fromCalendarServices from "./calendar-service.reducer";
import * as fromTimeslot from "./timeslot.reducer";
import * as fromReserve from './reserve.reducer';
import * as fromInfoMsgBox from './message-box.reducer';
import * as fromNotes from './note.reducer';

export interface IAppState {
  systemInfo: fromSystemInfo.ISystemInfoState;
  license: fromLicense.ILicenseState;
  account: fromAccount.IAccountState;
  platform: fromPlatform.IPlatformInfoState;
  branches: fromBranch.IBranchState;
  services: fromServices.IServiceState;
  servicePoints: fromServicePoints.IServicePointState;
  userStatus: fromUserStatus.IUserStatusState;
  customers: fromCustomer.ICustomerState;
  queue: fromQueue.IQueueState;
  calendarSettings: fromCalendarSettings.ICalendarSettingsState;
  reservationExpiryTimer: fromReservationTimer.IReservationTimerState;
  calendarBranches: fromCalendarBranches.ICalendarBranchState;
  calendarServices: fromCalendarServices.ICalendarServiceState;
  timeslot: fromTimeslot.ITimeslotState;
  reserved: fromReserve.IReserveState;
  infoMsgBox: fromInfoMsgBox.IMessageInfoState;
  note: fromNotes.INoteState
}

export const reducers: ActionReducerMap<IAppState> = {
  systemInfo: fromSystemInfo.reducer,
  license: fromLicense.reducer,
  account: fromAccount.reducer,
  platform: fromPlatform.reducer,
  branches: fromBranch.reducer,
  services: fromServices.reducer,
  servicePoints: fromServicePoints.reducer,
  userStatus: fromUserStatus.reducer,
  queue: fromQueue.reducer,
  customers: fromCustomer.reducer,
  calendarSettings: fromCalendarSettings.reducer,
  reservationExpiryTimer: fromReservationTimer.reducer,
  calendarBranches: fromCalendarBranches.reducer,
  calendarServices: fromCalendarServices.reducer,
  timeslot: fromTimeslot.reducer,
  reserved: fromReserve.reducer,
  infoMsgBox: fromInfoMsgBox.reducer,
  note: fromNotes.reducer
};
