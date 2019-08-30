import { Observable } from 'rxjs';
import { UserSelectors } from 'src/store';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'qm-qm-addnotes-modal',
  templateUrl: './qm-addnotes-modal.component.html',
  styleUrls: ['./qm-addnotes-modal.component.scss']
})
export class QmAddnotesModalComponent implements OnInit {

  notes: string = '';
  userDirection$: Observable<string>;

  constructor(public activeModal: NgbActiveModal, private userSelectors: UserSelectors) { }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
  setTimeout(() => {
    if(document.getElementById('qm-notes-heading')) {
      document.getElementById('qm-notes-heading').focus();
    }
  }, 100);
  }

  addNotes() {
    this.activeModal.close(this.notes);
  }

  clearNotes() {
    this.notes = '';
  }
}
