import { IPlatform } from './../../models/IPlatform';
import { Injectable } from '@angular/core';
import { LOGOUT_URL } from '../url-helper';
import { Util } from '../util';
declare var Android: any;
declare var webkit: any;

@Injectable({
  providedIn: 'root'
})
export class NativeApiService {

  constructor(
    private util : Util
  ) {
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
    if(navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)){
      return true;
    }
    else{
      return false;
    }
  }

  getUserAgent(): string {
    return navigator.userAgent;
  }

  getPlatform(): IPlatform {
    return {
        isMobile : this.isNativeBrowser(),
        userAgent: navigator.userAgent
    };
  }

  logOut(){
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      //support iOS 8 and above version
      try {
          webkit.messageHandlers.userLogout.postMessage(true);
      } catch(err) {
          console.log("The native context does not exist yet", {class:"nativeApi" ,func:"logout", exception: err});
      }
    }
    else if (navigator.userAgent.match(/Android/i)){
      var nativeAndroidVersion = "1.0.0.1";
      var nativeAppVersion = "0.0.0.0";
      try {
          nativeAppVersion = Android.getNativeAppVersion();
      }
      catch(err) {
          nativeAppVersion = "0.0.0.0";
      }

      var status = 0;
      try {
          status = this.util.compareVersions(nativeAndroidVersion, nativeAppVersion);
      }
      catch(err) {
          status = 0;
      }

      if(status >= 0) {
          try {
              Android.logout();
          }
          catch (err) {
            window.location.href =  LOGOUT_URL;
              console.log('The native context does not exist yet', {
                  class: "nativeApi",
                  func: "showErrorMessage",
                  exception: err
              });
          }
      }
      else {
        window.location.href =  LOGOUT_URL;
      }
    }
  }

}
