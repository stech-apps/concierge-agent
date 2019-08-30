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
import { Observable, Subscription } from 'rxjs';
import { UserSelectors } from 'src/store';
import { AutoCloseStatusDispatchers, AutoCloseStatusSelectors } from 'src/store/services/autoclose-status';

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
  AutoCloseTimer = null;
  userDirection$: Observable<string>;
  userDirection:string;
  skipBranchFocus: boolean;
  skipButtonHover: boolean;
  mousePressed: boolean;
  private subscriptions: Subscription = new Subscription();
  
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    private localStorage: LocalStorage,
    public domSanitizer: DomSanitizer,
    private userSelectors: UserSelectors,
    private toastStatusDispatchers: AutoCloseStatusDispatchers,
    private toastStatusSelectors: AutoCloseStatusSelectors
  ) {
    super(toastrService, toastPackage);
  }

  action(event: Event) {
    event.stopPropagation();
    this.toastPackage.triggerAction();
    return false;
  }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
    this.iconSvg =  this.domSanitizer.bypassSecurityTrustHtml(this.iconSvg);
    this.isAutoClose = this.localStorage.getSettingForKey(STORAGE_SUB_KEY.TOAST_AUTOCLOSE);
    this.toastStatusDispatchers.setToastStatus(this.isAutoClose);
    const ToastStatusSubscription = this.toastStatusSelectors.ToastStatus$.subscribe(ts=> {
      this.isAutoClose = ts;
      this.SetAutoclose();
      
    })
    this.subscriptions.add(ToastStatusSubscription);
    // this.SetAutoclose()
    setTimeout(() => {
      document.getElementById('toast-msg-close').focus();
    }, 100);
  }
  
  onSwitchChange(){
    this.toastStatusDispatchers.setToastStatus(this.isAutoClose);
    this.localStorage.setSettings(STORAGE_SUB_KEY.TOAST_AUTOCLOSE, this.isAutoClose);    
    // this.SetAutoclose();
  }
  
  SetAutoclose() {
    if(this.isAutoClose) {
      this.AutoCloseTimer = setTimeout(() => {
        this.remove();
      }, 5000);
    } else {
      clearTimeout(this.AutoCloseTimer);
      
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
