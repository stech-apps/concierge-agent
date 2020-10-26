import { Directive, AfterViewInit, AfterContentInit,
  ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: 'qm-flow-panel-result'
})
export class QmFlowPanelResult implements AfterViewInit {

  result: string;

  constructor(private elt:ElementRef, private renderer:Renderer2) { }

  ngAfterViewInit() {
    var textNode = this.elt.nativeElement.childNodes[0];
    this.result = (textNode || {}).nodeValue;
  }
}
