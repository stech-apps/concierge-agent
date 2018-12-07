import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { GlobalErrorHandler } from 'src/util/services/global-error-handler.service';
import { SystemInfoSelectors } from 'src/store/services/system-info/system-info.selectors';
import { calendarEndpoint } from '../data.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CalendarPingDataService {

    hostAddress: string;
    private subscriptions: Subscription = new Subscription();
    authorizationHeader: HttpHeaders;

    constructor(private http: HttpClient, private errorHandler: GlobalErrorHandler, private systemInfoSelector: SystemInfoSelectors) {
        const hostSubscription = this.systemInfoSelector.centralHostAddress$.subscribe((info) => this.hostAddress = info);
        this.subscriptions.add(hostSubscription);
        const authorizationSubscription = this.systemInfoSelector.authorizationHeader$.subscribe((info) => this.authorizationHeader = info);
        this.subscriptions.add(authorizationSubscription);
    }

    getCalendarPingInfo(): Observable<HttpResponse<any>> {
        return this.http
            .get(`${this.hostAddress}${calendarEndpoint}/ping`, {observe : 'response'})
            .pipe(catchError(this.errorHandler.handleError(true)));
    }
}
