import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { QmInputboxComponent } from '../../app/components/presentational/qm-inputbox/qm-inputbox.component';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputBoxService {

  constructor(
    private modalService:NgbModal,
    private translate:TranslateService
  ) { }

  public open(
    title: string,
   
    inputboxNames:string[][],
    btnOkText: string,
    btnCancelText: string

  ): Promise<boolean> {
    const modalRef = this.modalService.open(QmInputboxComponent, {
      centered: true
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.inputBoxNames  = inputboxNames;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

  public openWithCallbacks(
    title: string,
    inputboxNames:string[][],
    btnOkText: string,
    btnCancelText: string,
    confirmCallback: (result: boolean) => void,
    errorCallback: (err: Object) => void
  ) {
    this.open(title,inputboxNames, btnOkText, btnCancelText)
      .then(confirmed => {
        confirmCallback(confirmed);
        // console.log(inputboxNames);
      })
      .catch(err => {
        errorCallback(err);
      });
  }

  public openForTransKeys(
    titleKey: string,
    messageKey: string,
    btnOkTextKey: string,
    btnCancelTextKey: string,
    confirmCallback: (result: boolean) => void,
    errorCallback: (err: Object) => void,
    interpolatedKeys: Object = null
  ): Subscription {
    return this.translate
      .get([titleKey, messageKey, btnOkTextKey, btnCancelTextKey], interpolatedKeys)
      .subscribe(translations => {
        this.open(
          translations[titleKey],
          translations[messageKey],
          translations[btnOkTextKey],
          translations[btnCancelTextKey]
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
