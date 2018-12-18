import { ToastService } from './toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SPService } from '../services/rest/sp.service';
import { UserSelectors } from '../../store/index';
import { VISIT_STATE } from '../q-state';
import { NativeApiService } from '../services/native-api.service'
import { LOGOUT_URL } from '../url-helper';


@Injectable()
export class Logout {
  constructor(
    private spService: SPService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private nativeApi: NativeApiService
  ) {}

  logout(force : boolean) {
    if(force){
      this.initiateLogout(force);
    }
    else{
      this.spService.fetchUserStatus().subscribe((status: any) => {
        if(status !=  null){
          if(status.visitState != null){
              if(status.visitState == VISIT_STATE.CALL_NEXT_TO_QUICK || status.visitState == VISIT_STATE.OK){
                  this.initiateLogout(false);
              }
              else{
                this.translateService.get('no_workstation_set').subscribe(
                  (label) => {
                  this.toastService.infoToast(label);
                  }
                  );
              }
          }
          else{
            this.initiateLogout(false);
          }
      }
      else{
        this.initiateLogout(false);
      }
      })
    }
  }

  initiateLogout(force : boolean){
    this.spService.logout(force).subscribe();

    if(this.nativeApi.isNativeBrowser()){
      this.nativeApi.logOut();
    }
    else{
      window.location.href =  LOGOUT_URL;
    }
  }
}
