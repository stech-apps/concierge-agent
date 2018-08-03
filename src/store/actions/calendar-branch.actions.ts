import { ICalendarBranch } from './../../models/ICalendarBranch';
import { Action } from '@ngrx/store';
import { ICalendarBranchResponse } from '../../models/ICalendarBranchResponse';


// Branch list actions
export const FETCH_CALENDAR_BRANCHES = '[Calendar Branch] FETCH_CALENDAR_BRANCHES';
export const FETCH_CALENDAR_BRANCHES_FAIL = '[Calendar Branch] FETCH_CALENDAR_BRANCHES_FAIL';
export const FETCH_CALENDAR_BRANCHES_SUCCESS = '[Calendar Branch] FETCH_CALENDAR_BRANCHES_SUCCESS';
export const SELECT_CALENDAR_BRANCH = '[Calendar Branch] SELECT_CALENDAR_BRANCH';
export const RESET_CALENDAR_BRANCH = '[Calendar Branch] RESET_CALENDAR_BRANCH';

export class FetchCalendarBranches implements Action {
  readonly type = FETCH_CALENDAR_BRANCHES;
}

export class FetchCalendarBranchesFail implements Action {
  readonly type = FETCH_CALENDAR_BRANCHES_FAIL;
  constructor(public payload: Object) {}
}

export class FetchCalendarBranchesSuccess implements Action {
  readonly type = FETCH_CALENDAR_BRANCHES_SUCCESS;
  constructor(public payload: ICalendarBranchResponse) {}
}

export class SelectCalendarBranch implements Action {
  readonly type = SELECT_CALENDAR_BRANCH;
  constructor(public payload: ICalendarBranch) {}
}

export class ResetCalendarBranch implements Action {
  readonly type = RESET_CALENDAR_BRANCH;
}

export type AllCalendarBranchActions = FetchCalendarBranches |
                               FetchCalendarBranchesFail |
                               FetchCalendarBranchesSuccess | 
                               SelectCalendarBranch |
                               ResetCalendarBranch;
