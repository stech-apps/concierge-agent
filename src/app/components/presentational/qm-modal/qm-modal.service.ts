import { QmAddnotesModalComponent } from './../qm-addnotes-modal/qm-addnotes-modal.component';
import { TranslateService } from "@ngx-translate/core";
import { Injectable, ApplicationRef } from "@angular/core";
import { Subscription } from 'rxjs';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { QmModalComponent } from "./qm-modal.component";
import { QmDoneModalComponent } from 'src/app/components/presentational/qm-done-modal/qm-done-modal.component';
import { QmTimeFilterComponent } from '../../containers/qm-time-filter/qm-time-filter.component';

@Injectable()
export class QmModalService {

  constructor(
    private modalService: NgbModal,
    private translate: TranslateService,
    private applicationRef: ApplicationRef
  ) {}

  public open(
    title: string,
    message: string,
    btnOkText: string,
    btnCancelText: string
  ): Promise<boolean> {
    const modalRef = this.modalService.open(QmModalComponent, {
      centered: true
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

  public openWithCallbacks(
    title: string,
    message: string,
    btnOkText: string,
    btnCancelText: string,
    confirmCallback: (result: boolean) => void,
    errorCallback: (err: Object) => void
  ) {
    this.open(title, message, btnOkText, btnCancelText)
      .then(confirmed => {
        confirmCallback(confirmed);
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

  openNotesModal(notesText: string) {
    const modal = this.modalService.open(QmAddnotesModalComponent, { centered: true });
    modal.componentInstance.isOnUpdate = true;
    modal.componentInstance.notes = notesText;
    return modal;
  }

  openDoneModal(heading: string, subheading: string, fieldList?: Array<{icon: string, label: string}>,visitId?:string) {
    const modal = this.modalService.open(QmDoneModalComponent, { centered: true });
    modal.componentInstance.fieldList = fieldList;
    modal.componentInstance.heading = heading;
    modal.componentInstance.subHeading = subheading;
    modal.componentInstance.visitID = visitId;
    return modal;
  }

  openTimeFilter(header?: string, subheader?: string, is24HourFormat: boolean = true): any {
    const modal = this.modalService.open(QmTimeFilterComponent, { centered: true,
    windowClass : 'qm-time-filter__modal',
    backdropClass: 'qm-time-filter__backdrop'
  });

    modal.componentInstance.header = header;
    modal.componentInstance.subheader = subheader;
    return modal;
  }
}
