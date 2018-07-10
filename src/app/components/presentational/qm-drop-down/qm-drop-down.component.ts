import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'qm-drop-down',
  templateUrl: './qm-drop-down.component.html',
  styleUrls: ['./qm-drop-down.component.scss']
})
export class QmDropDownComponent implements OnInit {

  @ViewChild('dropdownContent') dropDownContent: ElementRef;
  isExpanded = false;

  constructor() { }

  ngOnInit() {
  }

  @Input()
  caption: string;

  dropDownExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
