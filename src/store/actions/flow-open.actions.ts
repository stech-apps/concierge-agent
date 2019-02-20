import { Action } from '@ngrx/store';


export const FLOW_OPEN = '[flow] FLOW_OPEN';
export const FLOW_CLOSE = '[flow] FLOW_CLOSE';

export class FlowOpen implements Action {
    readonly type = FLOW_OPEN;
    constructor() {}
  }
  
  export class FlowClose implements Action {
    readonly type = FLOW_CLOSE;
    constructor() {}
  }
  
  export type AllFlowActions = FlowOpen
  | FlowClose;