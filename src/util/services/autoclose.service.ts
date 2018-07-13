import { Injectable } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServicePointSelectors } from 'src/store/services';
import { Logout } from 'src/util/services/logout.service';


@Injectable()
export class AutoClose {
  private autoCloseTimeInSeconds = 0;
  private currentAutoCloseTime = 0;
  private autoCloseInterval = null;
  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private logoutService: Logout
  ) {
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params === null || params === undefined){
        this.stopAutoCloseTime();
        return
      }
      this.autoCloseTimeInSeconds = params.autoClose;

      this.currentAutoCloseTime = this.autoCloseTimeInSeconds;
      if (this.autoCloseInterval) {
        clearInterval(this.autoCloseInterval);
      }
      this.autoCloseInterval = setInterval(() => {
        if (this.currentAutoCloseTime === 0) {
          clearInterval(this.autoCloseInterval);
          this.onAutoCloseTimeExpired();
        } else {
          this.currentAutoCloseTime -= 1;
        }
      }, 1000);
    });
  }

  onAutoCloseTimeExpired() {
    this.logoutService.logout(true);
  }

  stopAutoCloseTime(){
    if (this.autoCloseInterval) {
      clearInterval(this.autoCloseInterval);
    }
  }

  refreshAutoClose() {
    if (this.currentAutoCloseTime > 0) {
      this.currentAutoCloseTime = this.autoCloseTimeInSeconds;
    }
  }
}
