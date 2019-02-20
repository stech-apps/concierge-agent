
import * as FlowOpenActions from '../actions';


export interface IFlowOpenState {
    FlowOpen:boolean;
};

export const initialState:IFlowOpenState = {
    FlowOpen:false
};

export function reducer(
    state: IFlowOpenState = initialState,
    action: FlowOpenActions.AllFlowActions
  ):IFlowOpenState{  
    switch (action.type) {
      case FlowOpenActions.FLOW_OPEN: {
        return {
          ...state,
          FlowOpen:true
          };
        }
      case FlowOpenActions.FLOW_CLOSE: {
        return {
          ...state,
          FlowOpen:false
        };
      }
    default: {
        return state;
      }
    }
  }