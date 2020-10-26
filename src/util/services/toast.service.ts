import { Injectable, EventEmitter, Output, Directive } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage, STORAGE_SUB_KEY } from '../local-storage';

@Directive()
@Injectable()
export class ToastService {
  @Output() msgBoxOpen: EventEmitter<any> = new EventEmitter();
  private localStorage: LocalStorage;
  isAutoClose : boolean;
  

  private toastrOptions: Object = {
    positionClass: 'centered',
    messageClass: 'qm-toast__message',
    easing: 'ease-in-out',
    closeButton: true,
    autoDismiss: true,
    timeOut: 0,
    tapToDismiss: false,
    disableTimeOut: true,
    toastType: 'info'
  };

  private successOptions: Object = {
    ...this.toastrOptions,
    enableHtml: true,
    toastClass: 'toast qm-toast qm-toast--success'
  };

  private infoOptions: Object = {
    ...this.toastrOptions,
    toastType: 'info',
    enableHtml: true,
    toastClass: 'toast qm-toast qm-toast--info'
  };

  private errorOptions: Object = {
    ...this.toastrOptions,
    enableHtml: true,
    toastType: 'error',

    toastClass: 'toast qm-toast qm-toast--danger'
  };

  private infiniteOptions: Object = {
    ...this.toastrOptions,
    toastClass: 'toast qm-toast qm-toast--danger',
    closeButton: false,
    tapToDismiss: false,
    disableTimeOut: true,
    toastType: 'error'
  };

  private stickyToastOptions: Object = {
    ...this.toastrOptions,
    toastClass: 'toast qm-toast qm-toast--danger',
    closeButton: true,
    tapToDismiss: false,
    disableTimeOut: true,
    toastType: 'error'

  };

  private htmlSuccessOptions: Object = {
    ...this.toastrOptions,
    toastClass: 'toast qm-toast qm-toast--success',
    enableHtml: true,
    toastType: 'info'
  };

  setToastContainer(toastContainer) {
    this.toastrService.overlayContainer = toastContainer;
    // following code added to bug fix route not appearing issue when routes changed in toast library
    // this.toastrService['overlay']['_paneElements'] = {};
  }

  successToast(text: string) {
    // console.log(this.isAutoClose);
    // 
    setTimeout(() => {
      document.getElementsByClassName("toast-close-button")[0].setAttribute("id", "close-toast-btn");
     document.getElementById("close-toast-btn").focus();      
     },500);
    return this.toastrService.success(text, '', this.successOptions);
  }

  infoToast(text: string) {
    setTimeout(() => {
     document.getElementsByClassName("toast-close-button")[0].setAttribute("id", "close-toast-btn");
    document.getElementById("close-toast-btn").focus();      
    },500);
    return this.toastrService.success(text, '', this.infoOptions);
  }

  errorToast(text: string) {
    setTimeout(() => {
      document.getElementsByClassName("toast-close-button")[0].setAttribute("id", "close-toast-btn");
     document.getElementById("close-toast-btn").focus();      
     },500);
    this.toastrService.error(text, '', this.errorOptions);
  }

  htmlSuccessToast(text: string) {
    this.toastrService.success(text, '', this.htmlSuccessOptions);
  }

  // Create toast that does not expire
  infiniteToast(text: string) {
    this.toastrService.error(text, '', this.infiniteOptions);
  }


  // Create toast that does not expire
  stickyToast(text: string) {
    this.toastrService.error(text, '', this.stickyToastOptions);
  }


  clearToasts() {

    this.toastrService.toasts
      .map(toast => this.toastrService.clear(toast.toastId));
  }

  constructor(private toastrService: ToastrService) { 
   
  }
 
}
