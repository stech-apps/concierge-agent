import { QmClearInputDirective } from './../../../directives/qm-clear-input.directive';
import { DEBOUNCE_TIME } from './../../../../constants/config';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { QmModalService } from './../qm-modal/qm-modal.service';
import { Observable, Subject } from 'rxjs';
import { ICalendarBranchViewModel } from './../../../../models/ICalendarBranchViewModel';
import { Subscription } from 'rxjs';
import { Component, OnInit, EventEmitter, Output, OnDestroy, Input, ViewChild } from '@angular/core';
import { CalendarBranchSelectors, CalendarBranchDispatchers, UserSelectors, BranchSelectors, TimeslotDispatchers, ReserveDispatchers } from 'src/store';
import { ICalendarBranch } from 'src/models/ICalendarBranch';
import { LocalStorage, STORAGE_SUB_KEY } from '../../../../util/local-storage';

@Component({
  selector: 'qm-select-branch',
  templateUrl: './qm-select-branch.component.html',
  styleUrls: ['./qm-select-branch.component.scss']
})
export class QmSelectBranchComponent implements OnInit, OnDestroy {

  calendarBranches: ICalendarBranchViewModel[] = new Array<ICalendarBranchViewModel>();
  private subscriptions: Subscription = new Subscription();
  currentBranch: ICalendarBranch = new ICalendarBranch();
  inputChanged: Subject<string> = new Subject<string>();
  filterText: string = '';
  isFlowSkip: boolean = true;
  searchText: string = '';
  userDirection$: Observable<string>;

  @ViewChild(QmClearInputDirective) clearInputDirective: QmClearInputDirective;

  private _isVisible: boolean;

  @Input() set isVisible(value: boolean) {
    this._isVisible = value;

    if (value) {
      this.onFlowStepActivated();
    }
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  @Output()
  onFlowNext: EventEmitter<any> = new EventEmitter();

  constructor(private userSelectors: UserSelectors, private calendarBranchSelectors: CalendarBranchSelectors,
    private calendarBranchDispatchers: CalendarBranchDispatchers, private qmModalService: QmModalService,
    private branchSelectors: BranchSelectors,
    private localStorage: LocalStorage,
    private timeSlotDispatchers: TimeslotDispatchers,
    private reserveDispatcher: ReserveDispatchers
  ) {

    this.isFlowSkip = localStorage.getSettingForKey(STORAGE_SUB_KEY.BRANCH_SKIP);

    if (this.isFlowSkip === undefined) {
      this.isFlowSkip = true;
    }

    const calendarBranchSubscription = this.calendarBranchSelectors.branches$.subscribe((bs) => {
      this.calendarBranches = <Array<ICalendarBranchViewModel>>bs;

      this.branchSelectors.selectedBranch$.subscribe((spBranch) => {
        //if flow is skipped then use the service point branch as current branch
        if (this.isFlowSkip) {
          this.calendarBranches.forEach((cb) => {
            if (spBranch.id === cb.qpId) {
              this.currentBranch = cb;
              this.calendarBranchDispatchers.selectCalendarBranch(cb);
            }
          });
        }
      });
    });


    this.subscriptions.add(calendarBranchSubscription);

    this.userDirection$ = this.userSelectors.userDirection$;
    this.inputChanged
      .pipe(distinctUntilChanged(), debounceTime(DEBOUNCE_TIME || 0))
      .subscribe(text => this.filterBranches(text));
  }

  onToggleBranchSelection(branch: ICalendarBranchViewModel) {
    if (this.currentBranch.id && this.currentBranch.id != branch.id) {
      this.qmModalService.openForTransKeys('', 'msg_confirm_branch_selection', 'yes', 'no', (v) => {
        if (v) {
          this.calendarBranchDispatchers.selectCalendarBranch(branch);
          this.timeSlotDispatchers.deselectTimeslot();
          this.currentBranch = branch;
          this.goToNext();
        }
      }, () => { });
    }
    else if (!this.currentBranch.id) {
      this.timeSlotDispatchers.deselectTimeslot();
      this.currentBranch = branch;
      this.calendarBranchDispatchers.selectCalendarBranch(branch);
      this.goToNext();
    }
  }

  getBranchCount() {
    
  }

  ngOnInit() {

  }

  deselectBranch() {
       this.calendarBranchDispatchers.selectCalendarBranch({} as ICalendarBranch);
      this.currentBranch = {} as ICalendarBranch;
  }

  onFlowStepActivated() {
    this.searchText = '';
    this.filterText = '';
    if (this.clearInputDirective) {
      this.clearInputDirective.updateButtonVisibility('');
    }
  }

  goToNext() {
    this.timeSlotDispatchers.resetTimeslots();
    this.reserveDispatcher.resetReserveAppointment();
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

  onSwitchChange() {
    this.localStorage.setSettings(STORAGE_SUB_KEY.BRANCH_SKIP, this.isFlowSkip);
  }
}
