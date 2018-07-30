import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'qm-select-branch',
  templateUrl: './qm-select-branch.component.html',
  styleUrls: ['./qm-select-branch.component.scss']
})
export class QmSelectBranchComponent implements OnInit {

  constructor() { }

  onResultChange:  EventEmitter<any> = new EventEmitter();

  @Output()
  onFlowNext:  EventEmitter<any> = new EventEmitter();
  

  ngOnInit() {
    setTimeout(()=> {
      this.onResultChange.emit('Selected Branch');
    }, 1000);
  }

  goToNext() {
    this.onFlowNext.emit();
  }
}
