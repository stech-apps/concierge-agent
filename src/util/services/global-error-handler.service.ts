import { ERROR_CODE_TIMEOUT } from './../../app/shared/error-codes';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { Observable, throwError, interval, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DataServiceError } from 'src/store/services/data.service';
import { GlobalNotifyDispatchers } from 'src/store/services/global-notify';
import { retryWhen, flatMap } from 'rxjs/operators';

@Injectable()
export class GlobalErrorHandler {

    private readonly genericErrorKey: string = 'messages.error.generic.with.context';
    constructor(private toastService: ToastService, private globalNotifyDispatchers: GlobalNotifyDispatchers, private translateService: TranslateService) { }

    showError(contextualErrorKey: string, errorAction: any, interpolationParams: any = {}) {
        // switch (error.errorCode) {
        // default:
        const dsError = errorAction as DataServiceError<any>;

        console.error(dsError);
        /* this.translateService.get([contextualErrorKey, this.genericErrorKey], {
             errorCode: dsError.errorCode,
             ...interpolationParams
         }).subscribe(
             (errorMsgs: string[]) => {
                 this.toastService.errorToast(`${errorMsgs[contextualErrorKey]}. ${errorMsgs[this.genericErrorKey]}`);
             }
             ).unsubscribe();
 
             */
        // break;
        // }
    }

    handleError<T>(requestData?: T) {
        return (res: HttpErrorResponse) => {
            const error = new DataServiceError(res, requestData);
            console.error(error);
            //this.handleGlobalNotifications(error);
            return throwError(error);
        };
    }

    retryForRobustness(maxRetry: number = 5, delayMs: number = 2000) {
        return (src: Observable<any>) => src.pipe(
            retryWhen(_ => {
                return interval(delayMs).pipe(
                    flatMap(count => count == maxRetry ? throwError("Giving up") : of(count))
                )
            })
        )
    }

    handleGlobalNotifications(error: DataServiceError<any>) {
        if (error.responseData.status == ERROR_CODE_TIMEOUT) {
            this.translateService.get(['no_network_msg']).subscribe((messages) => {
                this.globalNotifyDispatchers.showError({
                    message: messages['no_network_msg']
                });
            });

        }
    }
}
