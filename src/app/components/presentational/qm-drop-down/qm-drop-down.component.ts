import { IDropDownItem } from './../../../../models/IDropDownItem';
import { Component, OnInit, Input, ViewChild, ElementRef,
  Output, EventEmitter} from '@angular/core';

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

  @Input()
  labelProperty: string = 'text';

  @Input()
  items: Array<IDropDownItem | any>;

  @Output('itemClick')
  itemClickCallBack: EventEmitter<any> = new EventEmitter<any>();

  dropDownExpand() {
    this.isExpanded = !this.isExpanded;
  }

  itemClick(item: IDropDownItem | any) {
    this.itemClickCallBack.emit(item);
    this.isExpanded  = false;
  }
}
