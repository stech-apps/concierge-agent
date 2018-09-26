import { ICalendarSettingResponse } from "./../../../models/ICalendarSettingResponse";
import { ICalendarSetting } from "./../../../models/ICalendarSetting";
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, Subscription } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { calendarEndpoint, DataServiceError } from "./../data.service";
import { GlobalErrorHandler } from "../../../util/services/global-error-handler.service";
import { SystemInfoSelectors } from "../system-info";

@Injectable()
export class CalendarSettingsService {
  hostAddress: string;
  private subscriptions: Subscription = new Subscription();
  authorizationHeader: HttpHeaders;
  
  constructor(
    private http: HttpClient,
    private errorHandler: GlobalErrorHandler,
    private systemInfoSelector : SystemInfoSelectors
  ) {
    const hostSubscription = this.systemInfoSelector.centralHostAddress$.subscribe((info) => this.hostAddress = info);
    this.subscriptions.add(hostSubscription);
    const authorizationSubscription = this.systemInfoSelector.authorizationHeader$.subscribe((info) => this.authorizationHeader = info);
    this.subscriptions.add(authorizationSubscription);
  }

  getSerttingsInfo(): Observable<{ data: ICalendarSetting }> {
    return this.http
    .get<ICalendarSettingResponse>(`${this.hostAddress}${calendarEndpoint}/settings/search?group=calendar`, {headers : this.authorizationHeader})
      .pipe(
        map((res: ICalendarSettingResponse) => {
          const reservationTime = res["settingList"][0]["data"].match(
            /"reservationExpiryTimeSeconds"\s*:\s*"(\d*)"/i
          )[1];
          return { data: { reservationExpiryTimeSeconds: reservationTime } };
        }),
        catchError(this.errorHandler.handleError())
      );
  }
}
