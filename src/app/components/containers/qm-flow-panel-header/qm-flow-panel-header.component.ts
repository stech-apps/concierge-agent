import { Router } from '@angular/router';
import { Component, OnInit, Input, ContentChild, Output } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { QmFlowPanelResult } from 'src/app/components/containers/qm-flow-panel-header/qm-flow-panel-result.directive';
import { QmFlowPanelTitle } from 'src/app/components/containers/qm-flow-panel-header/qm-flow-panel-title.directive';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'qm-flow-panel-header',
  templateUrl: './qm-flow-panel-header.component.html',
  styleUrls: ['./qm-flow-panel-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QmFlowPanelHeaderComponent implements OnInit {

  constructor(private router: Router) { }

  @Output()
  onFlowExit: EventEmitter<any>  = new EventEmitter<any>();

  @ContentChild(QmFlowPanelResult) 
  result: QmFlowPanelResult;

  @ContentChild(QmFlowPanelTitle) 
  title: QmFlowPanelTitle;

  @Input()
  isActive: boolean;

  @Input()
  isShowExitFlow: boolean;

  @Output()
  onActive: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
  }

  clickExit($event) {
    console.log($event);
    $event.stopPropagation();
    this.onFlowExit.emit();
  }
}
