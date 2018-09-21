import { IPlatform } from './../../models/IPlatform';
import { Injectable, ApplicationRef } from '@angular/core';
import { LOGOUT_URL } from '../url-helper';
import { Util } from '../util';
import { NativeApiSupportService } from './native-api-support.service';
import { NativeApiDispatchers } from '../../store';
declare var Android: any;
declare var webkit: any;

var nativeApiService: any;

@Injectable({
  providedIn: 'root'
})

export class NativeApiService {

  constructor(
    private util: Util,
    private nativeApiSupport: NativeApiSupportService,
    private nativeApiDispatcher: NativeApiDispatchers
  ) {
    nativeApiService = this;
  }

  showNativeLoader(state) {
    /**
     * if state == true, show native webloader
     * else stop native webloader
     */
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      //support iOS 8 and above version
      try {
        webkit.messageHandlers.removeNativeLoader.postMessage(true);
      } catch (err) {
        console.log('The native context does not exist yet', { class: "nativeApi", func: "removeNativeLoader", exception: err });
      }
    }
    else if (navigator.userAgent.match(/Android/i)) {
      try {
        Android.showWebLoader(state);
      }
      catch (err) {
        console.log('The native context does not exist yet', { class: "nativeApi", func: "removeNativeLoader", exception: err });
      }
    }
  }

  isNativeBrowser(): boolean {
    if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
      return true;
    }
    else {
      return false;
    }
  }

  getUserAgent(): string {
    return navigator.userAgent;
  }

  getPlatform(): IPlatform {
    return {
      isMobile: this.isNativeBrowser(),
      userAgent: navigator.userAgent
    };
  }

  showPrivacy(privacyUrl) {
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      //support iOS 8 and above version
      try {
        webkit.messageHandlers.showPrivacy.postMessage(privacyUrl);
      } catch (err) {
        console.log('The native context does not exist yet', {
          class: "nativeApi",
          func: "showPrivacy",
          exception: err
        });
      }
    } else if (navigator.userAgent.match(/Android/i)) {
      try {
        Android.showPrivacy(privacyUrl);
      }
      catch (err) {
        console.log('The native context does not exist yet', {
          class: "nativeApi",
          func: "showPrivacy",
          exception: err
        });
      }
    }
    else {
      window.open(privacyUrl);
    }

  }

  logOut() {
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      //support iOS 8 and above version
      try {
        webkit.messageHandlers.userLogout.postMessage(true);
      } catch (err) {
        console.log("The native context does not exist yet", { class: "nativeApi", func: "logout", exception: err });
      }
    }
    else if (navigator.userAgent.match(/Android/i)) {
      var nativeAndroidVersion = "1.0.0.1";
      var nativeAppVersion = "0.0.0.0";
      try {
        nativeAppVersion = Android.getNativeAppVersion();
      }
      catch (err) {
        nativeAppVersion = "0.0.0.0";
      }

      var status = 0;
      try {
        status = this.util.compareVersions(nativeAndroidVersion, nativeAppVersion);
      }
      catch (err) {
        status = 0;
      }

      if (status <= 0) {
        try {
          Android.logout();
        }
        catch (err) {
          window.location.href = LOGOUT_URL;
          console.log('The native context does not exist yet', {
            class: "nativeApi",
            func: "showErrorMessage",
            exception: err
          });
        }
      }
      else {
        window.location.href = LOGOUT_URL;
      }
    }
  }


  setLogMessage (msg){
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        var date = new Date().toString();
        var fullMsg = date + " " + msg;
        try {
            webkit.messageHandlers.setLogMessage.postMessage(fullMsg);
        } catch(err) {
            console.log("The native context does not exist yet", {class:"nativeApi" ,func:"setLogMessage", exception: err});
        }
    }
}
  openQRScanner () {
    this.nativeApiDispatcher.openQRCodeScanner();
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      //support iOS 8 and above version
      try {
        webkit.messageHandlers.qrCodeReader.postMessage(true);
      } catch (err) {
        console.log("The native context does not exist yet", { class: "nativeApi", func: "openQRScanner", exception: err });
      }
    }
    else if (navigator.userAgent.match(/Android/i)) {
      try {
        Android.openQRScanner();
      }
      catch (err) {
        console.log("The native context does not exist yet", { class: "nativeApi", func: "opernQRScanner", exception: err });
      }
    }
  }

  startPing(period, times) {
    var pingExpireTime = 0;  //utt.getEntity().pingExpire; //TODO :
    if (pingExpireTime) {
      pingExpireTime = 15;
    }

    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      //support iOS 8 and above version
      try {
        //disable all communications
        window['ajaxEnabled'] = false;
        var message = { "period": period, "times": times, "pingExpire": pingExpireTime };
        webkit.messageHandlers.startPing.postMessage(message);
      } catch (err) {
        console.log('The native context does not exist yet', { class: "nativeApi", func: "startPing", exception: err });
      }
    } else {
      var nativeAndroidVersion = "1.0.0.2";
      var status = 0;
      var nativeAppVersion = 0;
      try {
        nativeAppVersion = Android.getNativeAppVersion();

      }
      catch (err) {
      }
      if (navigator.userAgent.match(/Android/i)) {
        status = this.util.compareVersions(nativeAndroidVersion, nativeAppVersion);
      }

      if (status > 0) {
        try {
          //disable all communications
          window['ajaxEnabled'] = false;
          /**
           * To work consistently over backward compatibility and fine tuning on paramters
           * function will accept object for ping
           * @param pingObj
           */
          var pingObj = { "pingDelay": period, "pingCounter": times, "pingDuration": pingExpireTime };
          Android.startPing(JSON.stringify(pingObj));
        }
        catch (err) {
          console.log('The native context does not exist yet', { class: "nativeApi", func: "startPing", exception: err });
        }
      }
      else {
        try {
          //disable all communications
          window['ajaxEnabled'] = false;
          Android.startPing(period, times);
        }
        catch (err) {
          console.log('The native context does not exist yet', { class: "nativeApi", func: "startPing", exception: err });
        }
      }
    }
  }
}

window['searchQRCode'] = (qrCode) => {
  nativeApiService.nativeApiSupport.updateQRCode(qrCode);
}

window['closeQRReadings'] = () => {
  nativeApiService.nativeApiSupport.closeQRCodeScanner();
}

window['updateAppFromBackgroundFromNative'] = () => {

}

