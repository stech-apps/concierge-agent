import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceStateService {

  private maxNumberOfTries = undefined; //value was 2 in prior implementation for 3 retries. Now undefined to continue retry indefinitely.
  private currentTry = 0;
  private isServiceInProgress = false;

  constructor() { }

  getMaxNumberOfTries() {
    return this.maxNumberOfTries;
  }

  getCurrentTry() {
    return this.currentTry;
  }

  incrementTry() {
    this.currentTry++;
  }

  resetTryCounter() {
    this.currentTry = 0;
  }

  isActive() {
    return this.isServiceInProgress;
  }

  setActive(bool) {
    this.isServiceInProgress = bool;
  }
}
