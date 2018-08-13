import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";
import { Subscription } from 'rxjs';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { QmCheckoutViewConfirmModalComponent } from "./qm-checkout-view-confirm-modal.component";

@Injectable()
export class QmCheckoutViewConfirmModalService {
  constructor(
    private modalService: NgbModal,
    private translate: TranslateService
  ) {
    
  }

  private open(
    title: string,
    isEmailEnabled:boolean,
    isSmsEnabled:boolean,
    themeColor:string,
    btnOkText: string,
    btnCancelText: string,
  ): Promise<boolean> {
    const modalRef = this.modalService.open(QmCheckoutViewConfirmModalComponent, {
      centered: true,
      backdrop : 'static',
      keyboard : false
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.themeColor = themeColor;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.isEmailEnabled = isEmailEnabled;
    modalRef.componentInstance.isSmsEnabled = isSmsEnabled;
    return modalRef.result;
  }

  public openForTransKeys(
    titleKey: string,
    isEmailEnabled:boolean,
    isSmsEnabled:boolean,
    themeColor:string,
    btnOkTextKey: string,
    btnCancelTextKey: string,
    confirmCallback: (result: boolean) => void,
    errorCallback: (err: Object) => void,
    interpolatedKeys: Object = null
  ): Subscription {
    return this.translate
      .get([titleKey, btnOkTextKey, btnCancelTextKey], interpolatedKeys)
      .subscribe(translations => {
        this.open(
          translations[titleKey],  
           isEmailEnabled,
          isSmsEnabled,
          themeColor,
          translations[btnOkTextKey],
          translations[btnCancelTextKey],
       
        )
          .then(confirmed => {
            confirmCallback(confirmed);
          })
          .catch(err => {
            errorCallback(err);
          });
      });
  }
}
