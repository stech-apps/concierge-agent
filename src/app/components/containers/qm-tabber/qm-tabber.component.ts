import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef
} from "@angular/core";

import * as $ from 'jquery';

@Component({
  selector: "qm-tabber",
  templateUrl: "./qm-tabber.component.html",
  styleUrls: ["./qm-tabber.component.scss"]
})
export class QmTabberComponent implements OnInit, OnDestroy {
  @HostListener("window:keydown", ["$event"])
  onKeyUp(ev: KeyboardEvent) {
    this.tabTriggerFunc(ev);
  }

  constructor(private tabber: ElementRef) {}

  ngOnInit() {}

  ngOnDestroy() {}

  tabTriggerFunc = e => {
    let elem;
    if (e.keyCode == 9) {
      if (e.shiftKey) {
        // Backward
        elem = this.getPrevTabbaleElement();
      } else {
        // Forward
        elem = this.getNextTabbaleElement();
      }

      if ($(elem).hasClass("qm-tab-click")) {
        $(elem).trigger("click");
      } else {
        $(elem).focus();
      }

      e.preventDefault();
      e.stopPropagation();
    }
  };

  getNextTabbaleElement = () => {
    let focusableElements = $(this.tabber.nativeElement).find(
      ".qm-tab"
    );  

    let focusableItemCount = focusableElements.length;

    if (document.activeElement) {
      let index = focusableElements.index(document.activeElement);
      if (index == -1 || index == focusableItemCount - 1) {
        return focusableElements[0];
      } else {
        return focusableElements[index + 1];
      }
    } else {
      return focusableElements[0];
    }
  };

  getPrevTabbaleElement = () => {
    let focusableElements = $(this.tabber.nativeElement).find(
      ".qm-tab"
    );

    let focusableItemCount = focusableElements.length;

    if (document.activeElement) {
      let index = focusableElements.index(document.activeElement);
      if (index == -1 || index == 0) {
        return focusableElements[focusableItemCount - 1];
      } else {
        return focusableElements[index - 1];
      }
    } else {
      return focusableElements[focusableItemCount - 1];
    }
  };

  tabFilterFunc = (i, item) => {};
}
