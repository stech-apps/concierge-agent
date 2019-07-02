import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ToastPackage, ToastrService, Toast } from 'ngx-toastr';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { INFO_SVG } from 'src/svgs/info-icon';
import { LocalStorage, STORAGE_SUB_KEY } from '../../../../util/local-storage';

@Component({
  selector: 'qm-qm-custom-toast',
  templateUrl: './qm-custom-toast.component.html',
  animations: [
    trigger('flyInOut', [
      state('inactive', style({
        display: 'none',
        opacity: 0
      })),
      transition('inactive => active', animate('400ms ease-out', keyframes([
        style({
          opacity: 0,
        }),
        style({
          opacity: 1,
        })
      ]))),
      transition('active => removed', animate('400ms ease-out', keyframes([
        style({
          opacity: 1,
        }),
      ]))),
    ]),
  ],
  styleUrls: ['./qm-custom-toast.component.scss']
})
export class QmCustomToastComponent extends Toast {

  iconSvg : any =  INFO_SVG;
  isAutoClose: boolean;
  
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    private localStorage: LocalStorage,
    public domSanitizer: DomSanitizer
  ) {
    super(toastrService, toastPackage);
  }

  action(event: Event) {
    event.stopPropagation();
    this.toastPackage.triggerAction();
    return false;
  }

  ngOnInit() {
    this.iconSvg =  this.domSanitizer.bypassSecurityTrustHtml(this.iconSvg);
    this.isAutoClose = this.localStorage.getSettingForKey(STORAGE_SUB_KEY.TOAST_AUTOCLOSE);
    setTimeout(() => {
      document.getElementById('toast-msg-close').focus();
    }, 1000);
  }
  
  onSwitchChange(){
    this.localStorage.setSettings(STORAGE_SUB_KEY.TOAST_AUTOCLOSE, this.isAutoClose);    
  }

}
