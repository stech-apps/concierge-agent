import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";
import { Subscription } from 'rxjs';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { QmNotesModalComponent } from "./qm-notes-modal.component";

@Injectable()
export class QmNotesModalService {
  constructor(
    private modalService: NgbModal,
    private translate: TranslateService
  ) {
    
  }

  private open(
    text: string,
    themeColor:string,
    btnOkText: string,
    btnCancelText: string,
  ): Promise<boolean> {
    const modalRef = this.modalService.open(QmNotesModalComponent, {
      centered: true,
      backdrop : 'static',
      keyboard : false,
      windowClass : "NoteModalClass"
    });
    modalRef.componentInstance.text = text;
    modalRef.componentInstance.themeColor = themeColor;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

  public openForTransKeys(
    text: string,
    themeColor:string,
    btnOkTextKey: string,
    btnCancelTextKey: string,
    confirmCallback: (result: boolean) => void,
    errorCallback: (err: Object) => void,
    interpolatedKeys: Object = null
  ): Subscription {
    return this.translate
      .get([ btnOkTextKey, btnCancelTextKey], interpolatedKeys)
      .subscribe(translations => {
        this.open(
          text,  
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
