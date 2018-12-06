import { Observable } from "rxjs";
import { IDropDownItem } from "./../../../../models/IDropDownItem";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { UserSelectors } from "src/store";

@Component({
  selector: "qm-drop-down",
  templateUrl: "./qm-drop-down.component.html",
  styleUrls: ["./qm-drop-down.component.scss"]
})
export class QmDropDownComponent implements OnInit {
  @ViewChild("dropdownContent") dropDownContent: ElementRef;
  @ViewChild("searchInput") searchInput: ElementRef;

  ngAfterViewInit() {
    
  }

  isExpanded = false;
  userDirection$: Observable<string>;
  searchText: string;
  selectedItem: any;

  constructor(private userSelectors: UserSelectors) {
    this.userDirection$ = this.userSelectors.userDirection$;
  }

  ngOnInit() {}

  @Input()
  caption: string;

  @Input()
  isItemSelected: boolean;

  @Input()
  searchPlaceHolder: string;

  @Input()
  labelProperty: string = "text";

  @Input()
  items: Array<IDropDownItem | any>;

  @Output("itemClick")
  itemClickCallBack: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onExpand: EventEmitter<any> = new EventEmitter<any>();

  dropDownExpand($event) {
    this.onExpand.emit();
    this.isExpanded = !this.isExpanded;
    $event.stopPropagation();
    setTimeout(() => this.searchInput.nativeElement.focus());
  }

  itemClick(item: IDropDownItem | any, $event) {
    this.itemClickCallBack.emit(item);
    this.isExpanded = false;
    $event.stopPropagation();
    this.isItemSelected = true;
    this.selectedItem = item;
  }

  handleInput(searchText: string) {}

  clickOnSearch($event) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
