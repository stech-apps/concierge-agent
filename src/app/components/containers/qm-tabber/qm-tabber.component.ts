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

  previouslyTabbedElement: any;

  constructor(private tabber: ElementRef) {}

  ngOnInit() {}

  ngOnDestroy() {}

  tabTriggerFunc = e => {
    let elem;
    if (e.keyCode == 9) {
    if (e.shiftKey)   {
        // Backward
        elem = this.getPrevTabbaleElement();
      } else {
        // Forward
        elem = this.getNextTabbaleElement();
      }

      console.log(elem);

      if ($(elem).hasClass("qm-tab-click")) {
        $(elem).trigger("click");

        $(elem).focus();  
      } else {
        if($(this.previouslyTabbedElement).hasClass('qm-tab-click')) {
          $(this.previouslyTabbedElement).click();  
        }
        $(elem).focus();
      }
      
      this.previouslyTabbedElement = elem;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  handleTabbingOnElement() {
    
  }

  getNextTabbaleElement = () => {
    let focusableElements = $(this.tabber.nativeElement).find(
      ".qm-tab"
    );  

    let focusableItemCount = focusableElements.length;

    if (document.activeElement) {
      let index = this.previouslyTabbedElement ? focusableElements.index(this.previouslyTabbedElement) : focusableElements.index(document.activeElement);
      console.log('focus index' + index);
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
      let index = this.previouslyTabbedElement ? focusableElements.index(this.previouslyTabbedElement) : focusableElements.index(document.activeElement);
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
