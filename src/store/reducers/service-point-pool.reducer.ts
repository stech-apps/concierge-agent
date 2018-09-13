import { IServicePointPool } from "../../models/IServicePointPool";
import * as ServicePointPoolActions from '../actions'


export interface IServicePointPoolState {
    servicePointPool: IServicePointPool[];
    loading:boolean;
    loaded:boolean;
    error:Object
  }
  
  export const initialState: IServicePointPoolState = {
    servicePointPool: [],
    loading:false,
    loaded:false,
    error:null
  };

  export function reducer(
      state:IServicePointPoolState = initialState,
      action:ServicePointPoolActions.AllServicePointPoolActions
  ):IServicePointPoolState{
    switch(action.type){
        case ServicePointPoolActions.FETCH_SERVICE_POINT_POOL_INFO:{
            return{
                ...state,             
                loading:true,
                loaded:false,
                error:null
            }
        };
        case ServicePointPoolActions.FETCH_SERVICE_POINT_POOL_INFO_SUCCESS:{
            return{
                ...state,
                servicePointPool:action.payload,             
                loading:false,
                loaded:true
            }
        }; 
        case ServicePointPoolActions.FETCH_SERVICE_POINT_POOL_INFO_FAIL:{
            return{
                ...state,             
                loading:false,
                loaded:false,
                error:action.payload
            }
        }
        case ServicePointPoolActions.RESET_SERVICE_POINT_POOL_INFO:{
            return{
                ...state, 
                servicePointPool:[],                 
                loading:false,
                loaded:false,
                error:null
            }
        };
        default: {
            return state;
          }
  }
}