import { interval } from 'rxjs';
import { ServicePointSelectors, QueueDispatchers } from './../store/services';
import { Injectable } from '@angular/core';
import cssVars from 'css-vars-ponyfill';
import { Validators } from '@angular/forms';
import { GlobalNotifyDispatchers } from 'src/store/services/global-notify';

@Injectable()
export class Util {

    qrCodeListnerTimer: any;
    public qrRelatedData: any;
    private _refreshUrl: string;

    constructor(private servicePointSelectors: ServicePointSelectors, private queueDispatcher: QueueDispatchers, private globalDispatchers: GlobalNotifyDispatchers) {
        window['x'] = this.setSelectedApplicationTheme.bind(this);
    }

    compareVersions(baseVersion, currentVersion) {
        var a = baseVersion.split('.')
            , b = currentVersion.split('.')
            , i = 0, len = Math.max(a.length, b.length);

        for (; i < len; i++) {
            if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
                return 1;
            } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
                return -1;
            }
        }
        return 0;
    }

    setDefaultApplicationTheme() {
        this.setApplicationTheme(null);
    }

    setSelectedApplicationTheme() {
        this.servicePointSelectors.openServicePoint$.subscribe((sp) => {
            this.setApplicationTheme(sp);
        }).unsubscribe();
    }

    setApplicationTheme(servicePoint) {
        let themeColor = '#a9023a';

        if (servicePoint) {
            themeColor = servicePoint.parameters.highlightColor;
            if (themeColor == "customized") {
                themeColor = servicePoint.parameters.customizeHighlightColor;
            }
        }

        //set color for app theme custom property
        if (themeColor) {
            let styles: any = getComputedStyle(document.documentElement);
            document.documentElement.style.setProperty('--app-theme', themeColor);

            //IE fix 
            if (!(window["CSS"] && CSS.supports('color', 'var(--primary)'))) {
                setTimeout(() => {
                    cssVars({
                        onlyVars: true,
                        preserve: true,
                        variables: {
                            'app-theme': themeColor
                        }
                    });
                }, 0);
            }
        }

    }

    replaceCharcter(value: string) {
        return value.replace(/^\s+|\s+$/g, "").replace(/\n/g, "\\n").replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
    }

    buildPhoneNumber(number: string) {
        // return number.replace("+", "");
        return number;
    }

    phoneNoValidator() {
        return [Validators.pattern(/^[0-9\+\s]+$/)]
    }

    emailValidator() {
        return [Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)];
    }

    qrCodeListner() {
        this.qrCodeListnerTimer = setInterval(() => {
            if (this.qrRelatedData && this.qrRelatedData.isQrCodeLoaded) {
                this.qrRelatedData.isQrCodeLoaded = false;
                this.queueDispatcher.fetchSelectedVisit(this.qrRelatedData.branchId, this.qrRelatedData.qrCode);
                this.qrRelatedData = null;
            }
        }, 1000);
    }

    removeQRCodeListner() {
        if (this.qrCodeListnerTimer) {
            this.qrRelatedData = null;
            clearInterval(this.qrCodeListnerTimer);
        }
    }

    setQRRelatedData(qrData: any) {
        this.qrRelatedData = qrData;
    }

    getLocaleDate(dateString: string) {
        var date = new Date(dateString);
        var timeOffset = date.getTimezoneOffset();

        var timeStamp = date.getTime() + (timeOffset * 60000);
        var localeDate = new Date(timeStamp);
        var localeTimeFormat = localeDate.toLocaleTimeString();
        var localeFormat = localeDate.toLocaleString();

        var gmtIndex = localeFormat.indexOf('+');
        if (gmtIndex < 0) {
            gmtIndex = localeFormat.indexOf('-');
        }
        var timePortion = localeTimeFormat;
        if (gmtIndex != -1) {
            timePortion = localeTimeFormat.split(" ")[0];
        }

        var secondsIndex = timePortion.lastIndexOf(":");
        var modifyTime = timePortion.substring(0, secondsIndex);

        var modifyDate = localeFormat.replace(localeTimeFormat, modifyTime);

        return modifyDate;
    }

    setRefreshUrl(value: string) {
        this._refreshUrl = value;
    }

    getRefreshUrl() {
        return this._refreshUrl;
    }
}
