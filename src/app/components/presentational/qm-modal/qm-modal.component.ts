import { AutoClose } from './../../../../util/services/autoclose.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { UserSelectors } from './../../../../store/services/user/user.selectors';

@Component({
  selector: 'qm-modal',
  templateUrl: './qm-modal.component.html',
  styleUrls: ['./qm-modal.component.scss']
})
export class QmModalComponent implements OnInit {
  title: string;
  message: string;
  btnOkText: string;
  btnCancelText: string;
  userDirection$: Observable<string>;

  constructor(
    private activeModal: NgbActiveModal,
    private autoCloseService: AutoClose,
    private userSelectors: UserSelectors
  ) {}

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
    setTimeout(() => {
      if (document.getElementById('qm-modal-message')) {
        document.getElementById('qm-modal-message').focus();
      }
    }, 100);
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  public closeX() {
    this.activeModal.close(false);
  }
}
