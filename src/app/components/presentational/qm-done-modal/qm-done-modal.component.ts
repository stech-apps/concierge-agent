import { Observable } from 'rxjs';
import { UserSelectors } from 'src/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qm-done-modal',
  templateUrl: './qm-done-modal.component.html',
  styleUrls: ['./qm-done-modal.component.scss']
})
export class QmDoneModalComponent implements OnInit {

  heading: string = '';
  subHeading: string = '';
  fieldList: Array<{icon: string, label: string}> = [];

  userDirection$: Observable<string>

  constructor(public activeModal: NgbActiveModal, private userSelectors: UserSelectors) { }

  ngOnInit() {
    this.userDirection$ = this.userSelectors.userDirection$;
  }
}
