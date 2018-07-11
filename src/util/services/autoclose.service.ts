import { Injectable } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Injectable()
export class AutoClose {
  private autoCloseTimeInSeconds = 0;
  private currentAutoCloseTime = 0;
  private autoCloseInterval = null;
  constructor(
    
  ) {
    // this.settingsMap$ = this.settingsAdminSelectors.settingsAsMap$;
    // const settingsSubscription = this.settingsMap$.subscribe(
    //   (settingsMap: { [name: string]: Setting }) => {
    //     this.autoCloseTimeInSeconds = parseInt(
    //       settingsMap['AutoClosetime']['value'],
    //       10
    //     );

    //     this.currentAutoCloseTime = this.autoCloseTimeInSeconds;
    //     if (this.autoCloseInterval) {
    //       clearInterval(this.autoCloseInterval);
    //     }
    //     this.autoCloseInterval = setInterval(() => {
    //       if (this.currentAutoCloseTime === 0) {
    //         clearInterval(this.autoCloseInterval);
    //         this.onAutoCloseTimeExpired();
    //       } else {
    //         // console.log(this.currentAutoCloseTime);
    //         this.currentAutoCloseTime -= 1;
    //       }
    //     }, 1000);
    //   }
    // );
  }

  onAutoCloseTimeExpired() {
    //this.logoutService.logout();
  }

  refreshAutoClose() {
    if (this.currentAutoCloseTime > 0) {
      this.currentAutoCloseTime = this.autoCloseTimeInSeconds;
    }
  }
}
