import { DEBOUNCE_TIME } from './../../../../constants/config';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { QmModalService } from './../qm-modal/qm-modal.service';
import { Observable, Subject } from 'rxjs';
import { ICalendarBranchViewModel } from './../../../../models/ICalendarBranchViewModel';
import { Subscription } from 'rxjs';
import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { CalendarBranchSelectors, CalendarBranchDispatchers } from 'src/store';
import { ICalendarBranch } from 'src/models/ICalendarBranch';
import { LocalStorage, STORAGE_SUB_KEY } from '../../../../util/local-storage';

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
  isFlowSkip: boolean = true;
  searchText: string = '';

  private _isVisible: boolean;

  @Input() set isVisible(value: boolean) {
    this._isVisible = value;

    if(value) {
      this.onFlowStepActivated();  
   }
 }
 
 get isVisible(): boolean {  
     return this._isVisible;  
 }

  @Output()
  onFlowNext: EventEmitter<any> = new EventEmitter();

  constructor(private branchSelectors: CalendarBranchSelectors, private branchDispatchers: CalendarBranchDispatchers, private qmModalService: QmModalService, private localStorage: LocalStorage) {

    this.isFlowSkip = localStorage.getSettingForKey(STORAGE_SUB_KEY.BRANCH_SKIP);

    const branchSubscription = this.branchSelectors.branches$.subscribe((bs) => {
      this.branches = <Array<ICalendarBranchViewModel>>bs;

      const selectedBranchSub = this.branchSelectors.selectedBranch$.subscribe((sb) => {

        
        this.branches.forEach((b) => {
          if (b.id === sb.id) {
            b.selected = true;
            this.selectedBranch = b;
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

  onToggleBranchSelection(branch: ICalendarBranchViewModel) {
    if (this.selectedBranch['selected'] && this.selectedBranch.id != branch.id) {
      this.qmModalService.openForTransKeys('', 'msg_confirm_branch_selection', 'yes', 'no', (v) => {
        if(v) {
          branch.selected = !branch.selected;
          this.branchDispatchers.selectCalendarBranch(branch);
          this.onFlowNext.emit();
        }
      }, ()=> {});
    }
    else {
      branch.selected = !branch.selected;
      this.branchDispatchers.selectCalendarBranch(branch);
    }
  }

  ngOnInit() {

  }

  onFlowStepActivated() {
    this.searchText = '';
    this.filterText = '';
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

  onSwitchChange(){
    this.localStorage.setSettings(STORAGE_SUB_KEY.BRANCH_SKIP, this.isFlowSkip);
  }
}
