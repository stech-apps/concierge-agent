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

  // constructor is only necessary when not using AoT
  iconSvg : any =  INFO_SVG;

  
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
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
    setTimeout(() => {
      document.getElementById('toast-msg-close').focus();
    }, 1000);
  } 
}
