import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoClose } from 'src/util/services/autoclose.service';

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

  constructor(
    private activeModal: NgbActiveModal,
    private autoCloseService: AutoClose
  ) {}

  ngOnInit() {}

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
}

