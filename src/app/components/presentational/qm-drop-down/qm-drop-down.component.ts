import { Observable } from "rxjs";
import { IDropDownItem } from "./../../../../models/IDropDownItem";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
  SimpleChanges
} from "@angular/core";
import { UserSelectors } from "src/store";
import { QmClearInputDirective } from "src/app/directives/qm-clear-input.directive";

@Component({
  selector: "qm-drop-down",
  templateUrl: "./qm-drop-down.component.html",
  styleUrls: ["./qm-drop-down.component.scss"]
})
export class QmDropDownComponent implements OnInit {
  @ViewChild("dropdownContent") dropDownContent: ElementRef;
  @ViewChild("qmClearInputRef") qmClearInputRef: QmClearInputDirective;

  @ViewChild("searchInput") searchInput: ElementRef;
  @HostListener("window:keydown", ["$event"])
  onKeyUp(ev: KeyboardEvent) {
    this.triggerKeyPress(ev);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["items"]) {
      let preselectedItem = this.items.find(
        i => i[this.labelProperty] === this.caption
      );
      if (preselectedItem) {
        this.highlightedItemId = preselectedItem.id;
        this.selectedItem = preselectedItem;
      }
    }
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

  highlightedItemId: number;

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
    setTimeout(()=> this.searchText = '');
    this.qmClearInputRef.update(this.searchText);
    $event.stopPropagation();
            if(this.searchInput) {
              setTimeout(() => this.searchInput.nativeElement.focus());
            }
  }

  itemClick(item: IDropDownItem | any, $event) {
    this.itemClickCallBack.emit(item);
    this.isExpanded = false;
    if($event) {
      $event.stopPropagation();
    }
    this.isItemSelected = true;
    this.selectedItem = item;
    this.highlightedItemId = item.id;
  }

  handleInput(searchText: string) {}

  clickOnSearch($event) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  triggerKeyPress(e: KeyboardEvent) {
    if (this.isExpanded) {
      let currentIndex = this.items.findIndex(
        x => x.id === this.highlightedItemId
      );

      switch (e.keyCode) {
        case 38: // up
          let prevItem = this.items[--currentIndex];

          if (prevItem) {
            this.highlightedItemId = prevItem.id;
          }
          break;
        case 40: // down
          let nextItem = this.items[++currentIndex];

          if (nextItem) {
            this.highlightedItemId = nextItem.id;
          }

          break;
        case 13: // enter
              this.itemClick(this.items[currentIndex], null);
          break;
      }
    }
  }
  getIdofInputBox(searchPlaceHolder) {
    return searchPlaceHolder.replace(/\s/g, '').toLowerCase()
  }
}
