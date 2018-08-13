import { QmModalService } from './../../presentational/qm-modal/qm-modal.service';
import { Util } from './../../../../util/util';
import { Router } from '@angular/router';
import { Component, OnInit, ContentChildren, AfterContentInit } from '@angular/core';
import { QmFlowPanelComponent } from 'src/app/components/containers/qm-flow-panel/qm-flow-panel.component';
import { QueryList } from '@angular/core';
import { HostBinding } from '@angular/core';

@Component({
  selector: 'qm-flow',
  templateUrl: './qm-flow.component.html',
  styleUrls: ['./qm-flow.component.scss'],
  host: { 'class': 'qm-flow-component-root animated slideInUp faster' }
})
export class QmFlowComponent implements OnInit, AfterContentInit {

  constructor(private router: Router, private util: Util, private qmModalService: QmModalService) { }

  @HostBinding('class.slideOutDown') exitFlow: boolean = false;

  @ContentChildren(QmFlowPanelComponent)
  flowPanels = new QueryList<QmFlowPanelComponent>();

  ngOnInit() {
  }

  ngAfterContentInit() {
    const firstPanel = this.flowPanels.toArray()[0];
    firstPanel.isShowExitFlow = true;
  }

  panelHeaderClick(flowPanel: QmFlowPanelComponent) {
    let panelFound = false;

    if (flowPanel.isContentVisible) {
      let panelArray = this.flowPanels.toArray();
      let panelIndex = panelArray.indexOf(flowPanel);
      let nextPanel = panelArray[++panelIndex];
      this.onFlowNext(nextPanel);
      return;
    }

    this.flowPanels.forEach(fp => {
      if (fp.id == flowPanel.id) {
        fp.isActive = true;
        fp.isContentVisible = true;
        fp.isHeaderVisible = true;
        panelFound = true;
      }
      else {
        fp.isActive = false;
        //hide the next panels
        if (panelFound) {
          fp.isContentVisible = false;
          fp.isHeaderVisible = false;
        }
      }
    });
  }

  onFlowExit(panel: QmFlowPanelComponent, result: any) {
    if(result){
      this.exitFlow = true;
        setTimeout(() => {
          this.router.navigate(['home']);
        }, 1000);
    }
    else{
      this.qmModalService.openForTransKeys('', 'msg_cancel_task', 'yes', 'no', (result) => {
        if (result) {
          this.exitFlow = true;
          setTimeout(() => {
            this.router.navigate(['home']);
          }, 1000);
        }
      }, () => {
  
      });
    }

  }

  onFlowNext(panel: QmFlowPanelComponent) {
    this.flowPanels.forEach(fp => {
      fp.isActive = false;
      fp.isContentVisible = false;
    });

    panel.isActive = true;
    panel.isContentVisible = true;
    panel.isHeaderVisible = true;
  }
}
