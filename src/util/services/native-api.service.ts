import { Injectable } from '@angular/core';
declare var Android: any;
declare var webkit: any;

@Injectable({
  providedIn: 'root'
})
export class NativeApiService {

  constructor() {
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
}
