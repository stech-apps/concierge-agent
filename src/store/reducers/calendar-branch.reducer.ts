import { ICalendarBranch } from '../../models/ICalendarBranch';
import * as BranchActions from '../actions';

export interface ICalendarBranchState {
  branches: ICalendarBranch[];
  loginBranch: ICalendarBranch
  selectedBranch: ICalendarBranch;
  searchText: string;
  loading: boolean;
  loaded: boolean;
  error: Object;
  publicBranchesLoaded: boolean;
}

export const initialState: ICalendarBranchState = {
  branches: [],
  loginBranch: null,
  selectedBranch: { id: -1, name: '', isSkip: false, publicId: '', qpId:-1},
  searchText: '',
  loading: false,
  loaded: false,
  error: null,
  publicBranchesLoaded: false
};

export function reducer (
  state: ICalendarBranchState = initialState,
  action: BranchActions.AllCalendarBranchActions
): ICalendarBranchState {
  switch (action.type) {
    case BranchActions.FETCH_CALENDAR_BRANCHES: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case BranchActions.FETCH_CALENDAR_BRANCHES_SUCCESS: {
      return {
        ...state,
        branches: sortBranches(action.payload.branchList),
        loading: false,
        loaded: true,
        error: null,
        selectedBranch: setSelectedBranch(state)
      };
    }

    case BranchActions.FETCH_CALENDAR_BRANCHES_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case BranchActions.FETCH_PUBLIC_CALENDAR_BRANCHES: {
      return {
        ...state,
        loading: true,
        error: null,
        publicBranchesLoaded: false
      };
    }
    case BranchActions.FETCH_PUBLIC_CALENDAR_BRANCHES_SUCCESS: {
      return {
        ...state,
        branches: processBranches(state.branches, action.payload.branchList),
        loading: false,
        loaded: true,
        error: null,
        publicBranchesLoaded: true
      };
    }
    case BranchActions.FETCH_PUBLIC_CALENDAR_BRANCHES_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case BranchActions.SELECT_CALENDAR_BRANCH: {
      return {
        ...state,
        selectedBranch: action.payload
      };
    }
    case BranchActions.RESET_CALENDAR_BRANCH: {
      return {
        ...state,
        selectedBranch: state.loginBranch
      };
    }
    default: {
      return state;
    }
  }
}

/**
 * Sort branches alphabetically
 * @param branchList - Fetched branch list
 */
function sortBranches(branchList: any): ICalendarBranch[] {
  return branchList.sort(
    (branch1: ICalendarBranch, branch2: ICalendarBranch) => {
      if (branch1.name.toLowerCase() < branch2.name.toLowerCase() ) { return -1; }
      if (branch1.name.toLowerCase() > branch2.name.toLowerCase() ) { return 1; }
      return 0;
    }
  );
}

function processBranches(currentBranchList: ICalendarBranch[], branchList: any): ICalendarBranch[] {
  var aditionalList = [];
  branchList.forEach(val => {
    var elementPos = currentBranchList.map(function(x) {return x.publicId; }).indexOf(val.publicId);
    if(elementPos < 0){
      aditionalList.push(val);
    }
  })

  var fullBranchList = currentBranchList.concat(aditionalList);
  return sortBranches(fullBranchList);
}

function setSelectedBranch(state: ICalendarBranchState){
  let calendarBranch = state.branches.filter(val => {
    val.id === state.selectedBranch.id;
  })
  return calendarBranch[0];
}
