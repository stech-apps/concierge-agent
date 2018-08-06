import { DEBOUNCE_TIME } from './../../../../constants/config';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { QmModalService } from './../qm-modal/qm-modal.service';
import { Observable, Subject } from 'rxjs';
import { ICalendarBranchViewModel } from './../../../../models/ICalendarBranchViewModel';
import { Subscription } from 'rxjs';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { CalendarBranchSelectors, CalendarBranchDispatchers } from 'src/store';
import { ICalendarBranch } from 'src/models/ICalendarBranch';

@Component({
  selector: 'qm-select-branch',
  templateUrl: './qm-select-branch.component.html',
  styleUrls: ['./qm-select-branch.component.scss']
})
export class QmSelectBranchComponent implements OnInit, OnDestroy {

  branches: ICalendarBranchViewModel[] = new Array<ICalendarBranchViewModel>();
  private subscriptions: Subscription = new Subscription();
  selectedBranch: ICalendarBranch = new ICalendarBranch();
  inputChanged: Subject<string> = new Subject<string>();
  filterText: string = '';

  constructor(private branchSelectors: CalendarBranchSelectors, private branchDispatchers: CalendarBranchDispatchers, private qmModalService: QmModalService) {

    const serviceLoadedSubscription = this.branchSelectors.isPublicBranchesLoaded$.subscribe((val) => {
      if(!val){
        this.branchDispatchers.fetchPublicCalendarBranches();
      }
    });
    this.subscriptions.add(serviceLoadedSubscription);

    const branchSubscription = this.branchSelectors.branches$.subscribe((bs) => {
      this.branches = <Array<ICalendarBranchViewModel>>bs;

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

    this.inputChanged
    .pipe(distinctUntilChanged(), debounceTime(DEBOUNCE_TIME || 0))
    .subscribe(text => this.filterBranches(text));
  }

  @Output()
  onFlowNext: EventEmitter<any> = new EventEmitter();


  onToggleBranchSelection(branch: ICalendarBranchViewModel) {
    if (this.selectedBranch.id != branch.id) {
      this.qmModalService.openForTransKeys('', 'msg_confirm_branch_selection', 'yes', 'no', (v) => {
        if(v) {
          this.branchDispatchers.selectCalendarBranch(branch);
          this.onFlowNext.emit();
        }
      }, ()=> {});
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

  handleInput($event) {
    this.inputChanged.next($event.target.value);
  }

  filterBranches(newFilter: string) {    
   this.filterText = newFilter;
  }

  doneButtonClick() {
    this.onFlowNext.emit();
  }
}
