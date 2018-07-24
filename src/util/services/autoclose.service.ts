import { Injectable } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServicePointSelectors } from 'src/store/services';
import { Logout } from 'src/util/services/logout.service';


@Injectable()
export class AutoClose {
  private autoCloseTimeInSeconds = 0;
  private autoCloseInterval = null;
  constructor(
    private servicePointSelectors: ServicePointSelectors,
    private logoutService: Logout
  ) {
    const servicePointsSubscription = this.servicePointSelectors.uttParameters$.subscribe((params) => {
      if(params !== null && params !== undefined){
        this.autoCloseTimeInSeconds = params.autoClose;
        this.setAutoClose();
      }
    });
  }

  setAutoClose(){
    if (this.autoCloseInterval) {
      clearTimeout(this.autoCloseInterval);
    }
    this.autoCloseInterval = setTimeout(() => {
      this.onAutoCloseTimeExpired();
    }, (this.autoCloseTimeInSeconds * 1000));
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
    if(this.autoCloseInterval){
      this.setAutoClose();
    }
  }
}
