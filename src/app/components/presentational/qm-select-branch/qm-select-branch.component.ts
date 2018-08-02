import { QmModalService } from './../qm-modal/qm-modal.service';
import { Observable } from 'rxjs';
import { IBranchViewModel } from './../../../../models/IBranchViewModel';
import { Subscription } from 'rxjs';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { BranchSelectors, BranchDispatchers } from 'src/store';
import { IBranch } from 'src/models/IBranch';

@Component({
  selector: 'qm-select-branch',
  templateUrl: './qm-select-branch.component.html',
  styleUrls: ['./qm-select-branch.component.scss']
})
export class QmSelectBranchComponent implements OnInit, OnDestroy {

  branches: IBranchViewModel[] = new Array<IBranchViewModel>();
  private subscriptions: Subscription = new Subscription();
  private selectedBranch: IBranch = new IBranch();

  constructor(private branchSelectors: BranchSelectors, private branchDispatchers: BranchDispatchers, private qmModalService: QmModalService) {

    const branchSubscription = this.branchSelectors.branches$.subscribe((bs) => {
      this.branches = <Array<IBranchViewModel>>bs;

      const selectedBranchSub = this.branchSelectors.selectedBranch$.subscribe((sb) => {

        this.selectedBranch = sb;
        this.branches.forEach((b) => {
          if (b.id === sb.id) {
            b.selected = true;
          }
          else {
            b.selected = false;
          }
        });
      });

      this.subscriptions.add(selectedBranchSub);
    });

    this.subscriptions.add(branchSubscription);
  }

  @Output()
  onFlowNext: EventEmitter<any> = new EventEmitter();


  onToggleBranchSelection(branch: IBranchViewModel) {
    if (this.selectedBranch.id != branch.id) {
      this.qmModalService.openForTransKeys('', 'msg_confirm_branch_selection', 'yes', 'no', (v) => {
        if(v) {
          this.branchDispatchers.selectBranch(branch);
        }
      }, ()=> {});
    }
    else {
      this.branchDispatchers.selectBranch(branch);
    }
  }

  ngOnInit() {

  }

  goToNext() {
    this.onFlowNext.emit();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  doneButtonClick() {
    this.onFlowNext.emit();
  }
}
