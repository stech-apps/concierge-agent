import { Observable } from 'rxjs';
import { IDropDownItem } from './../../../../models/IDropDownItem';
import {
  Component, OnInit, Input, ViewChild, ElementRef,
  Output, EventEmitter
} from '@angular/core';
import { UserSelectors } from 'src/store';

@Component({
  selector: 'qm-drop-down',
  templateUrl: './qm-drop-down.component.html',
  styleUrls: ['./qm-drop-down.component.scss']
})
export class QmDropDownComponent implements OnInit {

  @ViewChild('dropdownContent') dropDownContent: ElementRef;
  isExpanded = false;
  userDirection$: Observable<string>;

  constructor(private userSelectors: UserSelectors) {
    this.userDirection$ = this.userSelectors.userDirection$;
  }

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

  @Output()
  onExpand: EventEmitter<any> = new EventEmitter<any>();

  dropDownExpand() {
    this.onExpand.emit();
    this.isExpanded = !this.isExpanded;
  }

  itemClick(item: IDropDownItem | any) {
    this.itemClickCallBack.emit(item);
    this.isExpanded = false;
  }
}
