import { ToastService } from './toast.service';
import { UserStatusDispatchers } from './../../store/services/user-status/user-status.dispatchers';
import { UserStatusSelectors } from 'src/store/services';
import { NativeApiService } from './native-api.service';
import { ERROR_CODE_TIMEOUT } from './../../app/shared/error-codes';
import { GlobalNotifyDispatchers } from './../../store/services/global-notify/global-notify.dispatchers';
import { Injectable, NgZone } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, interval, of, Subject, empty } from 'rxjs';
import { tap, catchError, flatMap, retry, map, switchMap, filter } from 'rxjs/operators';
import { from } from 'rxjs/internal/observable/from';
import { retryWhen } from 'rxjs/internal/operators/retryWhen';
import { BLOCKED_URLS } from 'src/util/url-helper';
import { ServiceStateService } from 'src/app/service-state.service';
import { TranslateService } from '@ngx-translate/core';
import { NativeApiSelectors } from 'src/store';
import { timeout } from 'rxjs/internal/operators/timeout';
import { timeoutWith } from 'rxjs/internal/operators/timeoutWith';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { delayWhen } from 'rxjs/internal/operators/delayWhen';
import { ActivatedRoute, Router } from '@angular/router';
import { SPService } from 'src/util/services/rest/sp.service';

@Injectable()
export class QmGlobalHttpInterceptor implements HttpInterceptor {
    isPingSuccess: boolean;

    private timeToWaitBeforeStartPing = 3000;
    private localTimeoutBeforeStartPing;
    private native_ping_period = 5000;
    private http_timeout = 5000;
    private native_max_ping_count_for_message = 1;
    private lastRequestAction = 'NONE';
    // Retry all get requests this many times before starting ping.
    private numberOfTries = 4;

    public recoverApp = new Subject<boolean>();

    readonly MARKED_DEVICES = {
        SAMSUNG_S4_V1: "Samsung GT-I9515",
        SAMSUNG_S4_V2: "Samsung GT-I9505"
    }

    readonly NO_STARTED_USER_SESSION = "NO_STARTED_USER_SESSION";

    constructor(private zone: NgZone, private globalNotifyDispatchers: GlobalNotifyDispatchers,
        private serviceState: ServiceStateService, private translateService: TranslateService,
        private nativeApiService: NativeApiService, private userStatusSelector: UserStatusSelectors,
        private router: Router, private userStatusDispatchers: UserStatusDispatchers,
        private spService: SPService, private toastService: ToastService) {

        window["globalNotifyDispatchers"] = this.globalNotifyDispatchers;
        window["qmGlobalHttpInterceptor"] = this;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if ((this.isABlockedUrl(req.url) && req.method != 'GET') && !this.isAResourceFile(req)) {

            if (!this.serviceState.isActive()) {
                this.lastRequestAction = req.method;

                if (this.localTimeoutBeforeStartPing) {
                    clearTimeout(this.localTimeoutBeforeStartPing);
                }

                this.localTimeoutBeforeStartPing = setTimeout(() => {
                    // Show yellow network message only if not retrying get requesting...
                    if (this.serviceState.getCurrentTry() == 0) {
                        this.translateService.get('poor_network_msg').subscribe((msg) => {
                            this.globalNotifyDispatchers.showWarning({ message: msg });
                        }).unsubscribe();
                    }

                }, this.timeToWaitBeforeStartPing);

                //if(config.method == R.SERVICE_ACTIONS.GET) //This is force block GET requests
                this.serviceState.setActive(true);
            }

            return next.handle(req).pipe(timeoutWith(this.http_timeout, throwError({ status: ERROR_CODE_TIMEOUT })), tap((response: any) => {
                if (response instanceof HttpResponse) {
                    if ((this.isABlockedUrl(req.url) && req.method != 'GET') && !this.isAResourceFile(req)) {
                        //networkMessageController.hideNetworkMessage();
                        this.globalNotifyDispatchers.hideNotifications();
                        if (this.localTimeoutBeforeStartPing) {
                            clearTimeout(this.localTimeoutBeforeStartPing);
                            this.localTimeoutBeforeStartPing = undefined;
                        }
                        this.serviceState.setActive(false);
                        this.serviceState.resetTryCounter();
                    } else if (response == null) {
                        try {
                            //var util = $injector.get('util');
                            //util.showMessage($injector.get('application').getTranslatedMessage(R.TRANSLATION_MESSAGE_KEYS.NULL_RESPONSE));
                        }
                        catch (e) {
                        }
                    }
                }

            }), catchError((error: HttpErrorResponse) => {
                // when blocke url fails 

                if (error.status === ERROR_CODE_TIMEOUT) {
                    if (this.localTimeoutBeforeStartPing) {
                        clearTimeout(this.localTimeoutBeforeStartPing);
                        this.localTimeoutBeforeStartPing = undefined;
                    }

                    this.showNoNetworkMessage();

                    if (this.nativeApiService.isNativeBrowser()) {
                        this.nativeApiService.startPing(this.native_ping_period, this.native_max_ping_count_for_message);
                    }
                    else {
                        this.translateService.get('label.critical_com_error').subscribe((t) => {
                            this.toastService.stickyToast(t);
                            this.globalNotifyDispatchers.showCriticalCommunicationError();
                            setTimeout(() => {
                                this.globalNotifyDispatchers.hideNotifications();
                            }, 2000);

                        }).unsubscribe();
                    }
                } else {
                    clearTimeout(this.localTimeoutBeforeStartPing);
                }

                return throwError(error);
            }));
        }
        else {

            // handle retry logic when needed
            if (req.method === 'GET' && !this.isAResourceFile(req) && !this.isCentralAvailabilityChecking(req.url) && !this.isSkipGetUrls(req.url)) {
                return this.zone.run(() => {

                    return next.handle(req).pipe(
                        tap((res) => {
                            this.isPingSuccess = false;
                        }),
                        timeoutWith(this.http_timeout, throwError({ status: ERROR_CODE_TIMEOUT })),
                        retryWhen(res => {
                            return interval(this.http_timeout).pipe(
                                flatMap((count) => {
                                    if (this.serviceState.getCurrentTry() === this.numberOfTries) {
                                        if (this.nativeApiService.isNativeBrowser() && !this.isPingSuccess && !this.serviceState.getIsNetWorkPingStarted()) {
                                            this.serviceState.setIsNetWorkPingStarted(true);
                                            this.nativeApiService.startPing(this.native_ping_period, this.native_max_ping_count_for_message);
                                        } else if (!this.nativeApiService.isNativeBrowser()) {
                                            this.serviceState.incrementTry();
                                        }
                                        return of(count);
                                    } else {
                                        if (this.serviceState.getCurrentTry() == 0) {
                                            this.showNoNetworkMessage();
                                        }
                                        this.serviceState.incrementTry();
                                        if (this.localTimeoutBeforeStartPing) {
                                            clearTimeout(this.localTimeoutBeforeStartPing);
                                            this.localTimeoutBeforeStartPing = undefined;
                                        }
                                        return of(count);
                                    }
                                }), delayWhen((d) => {
                                    if (this.serviceState.getCurrentTry() < this.numberOfTries) {
                                        return of(req);
                                    } else {
                                        if (!this.nativeApiService.isNativeBrowser()) {
                                            if (this.serviceState.getCurrentTry() === this.numberOfTries) {
                                                this.globalNotifyDispatchers.showCriticalCommunicationError();
                                                this.translateService.get('label.critical_com_error').subscribe((t) => {
                                                    this.toastService.stickyToast(t);
                                                    this.globalNotifyDispatchers.hideNotifications();
                                                }).unsubscribe();
                                            }
                                        }

                                       return this.recoverApp.asObservable();
                                    }
                                })
                            )
                        }),
                        tap((res) => {
                            if (res instanceof HttpResponse) {
                                if (res.status === 200) {
                                    this.globalNotifyDispatchers.hideNotifications();
                                    if (this.localTimeoutBeforeStartPing) {
                                        clearTimeout(this.localTimeoutBeforeStartPing);
                                        this.localTimeoutBeforeStartPing = undefined;
                                    }
                                    this.serviceState.setActive(false);
                                    this.serviceState.resetTryCounter();
                                }
                            }
                            return res;
                        })
                    );
                });

            }
            else {
                return next.handle(req);
            }
        }
    }

    isABlockedUrl(url) {
        if (url.match(/calendar-backend/g)) {
            url = url.split("/").splice(2);
        } else if (url.match(/rest\/servicepoint/g)) {
            url = url.split("/").splice(3);
        } else {
            url = url.split("/")
        }
        var service_call_string = "";
        for (var key in url) {
            if (url.hasOwnProperty(key)) {
                //url[key] = url[key].split("?")[0];
                if (!!!parseInt(url[key]) && url[key].length < 18 && url[key].indexOf("-") < 0)
                    service_call_string += url[key];
            }
        }
        try {
            var metaData = this.isStringInArray(service_call_string, BLOCKED_URLS);
            if (metaData.count > 1)
                throw "Sorry but your BLOCKED URLS seems to have duplicates or some serveres are made up of the same url parts."
        } catch (err) {
            //errorHandler.handleError(err, "spService is detecting duplicate entries in BLOCKED URLS");
        }
        var isBlockedUrl = false;
        if (metaData.exists) {
            isBlockedUrl = true;
        } else {
            isBlockedUrl = false;
        }
        return isBlockedUrl;
    }

    isSkipGetUrls(url) {
        let isSkip = false;
        if (url.match(/^\/rest\/appointment\/.+appointments\/\d+$/) || url.match(/branches\/\d\/queues$/)) {
            isSkip = true;
        }

        return isSkip;
    }

    isAResourceFile(config) {
        if (config.url.match(/.html/g) || config.url.match(/.js/g) || config.url.match(/.properties/g) || config.url.match(/.otf/g) || config.url.match(/.ttf/g)) {
            return true;
        } else {
            return false;
        }
    }

    isStringInArray(string: any, array: any) {
        if (!string && !array)
            return;
        var isPresent = false;
        var numberOfStringsPresent = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] == string) {
                numberOfStringsPresent++;
            }
        };

        if (numberOfStringsPresent > 0) {
            isPresent = true;
        } else {
            isPresent = false;
        }

        return { exists: isPresent, count: numberOfStringsPresent };
    }

    isUserStatusCheck(url) {
        let statusUrl = 'rest/servicepoint/user/status';
        if (url.includes(url)) {
            return true;
        }

        return false;
    }

    isCentralAvailabilityChecking(url) {
        const calendarUrl = '/calendar-backend/api/v1/branches/';
        const calendarSystemInfoUrl = '/calendar-backend/api/v1/settings/systemInformation';
        if (url.includes(calendarUrl)) {
            const urlParts = url.split(calendarUrl);
            if (urlParts.length === 2) {
                const sndPart = urlParts[1];
                const sndPartArr = sndPart.split('/');
                if (sndPartArr.length === 1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
         } else if (url.includes(calendarSystemInfoUrl)) {
             const urlParts = url.split(calendarSystemInfoUrl);
             if (urlParts.length === 2) {
                return true;
             } else {
                 return false;
             }
         } else {
            return false;
        }
    }

    resetState() {
        this.zone.run(() => {
            this.globalNotifyDispatchers.hideNotifications();
            this.serviceState.setActive(false);
        });
    }

    retryFailedGetRequests() {
        this.zone.run(() => {
            this.isPingSuccess = true;
            this.serviceState.resetTryCounter();
            this.isPingSuccess = false;
            this.serviceState.setIsNetWorkPingStarted(false);
            this.recoverApp.next(true);
        });
    }

    showNoNetworkMessage() {
        this.zone.run(() => {
            this.translateService.get('no_network_msg').subscribe((msg) => {
                this.globalNotifyDispatchers.showError({ message: msg });
            }).unsubscribe();
        });
    }

    resetCommunications = () => {
        this.serviceState.setActive(false);
    }

    notifyNativePingStatus(val) {
        this.isPingSuccess = val;
    }

    updateAppFromBackground(deviceType) {
        //enable all communications
        window['ajaxEnabled'] = true;

        //httpResponseErrorInterceptor.resetState();
        this.globalNotifyDispatchers.hideNotifications();
        this.resetCommunications();
        this.serviceState.resetTryCounter();

        //qeventsHandller.connectCometD();
        this.spService.fetchUserStatus().subscribe((res: any) => {
            if (!res) {
                /**
                 * For specific devices like S4, when network changes from 3g->4g and app resumes res==undefined == TRUE and app gets logout.
                 * So show network error message for such devices only
                 * by Prasad
                 */
                if (deviceType == this.MARKED_DEVICES.SAMSUNG_S4_V1 || deviceType == this.MARKED_DEVICES.SAMSUNG_S4_V2) {
                    this.showNoNetworkMessage();
                }
                else {
                    this.nativeApiService.logOut();
                }
            }
            else {
                if (res.userState == this.NO_STARTED_USER_SESSION && this.router.url != '/profile') {
                    this.nativeApiService.logOut();
                }
            }
        }, () => {

        });
    }
}

window["removeWebModels"] = () => {
    window["qmGlobalHttpInterceptor"].resetState();
};

window["onPingSuccess"] = () => {
    const interceptor = window["qmGlobalHttpInterceptor"];
    window['ajaxEnabled'] = true;
    interceptor.notifyNativePingStatus(false);
    interceptor.retryFailedGetRequests();
};

window['updateAppFromBackgroundFromNative'] = () => {
    const interceptor = window["qmGlobalHttpInterceptor"];
    interceptor.updateAppFromBackground();

};
